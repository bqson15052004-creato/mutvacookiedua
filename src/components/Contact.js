import React from 'react';

const Contact = () => {
  // Style chung cho container - Đồng bộ ảnh nền với trang chủ
  const containerStyle = {
    // Sử dụng thêm lớp phủ tối để chữ và khung kính rõ nét hơn
    backgroundImage: 'url("/5lọdừa.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed', // Giữ ảnh cố định khi cuộn
    minHeight: '100vh', // Sử dụng vh để phủ kín toàn bộ màn hình
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  // Style cho khung nội dung (Glassmorphism)
  const glassCardStyle = {
    background: 'rgba(34, 34, 34, 0.85)',
    padding: '50px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%'
  };

  // Style cho từng mục liên hệ
  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '15px 20px',
    borderRadius: '12px',
    marginBottom: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    color: '#fff',
    border: '1px solid transparent'
  };

  // Icon logo
  const iconStyle = {
    width: '40px',
    height: '40px',
    marginRight: '20px',
    objectFit: 'contain'
  };

  return (
    <div style={containerStyle}>
      <div style={glassCardStyle}>
        <h2 style={{ marginBottom: '10px', fontSize: '2rem', color: '#00d4ff' }}>Liên hệ với chúng tôi</h2>
        <p style={{ marginBottom: '40px', color: '#ffffff' }}>
          Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
        </p>

        {/* 1. Facebook */}
        <a 
          href="https://facebook.com" 
          target="_blank" 
          rel="noreferrer"
          style={itemStyle}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(24, 119, 242, 0.2)'; e.currentTarget.style.border = '1px solid #1877f2'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.border = '1px solid transparent'; }}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png" alt="Facebook" style={iconStyle} />
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Facebook Fanpage</h4>
            <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Mứt Dừa & Cookie</span>
          </div>
        </a>

        {/* 2. Zalo */}
        <a 
          href="https://zalo.me/0389632663" 
          target="_blank" 
          rel="noreferrer"
          style={itemStyle}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0, 104, 255, 0.2)'; e.currentTarget.style.border = '1px solid #0068ff'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.border = '1px solid transparent'; }}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png" alt="Zalo" style={iconStyle} />
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Chat Zalo</h4>
            <span style={{ fontSize: '0.9rem', color: '#ccc' }}>0389632663</span>
          </div>
        </a>

        {/* 3. Gmail */}
        <a 
          href="mailto:thuytitt@gmail.com" 
          style={itemStyle}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(234, 67, 53, 0.2)'; e.currentTarget.style.border = '1px solid #ea4335'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.border = '1px solid transparent'; }}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png" alt="Gmail" style={iconStyle} />
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Gửi Email</h4>
            <span style={{ fontSize: '0.9rem', color: '#ccc' }}>thuytitt@gmail.com</span>
          </div>
        </a>

      </div>
    </div>
  );
};

export default Contact;