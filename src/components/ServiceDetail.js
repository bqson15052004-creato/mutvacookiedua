import React, { useState } from 'react';

const ServiceDetail = ({ service, onBack, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  if (!service) return null;

  const handleConfirm = () => {
    if (quantity < 1) {
      alert("Số lượng tối thiểu là 1"); return;
    }
    // Gọi hàm onAddToCart lấy từ App.js
    onAddToCart(service, quantity, note);
  };

  return (
    <div className="detail-container">
      <button onClick={onBack} style={{background:'none', border:'none', color:'#ccc', cursor:'pointer', marginBottom:'10px', fontSize:'1rem'}}>← Quay lại</button>
      
      <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
        <div>
          <h2 style={{color:'#007bff', fontSize:'2rem'}}>{service.name}</h2>
          <p style={{color:'#ccc', fontSize:'1.1rem', marginTop:'10px'}}>{service.description}</p>
        </div>
        
        <div style={{background:'#2c2c2c', padding:'25px', borderRadius:'10px', border:'1px solid #333'}}>
          <h3 style={{color:'#28a745', fontSize:'1.5rem', marginBottom:'20px'}}>
            Giá: {service.price.toLocaleString()}đ / {service.unit}
          </h3>
          
          <label style={{display:'block', marginBottom:'5px', color:'#fff'}}>Số lượng:</label>
          <input 
            type="number" min="1" value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            style={{width:'100%', padding:'12px', marginBottom:'15px', borderRadius:'4px', border:'none'}}
          />

          <label style={{display:'block', marginBottom:'5px', color:'#fff'}}>Ghi chú:</label>
          <input 
            placeholder="VD: Giặt kỹ cổ áo..." 
            value={note} onChange={(e) => setNote(e.target.value)} 
            style={{width:'100%', padding:'12px', marginBottom:'20px', borderRadius:'4px', border:'none'}}
          />

          <button className="btn-primary" onClick={handleConfirm} style={{width:'100%', padding:'15px', fontSize:'1.1rem'}}>
            THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </div>
    </div>
  );
};
export default ServiceDetail;