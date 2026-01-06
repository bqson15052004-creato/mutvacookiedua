import React, { useState } from 'react';

const Cart = ({ items = [], onRemove, onCheckout, user }) => {
  const [info, setInfo] = useState({ 
    pickup: '', 
    delivery: '', 
    ship: false, 
    note: '',
    paymentMethod: 'cash' // Mặc định là tiền mặt
  });

  const safeItems = items || [];
  
  // Tính toán tiền
  const totalItemPrice = safeItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const shipFee = info.ship ? 30000 : 0;
  const finalTotal = totalItemPrice + shipFee;

  const handleBook = () => {
    // 1. Validate thông tin
    if (!info.pickup || !info.delivery) {
      alert("Vui lòng chọn đầy đủ thời gian nhận và trả đồ!");
      return;
    }

    // 2. Validate thời gian (như cũ)
    const pickupDate = new Date(info.pickup);
    const deliveryDate = new Date(info.delivery);
    const now = new Date();

    if (pickupDate < now) {
      alert("Thời gian lấy đồ không thể ở quá khứ!"); return;
    }
    if (deliveryDate <= pickupDate) {
      alert("Thời gian nhận lại phải sau thời gian lấy đồ!"); return;
    }
    if (deliveryDate.getTime() - pickupDate.getTime() < 4 * 60 * 60 * 1000) {
      alert("Cần tối thiểu 4 tiếng để giặt sấy!"); return;
    }

    // 3. Gửi đơn hàng
    onCheckout({ 
      ...info, 
      totalItemPrice, 
      finalTotal 
    });
  };
  
  if (safeItems.length === 0) {
    return (
      <div className="cart-container" style={{textAlign: 'center', padding: '50px'}}>
        <h2 style={{color: '#888'}}>Giỏ hàng trống</h2>
        <p>Vui lòng chọn dịch vụ để tiếp tục.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 style={{borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px'}}>
        Giỏ hàng & Thanh toán
      </h2>
      
      {/* 1. Danh sách sản phẩm */}
      <div style={{marginBottom: '30px'}}>
        {safeItems.map((item, idx) => (
          <div key={idx} className="cart-item" style={{display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#2c2c2c', marginBottom: '10px', borderRadius: '5px'}}>
            <div>
              <b style={{color: '#007bff'}}>{item.name}</b> <br/>
              <span style={{color: '#ccc'}}>{item.quantity} {item.unit} x {item.price.toLocaleString()}đ</span>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
              <strong>{(item.price * item.quantity).toLocaleString()}đ</strong>
              <button onClick={() => onRemove(idx)} style={{color: '#fff', background: '#dc3545', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'}}>Xóa</button>
            </div>
          </div>
        ))}
      </div>
      
      {/* 2. Form thông tin */}
      <div className="checkout-form" style={{background: '#222', padding: '20px', borderRadius: '8px'}}>
        <h3 style={{marginBottom: '15px', color: '#fff'}}>Thông Tin Giao Nhận</h3>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px'}}>
          <div>
            <label style={{color: '#ccc', display:'block', marginBottom:'5px'}}>Thời gian lấy đồ:</label> 
            <input type="datetime-local" onChange={e => setInfo({...info, pickup: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '4px', border: 'none'}} />
          </div>
          <div>
            <label style={{color: '#ccc', display:'block', marginBottom:'5px'}}>Thời gian nhận lại:</label> 
            <input type="datetime-local" onChange={e => setInfo({...info, delivery: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '4px', border: 'none'}} />
          </div>
        </div>

        <div style={{margin: '15px 0', display: 'flex', alignItems: 'center'}}>
          <input type="checkbox" id="ship" style={{width: '20px', height: '20px'}} onChange={e => setInfo({...info, ship: e.target.checked})} /> 
          <label htmlFor="ship" style={{marginLeft: '10px', cursor: 'pointer'}}>Shipper giao tận nơi (+30,000đ)</label>
        </div>

        <input placeholder="Ghi chú thêm..." onChange={e => setInfo({...info, note: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '4px', border: 'none', marginBottom:'20px'}} />

        {/* 3. PHẦN THANH TOÁN (MỚI) */}
        <div style={{borderTop: '1px solid #444', paddingTop: '20px', marginTop: '20px'}}>
          <h3 style={{color: '#fff', marginBottom: '15px'}}>Phương Thức Thanh Toán</h3>
          
          <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
            <label style={{background: info.paymentMethod === 'cash' ? '#007bff' : '#333', padding: '15px', borderRadius: '8px', cursor: 'pointer', flex: 1, textAlign: 'center', transition: '0.3s'}}>
              <input 
                type="radio" 
                name="payment" 
                value="cash" 
                checked={info.paymentMethod === 'cash'} 
                onChange={e => setInfo({...info, paymentMethod: e.target.value})}
                style={{display: 'none'}}
              />
               Tiền mặt
            </label>

            <label style={{background: info.paymentMethod === 'banking' ? '#007bff' : '#333', padding: '15px', borderRadius: '8px', cursor: 'pointer', flex: 1, textAlign: 'center', transition: '0.3s'}}>
              <input 
                type="radio" 
                name="payment" 
                value="banking" 
                checked={info.paymentMethod === 'banking'} 
                onChange={e => setInfo({...info, paymentMethod: e.target.value})}
                style={{display: 'none'}}
              />
               Chuyển khoản
            </label>
          </div>

          {/* HIỆN QR NẾU CHỌN BANKING */}
          {info.paymentMethod === 'banking' && (
            <div style={{background: '#fff', padding: '20px', borderRadius: '8px', color: '#000', textAlign: 'center', marginBottom: '20px'}}>
              <p style={{fontWeight: 'bold', marginBottom: '10px'}}>Quét mã để thanh toán nhanh:</p>
              {/* API tạo QR Code đơn giản */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CK ${finalTotal}k cho Giặt Là`} 
                alt="QR Code" 
                style={{border: '1px solid #ccc', padding: '5px'}}
              />
              <div style={{marginTop: '10px', fontSize: '0.9rem'}}>
                <p>Ngân hàng: <strong>MB Bank</strong></p>
                <p>STK: <strong>999999999</strong></p>
                <p>Chủ TK: <strong>NGUYEN VAN CHU TIEM</strong></p>
                <p>Nội dung: <strong>{user?.fullName || 'Khach'} thanh toan</strong></p>
              </div>
            </div>
          )}
        </div>

        {/* 4. Tổng kết & Nút đặt */}
        <div style={{textAlign: 'right', borderTop: '1px solid #444', paddingTop: '15px'}}>
          <p>Tiền hàng: {totalItemPrice.toLocaleString()}đ</p>
          <p>Phí ship: {shipFee.toLocaleString()}đ</p>
          <h2 style={{color: '#28a745', margin: '10px 0', fontSize: '1.8rem'}}>Tổng: {finalTotal.toLocaleString()}đ</h2>
          <button className="btn-primary" onClick={handleBook} style={{width: '100%', padding: '15px', fontSize: '1.2rem', fontWeight: 'bold'}}>
            XÁC NHẬN ĐẶT ĐƠN ({info.paymentMethod === 'cash' ? 'Trả sau' : 'Đã CK'})
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;