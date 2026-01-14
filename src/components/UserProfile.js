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
    const updateInfo = {
      fullName: data.fullName,
      phone: data.phone,
      address: data.address
    };
    if (data.password && data.password.trim() !== '') {
      if (data.password.length <= 5) {
        alert("Mật khẩu mới quá ngắn!"); return;
      }
      updateInfo.password = data.password;
    }
    onUpdate(updateInfo);
    setData(prev => ({ ...prev, password: '' }));
  };

  // Style nền đen (Background Image)
  const containerStyle = {
    minHeight: '100vh',
    padding: '40px 20px',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    color: '#fff'
  };

  // Style hiệu ứng kính mờ (Glassmorphism)
  const glassStyle = {
    background: 'rgba(34, 34, 34, 0.9)',
    padding: '30px',
    borderRadius: '16px',
    border: '1px solid #444',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const inputStyle = {
    width: '100%', padding: '12px', borderRadius: '8px', 
    border: '1px solid #555', background: '#222', color: '#fff', 
    outline: 'none', marginTop: '8px'
  };

  return (
    <div style={containerStyle}>
      <section style={glassStyle}>
        <h2 style={{ marginBottom: '25px', borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#007bff', fontSize: '1.8rem' }}>
          👤 Hồ sơ cá nhân
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ fontWeight: '500' }}>Họ và Tên</label>
            <input type="text" value={data.fullName} onChange={(e) => setData({...data, fullName: e.target.value})} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: '500' }}>Số điện thoại</label>
            <input type="text" value={data.phone} onChange={(e) => setData({...data, phone: e.target.value})} style={inputStyle} />
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <label style={{ fontWeight: '500' }}>Địa chỉ mặc định</label>
          <input type="text" value={data.address} onChange={(e) => setData({...data, address: e.target.value})} style={inputStyle} />
        </div>

        <div style={{ marginTop: '20px' }}>
          <label style={{ fontWeight: '500' }}>Đổi mật khẩu (Bỏ trống nếu không đổi)</label>
          <input type="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})} style={inputStyle} placeholder="Nhập mật khẩu mới..." />
        </div>

        <button onClick={handleSubmit} style={{ marginTop: '25px', padding: '12px 30px', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          Lưu thay đổi
        </button>
      </section>
    </div>
  );
};

export default UserProfile;