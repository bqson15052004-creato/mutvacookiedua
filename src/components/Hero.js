import React from 'react';

const Hero = ({ onOrderClick }) => {
  return (
    <div className="hero-container" style={{
      backgroundImage: 'url("/5lọdừa.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '750px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="hero-card" style={{ background: 'rgba(30, 30, 30, 0.8)', backdropFilter: 'blur(5px)' }}>
        <h2 style={{fontSize: '2.5rem', marginBottom: '15px', color: '#fff'}}>
          Chào mừng đến với Cửa hàng mứt dừa và kẹo cookie dừa
        </h2>
        <p style={{color: '#ccc', marginBottom: '30px', fontSize: '1.1rem'}}>
          Đăng ký hoặc đặt hàng ngay để trải nghiệm sản phẩm ngon lành nhất! 
          Thưởng thức hương vị tự nhiên từ dừa.
        </p>
        <button className="btn-primary" onClick={onOrderClick}>
          Đặt hàng ngay
        </button>
      </div>
    </div>
  );
};

export default Hero;