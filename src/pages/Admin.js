import React, { useState } from 'react';

const Admin = ({ orders, users, currentUser, updateStatus, onDeleteUser, onToggleRole, updateOrderQuantity }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [userPage, setUserPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const usersPerPage = 5; 
  const statusFlow = ['pending', 'confirmed', 'shipping', 'done', 'cancelled'];
  
  const statusLabels = { 
    pending: '⏳ Chờ xử lý', 
    confirmed: '👍 Xác nhận',
    shipping: '🏍️ Đang giao', 
    done: '✅ Hoàn thành', 
    cancelled: '❌ Đã hủy'
  };
  
  const completedOrders = orders.filter(o => o.status === 'done');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.finalTotal || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const handleStatusChange = (orderId, currentStatus, newStatus) => {
    if (newStatus === 'cancelled') { 
      if (window.confirm('Bạn chắc chắn muốn hủy đơn này?')) updateStatus(orderId, newStatus); 
      return; 
    }
    const currentIndex = statusFlow.indexOf(currentStatus);
    const newIndex = statusFlow.indexOf(newStatus);
    if (newIndex <= currentIndex) { 
      alert("⚠️ Không thể quay ngược trạng thái quy trình!"); 
      return; 
    }
    updateStatus(orderId, newStatus);
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = userPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginate = (pageNumber) => setUserPage(pageNumber);

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '30px', color: 'var(--primary-blue)', textAlign: 'center' }}>QUẢN TRỊ HỆ THỐNG</h1>

      {/* --- MENU TABS --- */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="nav-btn" onClick={() => setActiveTab('orders')} style={{ background: activeTab === 'orders' ? 'var(--primary-blue)' : '#333' }}>📦 Đơn hàng</button>
        <button className="nav-btn" onClick={() => setActiveTab('users')} style={{ background: activeTab === 'users' ? 'var(--primary-blue)' : '#333' }}>👥 Người dùng</button>
        <button className="nav-btn" onClick={() => setActiveTab('revenue')} style={{ background: activeTab === 'revenue' ? '#28a745' : '#333' }}>💰 Doanh thu</button>
        
        {activeTab === 'users' && (
          <input 
            type="text" 
            placeholder="🔍 Tìm tên hoặc email..." 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setUserPage(1); }} 
            style={{ padding: '10px 15px', borderRadius: '30px', border: '1px solid #555', backgroundColor: '#222', color: '#fff', minWidth: '250px', outline: 'none', marginLeft: '10px' }} 
          />
        )}
      </div>

      {/* --- TAB: DOANH THU --- */}
      {activeTab === 'revenue' && (
        <div className="revenue-section">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #28a745', textAlign: 'center' }}><p style={{ color: '#aaa', fontSize: '0.9rem' }}>TỔNG DOANH THU</p><h2 style={{ color: '#28a745', fontSize: '2rem' }}>{totalRevenue.toLocaleString()}đ</h2></div>
            <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #007bff', textAlign: 'center' }}><p style={{ color: '#aaa', fontSize: '0.9rem' }}>TỔNG ĐƠN HÀNG</p><h2 style={{ color: '#fff', fontSize: '2rem' }}>{totalOrders}</h2></div>
            <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '12px', borderLeft: '5px solid #ffc107', textAlign: 'center' }}><p style={{ color: '#aaa', fontSize: '0.9rem' }}>ĐANG CHỜ XỬ LÝ</p><h2 style={{ color: '#ffc107', fontSize: '2rem' }}>{pendingOrders}</h2></div>
          </div>
          <h3 style={{ marginBottom: '20px' }}>Lịch sử đơn hàng hoàn thành</h3>
          <table className="order-table">
            <thead><tr><th>Mã đơn</th><th>Ngày hoàn thành</th><th>Khách hàng</th><th>Số tiền</th></tr></thead>
            <tbody>
              {completedOrders.length === 0 ? (
                <tr><td colSpan="4" style={{textAlign:'center', padding:'20px'}}>Chưa có doanh thu nào được ghi nhận</td></tr>
              ) : (
                completedOrders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>{o.customerName}</td>
                    <td style={{fontWeight:'bold', color:'#28a745'}}>{o.finalTotal.toLocaleString()}đ</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TAB: ĐƠN HÀNG --- */}
      {activeTab === 'orders' && (
        <div style={{ overflowX: 'auto' }}>
          <table className="order-table">
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Khách hàng</th>
                <th>Tên sản phẩm</th>
                <th>Khối lượng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Chưa có đơn hàng nào</td></tr>
              ) : (
                orders.map((order) => {
                  const isLocked = order.status === 'done' || order.status === 'cancelled';
                  return (
                    <tr key={order.id}>
                      <td><strong>#{order.id}</strong></td>
                      <td><div>{order.customerName}</div></td>
                      
                      {/* Cột Tên sản phẩm (Chỉ hiện tên) */}
                      <td>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ marginBottom: '4px', fontSize: '0.9rem' }}>
                            {item.name}
                          </div>
                        ))}
                      </td>

                      {/* Cột Khối lượng (Hiện số lượng và đơn vị) */}
                      <td>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ marginBottom: '4px', fontWeight: 'bold', color: 'var(--primary-blue)' }}>
                            {item.quantity} {item.unit}
                          </div>
                        ))}
                      </td>

                      <td><div style={{ fontWeight: 'bold', color: '#28a745' }}>{(order.finalTotal || 0).toLocaleString()}đ</div>{order.ship && <small style={{ color: '#ffc107' }}>(Gồm 30k ship)</small>}</td>
                      
                      {/* Cột Trạng thái (Badge hiển thị + Select thay đổi) */}
                      <td>
                        <div style={{ marginBottom: '8px' }}>
                          <span 
                            className={`badge badge-${order.status}`} 
                            style={{ 
                              fontSize: '0.8rem',
                              padding: '5px 12px',
                              borderRadius: '20px',
                              display: 'inline-block',
                              fontWeight: 'bold',
                              color: '#fff',
                              backgroundColor: 
                                order.status === 'pending' ? '#ffc107' : 
                                order.status === 'confirmed' ? '#17a2b8' : 
                                order.status === 'shipping' ? '#6f42c1' : 
                                order.status === 'done' ? '#28a745' : 
                                order.status === 'cancelled' ? '#dc3545' : '#6c757d'
                            }}
                          >
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>
                        
                        <select 
                          value={order.status} 
                          disabled={isLocked} 
                          onChange={(e) => handleStatusChange(order.id, order.status, e.target.value)} 
                          style={{ 
                            padding: '6px', 
                            borderRadius: '6px', 
                            border: '1px solid #ccc', 
                            width: '100%',
                            cursor: isLocked ? 'not-allowed' : 'pointer', 
                            backgroundColor: isLocked ? '#e9ecef' : '#fff' 
                          }}
                        >
                          {Object.keys(statusLabels).map((key) => {
                            // LOGIC: Nếu không có phí ship (order.ship === false hoặc undefined) 
                            // thì ẩn option 'shipping'
                            if (!order.ship && key === 'shipping') {
                              return null;
                            }
                            return <option key={key} value={key}>{statusLabels[key]}</option>;
                          })}
                        </select>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TAB: NGƯỜI DÙNG --- */}
      {activeTab === 'users' && (
        <div style={{ overflowX: 'auto' }}>
          <table className="order-table">
            <thead><tr><th>Tên người dùng</th><th>Email</th><th>Vai trò</th><th style={{ textAlign: 'center' }}>Hành động</th></tr></thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Không tìm thấy người dùng nào</td></tr>
              ) : (
                currentUsers.map((u) => (
                  <tr key={u.email}>
                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td><span style={{ color: u.role === 'admin' ? '#ffc107' : '#007bff', fontWeight: 'bold', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{u.role === 'admin' ? 'QUẢN TRỊ VIÊN' : 'KHÁCH HÀNG'}</span></td>
                    <td style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      {u.email !== currentUser.email && (
                        <button onClick={() => onToggleRole(u.email)} style={{ background: u.role === 'admin' ? '#6c757d' : '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                          {u.role === 'admin' ? 'Giáng cấp' : 'Thăng cấp'}
                        </button>
                      )}
                      {u.role !== 'admin' && (
                        <button onClick={() => onDeleteUser(u.email)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Xóa</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {filteredUsers.length > usersPerPage && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '5px' }}>
              {Array.from({ length: totalUserPages }, (_, i) => (
                <button 
                  key={i + 1} 
                  onClick={() => paginate(i + 1)} 
                  style={{ padding: '8px 15px', border: '1px solid #007bff', backgroundColor: userPage === i + 1 ? '#007bff' : '#fff', color: userPage === i + 1 ? '#fff' : '#007bff', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;