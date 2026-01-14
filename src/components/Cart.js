import React, { useState } from 'react';

const Cart = ({ items = [], onRemove, onCheckout, user }) => {
  const [info, setInfo] = useState({ 
    pickup: '', 
    delivery: '', 
    ship: false, 
    address: '', 
    note: '',
    paymentMethod: 'cash'
  });

  const safeItems = items || [];
  
  const totalItemPrice = safeItems.reduce((sum, i) => sum + ((i.price || 0) * (i.quantityNum || 1)), 0);
  const shipFee = info.ship ? 30000 : 0;
  const finalTotal = totalItemPrice + shipFee;

  // Hàm xử lý lấy địa chỉ mặc định từ hồ sơ user
  const handleUseDefaultAddress = () => {
    if (user && user.address) {
      setInfo({ ...info, address: user.address });
    } else {
      alert("Bạn chưa lưu địa chỉ mặc định trong hồ sơ!");
    }
  };

  const handleBook = () => {
    if (!info.delivery) {
      alert("Vui lòng chọn thời gian nhận hàng!");
      return;
    }
    if (info.ship && !info.address) {
      alert("Vui lòng nhập địa chỉ nhận hàng!");
      return;
    }
    onCheckout({ ...info, totalItemPrice, shipFee, finalTotal });
  };
  
  const containerStyle = {
    minHeight: '100vh',
    padding: '60px 20px',
    backgroundImage: `url('5lọdừa.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    color: '#fff'
  };

  const glassCardStyle = {
    background: 'rgba(34, 34, 34, 0.85)',
    padding: '40px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
    maxWidth: '800px',
    width: '100%',
    margin: '0 auto'
  };

  if (safeItems.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={glassCardStyle}>
           <div style={{textAlign: 'center'}}>
            <h2 style={{fontSize: '2.5rem', marginBottom: '20px'}}>🛒 Giỏ hàng trống</h2>
            <p style={{fontSize: '1.2rem', color: '#ccc'}}>Vui lòng chọn món ăn để tiếp tục.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={glassCardStyle}>
        <h2 style={{
          borderBottom: '2px solid #007bff', 
          paddingBottom: '15px', 
          marginBottom: '30px', 
          color: '#00d4ff',
          fontSize: '2rem', 
          textAlign: 'center', 
          textTransform: 'uppercase'
        }}>
          Đơn hàng của bạn
        </h2>
        
        {/* 1. Danh sách món ăn */}
        <div style={{marginBottom: '30px'}}>
          {safeItems.map((item, idx) => (
            <div key={idx} className="cart-item" style={{
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '20px', 
              background: 'rgba(255, 255, 255, 0.05)', 
              marginBottom: '15px', 
              borderRadius: '12px', 
              border: '1px solid rgba(255,255,255,0.1)', 
              alignItems: 'center'
            }}>
              <div>
                <b style={{color: '#007bff', fontSize: '1.2rem'}}>{item.name}</b> <br/>
                <span style={{color: '#ccc', fontSize: '0.95rem'}}>
                  Khối lượng: <strong style={{color: '#fff'}}>{item.selectedWeight || item.quantity}</strong> | SL: {item.quantityNum || 1}
                </span>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                <strong style={{color: '#ffc107', fontSize: '1.2rem'}}>
                  {((item.price || 0) * (item.quantityNum || 1)).toLocaleString()}đ
                </strong>
                <button onClick={() => onRemove(idx)} style={{color: '#fff', background: '#dc3545', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
        
        {/* 2. Form Giao hàng & Thanh toán */}
        <div className="checkout-form" style={{background: 'rgba(0, 0, 0, 0.3)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(0, 123, 255, 0.3)'}}>
          <h3 style={{marginBottom: '25px', color: '#ffc107', textAlign: 'center', fontSize: '1.5rem'}}>Thông tin nhận hàng</h3>
          
          <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '12px', fontWeight: 'bold'}}>Hình thức nhận hàng:</label>
              <div style={{display: 'flex', gap: '15px'}}>
                  <button onClick={() => setInfo({...info, ship: false})} style={{flex: 1, padding: '12px', borderRadius: '8px', background: !info.ship ? '#007bff' : '#333', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}>Đến lấy trực tiếp</button>
                  <button onClick={() => setInfo({...info, ship: true})} style={{flex: 1, padding: '12px', borderRadius: '8px', background: info.ship ? '#007bff' : '#333', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}>Giao tận nơi (+30k)</button>
              </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#fff', display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Thời gian mong muốn nhận hàng
            </label>
            <input
              type="datetime-local"
              // Thêm thuộc tính min để chặn chọn thời gian quá khứ
              min={new Date().toISOString().slice(0, 16)} 
              value={info.delivery}
              onChange={(e) => setInfo({ ...info, delivery: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #444',
                background: '#222',
                color: '#fff',
                outline: 'none',
              }}
            />
          </div>
          {info.ship && (
            <div style={{marginBottom: '20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <label style={{color: '#fff', fontWeight: '500'}}>Địa chỉ nhận hàng chi tiết</label>
                {/* NÚT ĐỊA CHỈ MẶC ĐỊNH */}
                <button 
                  onClick={handleUseDefaultAddress}
                  style={{
                    background: 'none', 
                    border: '1px solid #00d4ff', 
                    color: '#00d4ff', 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    fontSize: '0.8rem', 
                    cursor: 'pointer',
                    transition: '0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(0, 212, 255, 0.1)'}
                  onMouseOut={(e) => e.target.style.background = 'none'}
                >
                  📍 Sử dụng địa chỉ mặc định
                </button>
              </div>
              <input 
                placeholder="Số nhà, tên đường, quận/huyện..." 
                value={info.address} 
                onChange={e => setInfo({...info, address: e.target.value})} 
                style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: '#fff', outline: 'none'}} 
              />
            </div>
          )}

          <div style={{marginBottom: '30px'}}>
            <label style={{color: '#fff', display:'block', marginBottom:'8px', fontWeight: '500'}}>Ghi chú cho cửa hàng</label>
            <textarea placeholder="Ví dụ: Gọi trước khi giao,..." value={info.note} onChange={e => setInfo({...info, note: e.target.value})} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: '#fff', minHeight: '80px', outline: 'none'}} />
          </div>

          {/* 3. Tổng kết thanh toán */}
          <div style={{borderTop: '2px solid rgba(255,255,255,0.1)', paddingTop: '25px', textAlign: 'right'}}>
            <p style={{color: '#aaa', fontSize: '1.1rem'}}>Tiền hàng: {totalItemPrice.toLocaleString()}đ</p>
            {info.ship && <p style={{color: '#aaa', fontSize: '1.1rem'}}>Phí vận chuyển: 30.000đ</p>}
            <h2 style={{color: '#28a745', margin: '15px 0', fontSize: '2.5rem', fontWeight: '800'}}>Tổng: {finalTotal.toLocaleString()}đ</h2>
            
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', textAlign: 'left', marginBottom: '10px', fontWeight: 'bold'}}>Phương thức thanh toán:</label>
              <div style={{display: 'flex', gap: '10px'}}>
                  <button onClick={() => setInfo({...info, paymentMethod: 'cash'})} style={{flex: 1, padding: '15px', borderRadius: '10px', background: info.paymentMethod === 'cash' ? '#28a745' : '#333', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold'}}>Tiền mặt (COD)</button>
                  <button onClick={() => setInfo({...info, paymentMethod: 'banking'})} style={{flex: 1, padding: '15px', borderRadius: '10px', background: info.paymentMethod === 'banking' ? '#28a745' : '#333', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold'}}>Chuyển khoản</button>
              </div>
            </div>

            {info.paymentMethod === 'banking' && (
              <div style={{background: '#fff', padding: '25px', borderRadius: '15px', color: '#000', textAlign: 'center', marginTop: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.2)'}}>
                  <p style={{fontWeight: 'bold', marginBottom: '15px', fontSize: '1.1rem'}}>Quét mã QR để thanh toán</p>
                  <img src="/QR.jpg" alt="QR" style={{width: '200px', height: 'auto', border: '1px solid #eee', borderRadius: '8px'}} />
                  <div style={{fontSize: '0.95rem', marginTop: '15px', background: '#f8f9fa', padding: '15px', borderRadius: '10px', borderLeft: '5px solid #28a745'}}>
                      Nội dung: <b style={{fontSize: '1.1rem'}}>{user?.fullName || 'Khach'} {finalTotal.toLocaleString()}d</b>
                  </div>
              </div>
            )}

            <button onClick={handleBook} style={{width: '100%', padding: '20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.4rem', cursor: 'pointer', marginTop: '30px', boxShadow: '0 5px 15px rgba(0,123,255,0.4)', transition: '0.3s'}}>
              XÁC NHẬN ĐẶT HÀNG NGAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;