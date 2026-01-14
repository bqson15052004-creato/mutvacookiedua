import React, { useState } from 'react';

const AuthModal = ({ onClose, onLogin, onRegister }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', pass: '', confirm: '' });
  const [error, setError] = useState('');

  // Hàm kiểm tra định dạng Email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = () => {
    setError('');

    // 1. Validate dữ liệu trống
    if (!form.email || !form.pass) {
      setError("Vui lòng nhập đầy đủ Email và Mật khẩu"); return;
    }

    // 2. BẮT BUỘC PHẢI LÀ EMAIL (Trừ admin)
    if (form.email !== 'admin' && !isValidEmail(form.email)) {
      setError("Vui lòng nhập đúng định dạng Email (ví dụ: sondeptrai@gmail.com)"); 
      return;
    }

    // 3. Logic Đăng ký
    if (isRegister) {
      if (!form.name || form.name.trim() === '') {
        setError("Tên hiển thị không được để trống!"); return;
      }
      // Vẫn giữ validate ngầm để tránh lỗi, nhưng không hiện ở label
      if (form.name.length >= 15) {
        setError("Tên hiển thị quá dài (tối đa 15 ký tự)!"); return;
      }
      if (form.pass.length <= 5) {
        setError("Mật khẩu phải trên 5 ký tự!"); return;
      }
      if (form.pass !== form.confirm) { 
        setError("Mật khẩu nhập lại không khớp!"); return; 
      }
      
      onRegister(form.name, form.email, form.pass, setError);
    } else {
      // Logic Đăng nhập
      onLogin(form.email, form.pass, setError);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{width: '400px', maxWidth: '95%'}}>
        {/* Header Tabs */}
        <div className="auth-tabs" style={{display: 'flex', borderBottom: '1px solid #ddd'}}>
          <button 
            className={`auth-tab ${!isRegister ? 'active' : ''}`} 
            onClick={() => {setIsRegister(false); setError('')}}
            style={{
              flex: 1, padding: '15px', border: 'none', cursor: 'pointer', fontWeight: 'bold', 
              background: !isRegister ? '#fff' : '#f1f1f1', 
              color: !isRegister ? '#007bff' : '#666', 
              borderTop: !isRegister ? '3px solid #007bff' : '3px solid transparent'
            }}
          >
            Đăng Nhập
          </button>
          <button 
            className={`auth-tab ${isRegister ? 'active' : ''}`} 
            onClick={() => {setIsRegister(true); setError('')}}
            style={{
              flex: 1, padding: '15px', border: 'none', cursor: 'pointer', fontWeight: 'bold', 
              background: isRegister ? '#fff' : '#f1f1f1', 
              color: isRegister ? '#007bff' : '#666', 
              borderTop: isRegister ? '3px solid #007bff' : '3px solid transparent'
            }}
          >
            Đăng Ký
          </button>
        </div>

        {/* Body Form */}
        <div className="auth-body" style={{padding: '25px'}}>
          {error && (
            <div style={{color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #f5c6cb', fontSize: '0.9rem'}}>
              ⚠️ {error}
            </div>
          )}
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            {isRegister && (
              <div>
                <label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem'}}>Tên hiển thị</label>
                <input 
                  placeholder="Ví dụ: sondeptrai" 
                  value={form.name}
                  onChange={e=>setForm({...form, name:e.target.value})} 
                  style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
                />
              </div>
            )}
            
            <div>
              <label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem'}}>Email</label>
              <input 
                placeholder="vidu@email.com" 
                value={form.email}
                onChange={e=>setForm({...form, email:e.target.value})} 
                style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
              />
            </div>
            
            <div>
              <label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem'}}>Mật khẩu</label>
              <input 
                type="password" 
                placeholder="Nhập mật khẩu..." 
                value={form.pass}
                onChange={e=>setForm({...form, pass:e.target.value})} 
                style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
              />
            </div>
            
            {isRegister && (
              <div>
                <label style={{display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'0.9rem'}}>Nhập lại mật khẩu</label>
                <input 
                  type="password" 
                  placeholder="Xác nhận mật khẩu..." 
                  value={form.confirm}
                  onChange={e=>setForm({...form, confirm:e.target.value})} 
                  style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
                />
              </div>
            )}
          </div>
          
          <div style={{marginTop: '20px'}}>
            <button className="btn-primary" onClick={handleSubmit} style={{width: '100%', padding: '12px', fontSize: '1rem', marginBottom: '10px'}}>
              {isRegister ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập'}
            </button>
            <button onClick={onClose} style={{width:'100%', background:'transparent', border:'none', cursor:'pointer', color:'#666', padding: '5px'}}>
              Đóng cửa sổ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuthModal;