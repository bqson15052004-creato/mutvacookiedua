import React, { useState } from 'react';

const ServiceDetail = ({ service, onBack, onAddToCart, user, setShowAuth }) => {
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');

  if (!service) return null;

  const handleConfirm = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thực hiện thêm vào giỏ hàng!");
      setShowAuth(true);
      return;
    }
    if (!quantity) {
      alert("Vui lòng chọn khối lượng!"); 
      return;
    }

    // Tìm option mà khách hàng đã chọn (ví dụ: tìm cái label "500g")
    const selectedOption = service.options?.find(opt => opt.label === quantity);
    
    // Tạo một đối tượng sản phẩm mới để gửi vào giỏ hàng
    const itemToAdd = {
      ...service,
      quantity: quantity,
      price: selectedOption ? selectedOption.price : service.price,
      quantityNum: 1
    };

    // Gọi hàm onAddToCart và truyền đối tượng đã đóng gói này
    onAddToCart(itemToAdd); 
  };

  const selectedOption = service.options?.find(opt => opt.label === quantity);
  const currentPrice = selectedOption ? selectedOption.price : 0;

  const backgroundStyle = {
    // 1. Giảm độ mờ từ 0.7 xuống 0.2 để ảnh nền SÁNG RÕ hơn
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/${service.btnImage}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  };

  return (
    <div style={backgroundStyle}>
      <div className="detail-container" style={{
        // 2. Chỉnh background thành rgba trắng mờ và thêm backdropFilter để làm TRONG SUỐT xuyên thấu ảnh nền
        background: 'rgba(255, 255, 255, 0.1)', 
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '35px',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '800px',
        width: '100%',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <button 
          onClick={onBack} 
          style={{background: 'none', border: 'none', color: '#eee', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold'}}
        >
          ← Quay lại
        </button>

        <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div>
            <h2 style={{color: '#007bff', fontSize: '2.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>{service.name}</h2>
            <p style={{color: '#fff', fontSize: '1.1rem', marginTop: '10px', lineHeight: '1.6'}}>{service.description}</p>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '25px', 
            borderRadius: '12px', 
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <label style={{display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '500'}}>Khối lượng:</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#fff'}}
            >
              <option value="">-- Chọn khối lượng --</option>
              {service.options && service.options.map(opt => (
                <option key={opt.label} value={opt.label}>{opt.label}</option>
              ))}
            </select>

            <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '6px' }}>
              <span style={{ color: '#fff' }}>Giá tiền: </span>
              <strong style={{ color: '#fff', fontSize: '15px' }}>
                {currentPrice > 0 ? `${currentPrice.toLocaleString()}đ` : 'Vui lòng chọn khối lượng'}
              </strong>
            </div>

            <label style={{display: 'block', marginBottom: '8px', color: '#fff', fontWeight: '500'}}>Ghi chú:</label>
            <input
              placeholder="Thêm yêu cầu đặc biệt..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{width: '100%', padding: '12px', marginBottom: '25px', borderRadius: '6px', border: '1px solid #ccc'}}
            />

            <button 
              onClick={handleConfirm} // Đã thêm hàm xử lý click ở đây
              className="add-to-cart-btn"
              style={{
                width: '100%', 
                padding: '16px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontWeight: 'bold',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: '0.3s'
              }}
            >
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;