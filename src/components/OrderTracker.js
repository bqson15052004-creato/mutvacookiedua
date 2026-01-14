import React from 'react';

// 1. Định nghĩa các bước và icon tương ứng
const STEPS = [
  { key: 'pending', label: 'Chờ xử lý', icon: '📝' },
  { key: 'confirmed', label: 'Xác nhận', icon: '👍' },
  { key: 'shipping', label: 'Đang giao', icon: '📦' },
  { key: 'done', label: 'Hoàn thành', icon: '✅' },
  { key: 'cancelled', label: 'Đã hủy', icon: '❌' }
];

const OrderTracker = ({ currentStatus }) => {
  // Nếu đơn bị hủy, hiện thông báo đỏ thay vì thanh tiến trình
  if (currentStatus === 'cancelled') {
    return (
      <div style={{ padding: '15px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
        ❌ Đơn hàng này đã bị hủy
      </div>
    );
  }

  // Tìm vị trí hiện tại của đơn hàng trong quy trình
  const currentIndex = STEPS.findIndex(step => step.key === currentStatus);

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        
        {/* Đường kẻ nền màu xám nối các điểm */}
        <div style={{ 
          position: 'absolute', top: '15px', left: '0', right: '0', height: '4px', background: '#e0e0e0', zIndex: 0 
        }}></div>

        {/* Đường màu xanh chạy theo tiến độ */}
        <div style={{ 
          position: 'absolute', top: '15px', left: '0', height: '4px', background: '#28a745', zIndex: 0,
          width: `${(currentIndex / (STEPS.length - 1)) * 100}%`,
          transition: 'width 0.3s ease'
        }}></div>

        {/* Vẽ từng bước (Steps) */}
        {STEPS.map((step, index) => {
          const isActive = index <= currentIndex;
          return (
            <div key={step.key} style={{ zIndex: 1, textAlign: 'center', width: '16.66%' }}>
              {/* Hình tròn chứa Icon */}
              <div style={{ 
                width: '35px', height: '35px', margin: '0 auto 10px', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive ? '#28a745' : '#e0e0e0',
                color: isActive ? '#fff' : '#666',
                fontWeight: 'bold', border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                {step.icon}
              </div>
              {/* Tên bước (Chỉ hiện trên Desktop hoặc mobile nếu cần) */}
              <div style={{ fontSize: '0.75rem', color: isActive ? '#28a745' : '#999', fontWeight: isActive ? 'bold' : 'normal' }}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default OrderTracker;