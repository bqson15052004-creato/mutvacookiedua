import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import ServiceDetail from './components/ServiceDetail';
import Cart from './components/Cart';
import UserProfile from './components/UserProfile';
import Admin from './pages/Admin';
import Home from './pages/Home'; 
// Đổi tên import để dùng làm dữ liệu khởi tạo ban đầu
import { servicesData as initialServices } from './data/servicesData'; 

function App() {
  const [view, setView] = useState('home');
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // State đánh giá
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // --- 1. STATE DỊCH VỤ (MỚI) ---
  // Load từ LocalStorage, nếu chưa có thì lấy từ file initialServices
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('services');
      return saved ? JSON.parse(saved) : initialServices;
    } catch { return initialServices; }
  });

  // --- 2. STATE FEEDBACK ---
  const [feedbacks, setFeedbacks] = useState(() => {
    try {
      const saved = localStorage.getItem('feedbacks');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const statusLabels = {
    pending: 'Chờ xử lý', processing: 'Đang xử lý', shipping: 'Đang giao', delivered: '✅ Đã giao', cancelled: '❌ Đã hủy'
  };
  
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString('vi-VN') : '---';

  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('users')) || [{email:'admin', password:'123', fullName:'Chủ Shop', role:'admin'}]; } catch { return []; }
  });
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('orders')) || []; } catch { return []; }
  });

  // --- 3. ĐỒNG BỘ LOCALSTORAGE ---
  useEffect(() => { localStorage.setItem('services', JSON.stringify(services)); }, [services]); // Lưu dịch vụ
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('feedbacks', JSON.stringify(feedbacks)); }, [feedbacks]);

  // --- 4. HÀM QUẢN LÝ DỊCH VỤ (CRUD) ---
  const handleServiceAction = (action, payload) => {
    if (action === 'add') {
      const newService = { ...payload, id: Date.now().toString() };
      setServices([...services, newService]);
      alert("Đã thêm dịch vụ mới!");
    } else if (action === 'update') {
      setServices(services.map(s => s.id === payload.id ? payload : s));
      alert("Đã cập nhật dịch vụ!");
    } else if (action === 'delete') {
      if (window.confirm("Bạn chắc chắn muốn xóa dịch vụ này?")) {
        setServices(services.filter(s => s.id !== payload));
      }
    }
  };

  // --- LOGIC CŨ GIỮ NGUYÊN ---
  const handleOrderReview = () => {
    if (!comment.trim()) { alert("Vui lòng nhập nội dung đánh giá!"); return; }
    const newFeedback = { id: Date.now(), name: user.fullName, rating: rating, comment: comment, date: new Date().toISOString(), orderId: selectedOrder.id };
    setFeedbacks([newFeedback, ...feedbacks]);
    const updatedOrders = orders.map(o => o.id === selectedOrder.id ? { ...o, isReviewed: true } : o);
    setOrders(updatedOrders);
    setSelectedOrder({ ...selectedOrder, isReviewed: true });
    setComment(''); setRating(5); alert("Cảm ơn bạn đã đánh giá dịch vụ!");
  };

  const handleLogin = (email, pass, setError) => {
    const found = users.find(u => u.email === email && u.password === pass);
    if (found) { setUser(found); setShowAuth(false); if (found.role === 'admin') setView('admin'); } else setError('Sai email hoặc mật khẩu!');
  };
  const handleRegister = (n, e, p, cb) => { if (users.find(u => u.email === e)) return cb('Email tồn tại'); const u = { email: e, password: p, fullName: n, role: 'customer', phone: '', address: '' }; setUsers([...users, u]); setUser(u); setShowAuth(false); };
  const handleLogout = () => { setUser(null); setCart([]); setView('home'); };
  const handleUpdateProfile = (i) => { const u = { ...user, ...i }; setUser(u); setUsers(users.map(x => x.email === user.email ? u : x)); alert("Cập nhật thành công!"); if (cart.length > 0) setView('cart'); };
  const handleAddToCart = (s, q, n) => { setCart([...cart, { ...s, quantity: parseInt(q), note: n }]); alert(`Đã thêm "${s.name}" vào giỏ!`); setView('home'); };
  const checkout = (i) => { if (!user) { setShowAuth(true); return; } if (!user.phone || !user.address) { alert("Vui lòng cập nhật địa chỉ!"); setView('profile'); return; } const o = { id: Date.now(), customerName: user.fullName, phone: user.phone, address: user.address, items: cart, ...i, status: 'pending', createdAt: new Date().toISOString(), isReviewed: false }; setOrders([o, ...orders]); setCart([]); alert("Đặt hàng thành công!"); setView('my-orders'); };
  const updateOrderStatus = (id, st) => { setOrders(orders.map(o => o.id === id ? { ...o, status: st } : o)); };
  const updateOrderQuantity = (oid, idx, q) => { if (q < 1) return; const ns = orders.map(o => { if (o.id === oid) { const i = [...o.items]; i[idx].quantity = parseInt(q); const t = i.reduce((s, x) => s + x.price * x.quantity, 0); return { ...o, items: i, totalPrice: t, finalTotal: t + (o.ship ? 30000 : 0) }; } return o; }); setOrders(ns); };
  const handleToggleRole = (e) => { if (user && e === user.email) { alert("Bạn không thể tự giáng cấp chính mình!"); return; } const us = users.map(u => u.email === e ? { ...u, role: u.role === 'admin' ? 'customer' : 'admin' } : u); setUsers(us); alert("Cập nhật quyền hạn thành công!"); };
  const handleDeleteUser = (e) => { if(window.confirm('Xóa user này?')) setUsers(users.filter(u => u.email !== e)); };
  const scrollToServices = () => { const s = document.getElementById('services-section'); if (s) s.scrollIntoView({ behavior: 'smooth' }); };
  const handleViewOrder = (o) => { setSelectedOrder(o); setRating(5); setComment(''); setView('order-detail'); };

  return (
    <div className="App">
      {/* Truyền services xuống Header */}
      <Header setView={setView} user={user} cartCount={cart.length} onLogout={handleLogout} onLoginClick={() => setShowAuth(true)} onServiceSelect={(s)=>{setSelectedService(s); setView('detail');}} services={services} />

      {/* Truyền services xuống Home */}
      {view === 'home' && (
        <Home 
          services={services} 
          feedbacks={feedbacks}
          onOrderClick={scrollToServices}
          onServiceSelect={(s) => { setSelectedService(s); setView('detail'); }}
        />
      )}

      {view === 'detail' && <ServiceDetail service={selectedService} onBack={() => setView('home')} onAddToCart={handleAddToCart} />}
      {view === 'cart' && <Cart items={cart} onRemove={(i)=>setCart(cart.filter((_,x)=>x!==i))} onCheckout={checkout} user={user} setView={setView} />}
      {view === 'profile' && <UserProfile user={user} onUpdate={handleUpdateProfile} />}
      
      {/* Truyền services và hàm quản lý xuống Admin */}
      {view === 'admin' && user?.role === 'admin' && (
        <Admin 
          orders={orders} 
          users={users} 
          services={services}
          currentUser={user} 
          updateStatus={updateOrderStatus} 
          onDeleteUser={handleDeleteUser} 
          onToggleRole={handleToggleRole} 
          updateOrderQuantity={updateOrderQuantity} 
          onUpdateAdmin={handleUpdateProfile}
          onServiceAction={handleServiceAction}
        />
      )}

      {/* ... (Các phần view my-orders, contact, order-detail giữ nguyên như code cũ của bạn) ... */}
      {view === 'my-orders' && (
        <div className="cart-container">
          <h2 style={{borderBottom:'1px solid #444', paddingBottom:'10px'}}>Đơn hàng của tôi</h2>
          {orders.filter(o => o.customerName === user?.fullName).length === 0 ? (
             <p style={{textAlign:'center', marginTop:'20px', color:'#888'}}>Chưa có đơn hàng nào.</p>
          ) : (
            orders.filter(o => o.customerName === user?.fullName).map(o => (
              <div key={o.id} className="order-list-item" onClick={() => handleViewOrder(o)} style={{borderLeft: `5px solid ${o.status==='done'?'green': o.status==='cancelled'?'red':'orange'}`}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <strong>Đơn #{o.id}</strong> 
                  <span className={`badge badge-${o.status}`}>{statusLabels[o.status] || o.status}</span>
                </div>
                <p style={{marginTop:'10px', color:'#ccc', fontSize:'0.9rem'}}>Ngày đặt: {formatDate(o.createdAt)}</p>
                <p style={{marginTop:'5px', fontSize:'1.2rem', color:'#28a745', fontWeight:'bold'}}>Tổng: {(o.finalTotal || o.totalPrice || 0).toLocaleString()}đ</p>
                {o.status === 'done' && !o.isReviewed && <small style={{color: '#ffc107', fontStyle:'italic'}}>* Đơn hàng đã hoàn thành, hãy vào đánh giá!</small>}
              </div>
            ))
          )}
        </div>
      )}

      {view === 'contact' && (
        <div className="container" style={{ padding: '60px 20px', color: '#fff' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--primary-blue)' }}>LIÊN HỆ VỚI CHÚNG TÔI</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
              <h3 style={{ marginBottom: '20px', color: '#ffc107' }}>Thông tin tiệm</h3>
              <p style={{ marginBottom: '15px' }}><strong>Địa chỉ:</strong> 21.247676966516394, 105.52297462628162</p>
              <p style={{ marginBottom: '15px' }}><strong>Hotline:</strong> 0389632663</p>
              <p style={{ marginBottom: '15px' }}><strong>Email:</strong> abc@gmail.com</p>
              <p style={{ marginBottom: '15px' }}><strong>Giờ làm việc:</strong> 07:00 - 21:00 (Từ thứ 7 đến chủ nhật)</p>
            </div>
            <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '12px', border: '1px solid #333', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '20px', color: '#ffc107' }}>Kết nối</h3>
              <p>Theo dõi chúng tôi qua các mạng xã hội để nhận ưu đãi mới nhất!</p>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '2rem' }}>
                <span style={{ cursor: 'pointer', color: '#1877F2', fontWeight: 'bold' }} onClick={() => window.open('https://facebook.com', '_blank')}>Facebook</span>
              </div>
              <button className="btn-primary" style={{ marginTop: '30px', width: '100%' }} onClick={() => window.open('https://www.facebook.com/profile.php?id=61585730875440', '_blank')}>Liên hệ tôi qua Fanpage</button>
            </div>
          </div>
        </div>
      )}

      {view === 'order-detail' && selectedOrder && (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
            <button onClick={() => setView('my-orders')} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem' }}>← Quay lại danh sách đơn</button>
            <div style={{ background: '#1e1e1e', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>
                <div><h2 style={{ color: 'var(--primary-blue)', margin: 0 }}>Chi tiết đơn hàng #{selectedOrder.id}</h2><p style={{ color: '#888', marginTop: '5px' }}>Ngày đặt: {formatDate(selectedOrder.createdAt)}</p></div>
                <span className={`badge badge-${selectedOrder.status}`} style={{ padding: '8px 15px', fontSize: '1rem' }}>{statusLabels[selectedOrder.status] || selectedOrder.status}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: '#2c2c2c', padding: '15px', borderRadius: '8px' }}><p style={{ color: '#aaa', fontSize: '0.9rem' }}>🕒 Thời gian lấy đồ:</p><strong style={{ color: '#fff' }}>{formatDate(selectedOrder.pickup)}</strong></div>
                <div style={{ background: '#2c2c2c', padding: '15px', borderRadius: '8px' }}><p style={{ color: '#aaa', fontSize: '0.9rem' }}>🚚 Thời gian giao trả:</p><strong style={{ color: '#fff' }}>{formatDate(selectedOrder.delivery)}</strong></div>
            </div>
            <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#fff', marginBottom: '15px', borderLeft: '4px solid var(--primary-blue)', paddingLeft: '10px' }}>Sản phẩm đã đặt</h4>
                {selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #333' }}>
                    <div><span style={{ color: '#fff', fontWeight: 'bold' }}>{item.name}</span><br /><small style={{ color: '#888' }}>{item.quantity} {item.unit} x {item.price.toLocaleString()}đ</small></div>
                    <span style={{ color: '#fff' }}>{(item.price * item.quantity).toLocaleString()}đ</span>
                </div>
                ))}
                {selectedOrder.ship && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', color: '#ffc107' }}><span>Phí vận chuyển tận nơi</span><span>30.000đ</span></div>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', borderTop: '2px solid #333' }}>
                <div><p style={{ color: '#aaa' }}>Hình thức thanh toán:</p><strong style={{ color: '#fff', fontSize: '1.1rem' }}>{selectedOrder.paymentMethod === 'banking' ? '💳 Chuyển khoản ngân hàng' : '💵 Tiền mặt khi nhận đồ'}</strong>
                {selectedOrder.paymentMethod === 'banking' && (
                    <div style={{ marginTop: '20px', background: '#fff', padding: '15px', borderRadius: '8px', textAlign: 'center', width: 'fit-content' }}>
                    <p style={{ color: '#333', fontWeight: 'bold', marginBottom: '10px', fontSize: '0.8rem' }}>QUÉT MÃ ĐỂ THANH TOÁN</p>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Thanh toan don hang ${selectedOrder.id}`} alt="QR Code" style={{ width: '150px' }}/>
                    <div style={{ color: '#333', fontSize: '0.8rem', marginTop: '10px', textAlign: 'left' }}><p>NH: <strong>MB Bank</strong></p><p>STK: <strong>999999999</strong></p></div></div>
                )}</div>
                <div style={{ textAlign: 'right', marginTop: '20px' }}><p style={{ color: '#aaa', marginBottom: '5px' }}>Tổng cộng:</p><h2 style={{ color: '#28a745', fontSize: '2.2rem', margin: 0 }}>{(selectedOrder.finalTotal || 0).toLocaleString()}đ</h2></div>
            </div>
            {selectedOrder.status === 'done' && (
              <div style={{marginTop: '40px', borderTop: '2px dashed #444', paddingTop: '30px'}}>
                <h3 style={{marginBottom: '20px', color: '#fff', textAlign: 'center'}}>ĐÁNH GIÁ DỊCH VỤ</h3>
                {selectedOrder.isReviewed ? (
                   <div style={{textAlign: 'center', color: '#28a745', background: 'rgba(40, 167, 69, 0.1)', padding: '20px', borderRadius: '8px'}}><h4>✅ Bạn đã đánh giá đơn hàng này. Xin cảm ơn!</h4></div>
                ) : (
                  <div style={{ background: '#2c2c2c', padding: '25px', borderRadius: '12px' }}>
                    <p style={{textAlign: 'center', marginBottom: '15px', color: '#ccc'}}>Bạn cảm thấy dịch vụ của đơn hàng này thế nào?</p>
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                      {[1, 2, 3, 4, 5].map(star => (<span key={star} onClick={() => setRating(star)} style={{ cursor: 'pointer', fontSize: '2.5rem', margin: '0 5px', color: star <= rating ? '#ffc107' : '#555', transition: '0.2s' }}>★</span>))}
                    </div>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Nhập cảm nhận của bạn về đơn hàng này..." style={{ width: '100%', padding: '15px', borderRadius: '8px', border: 'none', background: '#444', color: '#fff', minHeight: '120px', fontSize: '1rem' }} />
                    <button className="btn-primary" style={{ marginTop: '20px', width: '100%' }} onClick={handleOrderReview}>Gửi Đánh Giá</button>
                  </div>
                )}
              </div>
            )}
            </div>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} onRegister={handleRegister} />}
    </div>
  );
}

export default App;