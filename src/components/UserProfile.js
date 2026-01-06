import React, { useState, useEffect } from 'react';

const UserProfile = ({ user, onUpdate }) => {
  const [data, setData] = useState({ 
    fullName: '', 
    phone: '', 
    address: '',
    password: '' 
  });

  useEffect(() => {
    if (user) {
      setData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
        password: '' 
      });
    }
  }, [user]);

  const handleSubmit = () => {
    if (!data.fullName || data.fullName.trim() === '') {
      alert("Họ và tên không được để trống!"); return;
    }
    if (!data.phone || !data.address) {
      alert("Vui lòng nhập đủ SĐT và Địa chỉ!"); return;
    }

    const updateInfo = {
      fullName: data.fullName,
      phone: data.phone,
      address: data.address
    };
    
    if (data.password && data.password.trim() !== '') {
      if (data.password.length <= 5 || data.password.length >= 15) {
        alert("Mật khẩu mới phải lớn hơn 5 và nhỏ hơn 15 ký tự!"); return;
      }
      updateInfo.password = data.password;
    }

    // Gọi hàm onUpdate truyền từ App.js
    onUpdate(updateInfo);
  };

  return (
    <div className="profile-container">
      <h2 style={{marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px', color: '#007bff'}}>
        Hồ sơ cá nhân
      </h2>
      
      <div style={{marginBottom: '15px'}}>
        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Họ và Tên <span style={{color:'red'}}>*</span></label>
        <input type="text" value={data.fullName} onChange={(e) => setData({...data, fullName: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc'}} />
      </div>

      <div style={{marginBottom: '15px'}}>
        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Số điện thoại <span style={{color:'red'}}>*</span></label>
        <input type="text" value={data.phone} onChange={(e) => setData({...data, phone: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc'}} />
      </div>

      <div style={{marginBottom: '20px'}}>
        <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Địa chỉ nhận đồ <span style={{color:'red'}}>*</span></label>
        <input type="text" value={data.address} onChange={(e) => setData({...data, address: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc'}} />
      </div>

      <div style={{marginTop: '30px', background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee'}}>
        <h3 style={{fontSize:'1.1rem', marginBottom:'10px', color: '#333'}}>Đổi mật khẩu</h3>
        <input type="password" placeholder="Mật khẩu mới (bỏ qua nếu không đổi)..." value={data.password} onChange={(e) => setData({...data, password: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', background:'#fff'}} />
      </div>

      <button className="btn-primary" onClick={handleSubmit} style={{marginTop:'20px', width: '100%', padding: '12px', fontSize: '1.1rem'}}>
        Lưu Thay Đổi
      </button>
    </div>
  );
};

export default UserProfile;