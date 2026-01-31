import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import ServiceDetail from './components/ServiceDetail';
import Cart from './components/Cart';
import UserProfile from './components/UserProfile';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Contact from './components/Contact';
//import OrderTracker from './components/OrderTracker';
import { servicesData as initialServices } from './data/servicesData'; 

function App() {
  const [view, setView] = useState('home');
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart_guest'); // Mặc định guest
      return savedCart ? JSON.parse(savedCart) : [];
    } catch { return []; }
  });
  const [selectedOrder] = useState(null);

  // --- STATE DỊCH VỤ & FEEDBACK ---
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('services');
      return saved ? JSON.parse(saved) : initialServices;
    } catch { return initialServices; }
  });

  const [feedbacks] = useState(() => {
    try {
      const saved = localStorage.getItem('feedbacks');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('users')) || [{email:'admin', password:'123', fullName:'Chủ Shop', role:'admin'}]; } catch { return []; }
  });
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('orders')) || []; } catch { return []; }
  });

  // ĐỒNG BỘ LOCALSTORAGE
  useEffect(() => { localStorage.setItem('services', JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('feedbacks', JSON.stringify(feedbacks)); }, [feedbacks]);

  const getCartKey = (u) => u ? `cart_${u.email}` : 'cart_guest';

  useEffect(() => {
    const key = getCartKey(user);
    const savedCart = localStorage.getItem(key);
    setCart(savedCart ? JSON.parse(savedCart) : []);
  }, [user]);

  useEffect(() => {
    const key = getCartKey(user);
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, user]);

  // --- HÀM QUẢN LÝ DỊCH VỤ ---
  const handleServiceAction = (action, payload) => {
    if (action === 'add') {
      const newService = { ...payload, id: Date.now().toString() };
      setServices([...services, newService]);
    } else if (action === 'update') {
      setServices(services.map(s => s.id === payload.id ? payload : s));
    } else if (action === 'delete') {
      if (window.confirm("Xóa dịch vụ này?")) setServices(services.filter(s => s.id !== payload));
    }
  };

  const handleAddToCart = (itemWithPrice) => {
    setCart([...cart, { 
      ...itemWithPrice, 
      quantityNum: 1, 
      idInCart: Date.now() 
    }]);
    alert(`Đã thêm "${itemWithPrice.name}" vào giỏ!`);
    setView('home');
  };

  const updateOrderQuantity = (oid, idx, q) => {
    if (q < 1) return;
    const ns = orders.map(o => {
      if (o.id === oid) {
        const newItems = [...o.items];
        newItems[idx].quantityNum = parseInt(q); 
        const newTotal = newItems.reduce((s, x) => s + (x.price * (x.quantityNum || 1)), 0);
        return { ...o, items: newItems, finalTotal: newTotal + (o.ship ? 30000 : 0) };
      }
      return o;
    });
    setOrders(ns);
  };

  const handleLogin = (email, pass, setError) => {
    const found = users.find(u => u.email === email && u.password === pass);
    if (found) { setUser(found); setShowAuth(false); setView('home'); } else setError('Sai email hoặc mật khẩu!');
  };

  const handleRegister = (n, e, p, cb) => { 
    if (users.find(u => u.email === e)) return cb('Email tồn tại'); 
    const u = { email: e, password: p, fullName: n, role: 'customer', phone: '', address: '' }; 
    setUsers([...users, u]); setUser(u); setShowAuth(false); 
  };

  const handleLogout = () => { setUser(null); setView('home'); };
  const handleUpdateProfile = (i) => { 
    const u = { ...user, ...i }; 
    setUser(u); 
    setUsers(users.map(x => x.email === user.email ? u : x)); 
    alert("Cập nhật thành công!"); 
  };
  
  // --- SỬA LỖI CHECKOUT (LƯU EMAIL) ---
  const checkout = (info) => {
    if (!user) { setShowAuth(true); return; }
    if (!user.phone || !user.address) { 
      alert("Vui lòng cập nhật SĐT và Địa chỉ trong hồ sơ!"); 
      setView('profile'); 
      return; 
    }

    // 1. Quy tắc tạo mã đơn hàng mới: MD-YYMMDD-HHMMSS
    const generateOrderId = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const datePart = `${day}${month}${year}-${hours}${minutes}${seconds}`;
    return `MD-${datePart}`;
  };
    const newOrderId = generateOrderId();

    const newOrder = { 
      id: newOrderId,
      customerName: user.fullName, 
      email: user.email, 
      phone: user.phone, 
      address: user.address, 
      items: cart, 
      ...info, 
      status: 'pending', 
      createdAt: new Date().toISOString(), 
      isReviewed: false 
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    alert(`Đặt hàng thành công! Mã đơn của bạn là: ${newOrderId}`);
    setView('my-orders');
  };

  const updateOrderStatus = (id, st) => { 
    setOrders(orders.map(o => o.id === id ? { ...o, status: st } : o)); 
  };

  const handleDeleteUser = (e) => { 
    if(window.confirm('Xóa user này?')) setUsers(users.filter(u => u.email !== e)); 
  };

  const handleToggleRole = (e) => { 
    const us = users.map(u => u.email === e ? { ...u, role: u.role === 'admin' ? 'customer' : 'admin' } : u); 
    setUsers(us); 
  };

  return (
    <div className="App">
      <Header setView={setView} user={user} cartCount={cart.length} onLogout={handleLogout} onLoginClick={() => setShowAuth(true)} onServiceSelect={(s)=>{setSelectedService(s); setView('detail');}} services={services} />

      {view === 'home' && (
        <Home services={services} feedbacks={feedbacks} onOrderClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })} onServiceSelect={(s) => { setSelectedService(s); setView('detail'); }} />
      )}

      {view === 'detail' && (
        <ServiceDetail service={selectedService} onBack={() => setView('home')} onAddToCart={handleAddToCart} user={user} setShowAuth={setShowAuth}/>
      )}

      {view === 'cart' && (
        <Cart items={cart} onRemove={(i)=>setCart(cart.filter((_,x)=>x!==i))} onCheckout={checkout} user={user} setView={setView} />
      )}

      {view === 'profile' && (
         <UserProfile user={user} onUpdate={handleUpdateProfile} />
      )}
      
      {view === 'admin' && user?.role === 'admin' && (
        <Admin orders={orders} users={users} services={services} currentUser={user} updateStatus={updateOrderStatus} onDeleteUser={handleDeleteUser} onToggleRole={handleToggleRole} updateOrderQuantity={updateOrderQuantity} onUpdateAdmin={handleUpdateProfile} onServiceAction={handleServiceAction} />
      )}
      {view === 'contact' && <Contact />}
      {/* --- CẬP NHẬT VIEW ĐƠN HÀNG CỦA TÔI --- */}
      {view === 'my-orders' && (
        <div style={{
            minHeight: '100vh',
            padding: '40px 20px',
            backgroundImage: `url('5lodua.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: '#fff'
        }}>
          <div className="container" style={{maxWidth: '900px', margin: '0 auto'}}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
              <h1 style={{ 
                color: '#fff', 
                textAlign: 'center',
                padding: '20px 40px', 
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '10px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)'
              }}>
                📦 Đơn hàng của bạn
              </h1>
            </div>
            {/* Logic lọc đơn hàng */}
            {user && orders.filter(o => (o.email === user.email || o.customerEmail === user.email)).length === 0 ? (
              <div style={{textAlign: 'center', padding: '50px', background: 'rgba(34,34,34,0.9)', borderRadius: '15px', border: '1px dashed #555'}}>
                 <p style={{fontSize: '1.2rem', color: '#aaa'}}>Bạn chưa có đơn hàng nào.</p>
                 <button className="nav-btn" onClick={() => setView('home')} style={{marginTop: '15px'}}>Mua sắm ngay</button>
              </div>
            ) : (
              orders.filter(o => (o.email === user?.email || o.customerEmail === user?.email))
              .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp mới nhất
              .map(order => (
                <div key={order.id} style={{ 
                  background: 'rgba(34, 34, 34, 0.9)', 
                  padding: '25px', 
                  borderRadius: '16px', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)', 
                  marginBottom: '25px', 
                  border: '1px solid #444',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #555', paddingBottom: '12px', marginBottom: '15px', flexWrap: 'wrap', gap: '10px'}}>
                    <span>Mã đơn: <strong style={{color: '#ffc107'}}>#{order.id}</strong></span>
                    <span style={{
                        color: '#fff', 
                        fontSize: '0.85rem',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        background: (order.status === 'done' || order.status === 'delivered') ? '#28a745' : '#007bff'
                    }}>
                        {order.status === 'pending' ? '⏳ Chờ xử lý' : 
                         order.status === 'confirmed' ? '👍 Xác nhận' : 
                         order.status === 'shipping' ? '🏍️ Đang giao' : 
                         order.status === 'done' || order.status === 'delivered' ? '✅ Hoàn thành' : order.status}
                    </span>
                  </div>

                  {/* <OrderTracker currentStatus={order.status} /> */}

                  <div style={{marginTop: '10px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px'}}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#ddd' }}>
                        <span>• {item.name} <small style={{color:'#aaa'}}>(x{item.quantityNum || 1})</small></span>
                        <span style={{ fontWeight: '500' }}>{(item.price * (item.quantityNum || 1)).toLocaleString()}đ</span>
                      </div>
                    ))}
                    <div style={{marginTop: '15px', borderTop: '1px dashed #555', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{fontWeight: 'bold', color: '#aaa'}}>Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                      <strong style={{fontSize: '1.4rem', color: '#28a745'}}>{(order.finalTotal || 0).toLocaleString()}đ</strong>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {view === 'order-detail' && selectedOrder && (
         <div className="container" style={{ padding: '40px 20px' }}>
            <button className="nav-btn" onClick={() => setView('my-orders')}>← Quay lại</button>
            <div className="order-card" style={{background: '#fff', padding: '20px', borderRadius: '12px', marginTop: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                <h3>Chi tiết đơn #{selectedOrder.id}</h3>
                {selectedOrder.items.map((item, idx) => (
                    <div key={idx} style={{display:'flex', justifyContent:'space-between', borderBottom: '1px solid #eee', padding: '10px 0'}}>
                        <span>{item.name} ({item.quantity})</span>
                        <span>{item.price?.toLocaleString()}đ</span>
                    </div>
                ))}
                <h2 style={{textAlign:'right', color: '#28a745', marginTop: '20px'}}>Tổng: {selectedOrder.finalTotal?.toLocaleString()}đ</h2>
            </div>
         </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={handleLogin} onRegister={handleRegister} />}
    </div>
  );
}

export default App;