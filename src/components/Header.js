import React from 'react';
import { servicesData } from '../data/servicesData';
// Thêm prop services vào đây
const Header = ({ setView, user, cartCount, onLoginClick, onLogout, onServiceSelect}) => {
  return (
    <div className="header">
      <div className="logo" onClick={() => setView('home')}>
        MỨT DỪA & KẸO COOKIE DỪA
      </div>
      
      <div className="nav-links">
        <button className="nav-btn" onClick={() => setView('home')}>
          🏠 Trang chủ
        </button>
        
        {/* DROPDOWN DỊCH VỤ ĐỘNG */}
        <div className="nav-item-dropdown">
          <button className="nav-btn">
            🍪 Sản phẩm
          </button>
          <div className="dropdown-menu">
            {servicesData.map(service => (
              <div 
                key={service.id}
                className="dropdown-item"
                onClick={() => onServiceSelect(service)}
              >
                {service.name}
              </div>
            ))}
          </div>
        </div>

        {cartCount >= 0 && (
          <button className="nav-btn" onClick={() => setView('cart')}>
            🛒 Giỏ hàng ({cartCount})
          </button>
        )}
        <button className="nav-btn" onClick={() => setView('contact')}>
          📞 Liên hệ
        </button>
        {user ? (
          <div className="nav-item-dropdown">
            <button className="nav-btn">👤 {user.fullName} ▼</button>
            <div className="dropdown-menu" style={{right: 0, left: 'auto'}}>
              <div className="dropdown-item" onClick={() => setView('profile')}>Hồ sơ của tôi</div>
              <div className="dropdown-item" onClick={() => setView('my-orders')}>Đơn hàng</div>
              {user.role === 'admin' && (
                <div className="dropdown-item" onClick={() => setView('admin')}>Quản lý shop</div>
              )}
              <div className="dropdown-item" onClick={onLogout} style={{borderTop:'1px solid #ddd'}}>Đăng xuất</div>
            </div>
          </div>
        ) : (
          <button className="nav-btn" onClick={onLoginClick}>Đăng nhập</button>
        )}
      </div>
    </div>
  );
};

export default Header;