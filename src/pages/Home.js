import React from 'react'; 
import Hero from '../components/Hero';
import InfoSection from '../components/InfoSection';
import { servicesData } from '../data/servicesData';

const Home = ({ feedbacks, onOrderClick, onServiceSelect }) => {
  

  return (
    <div className="home-page">
      <Hero onOrderClick={onOrderClick} />
      <InfoSection />

 
      <div id="services-section" className="container" style={{ padding: '40px 60px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', textTransform: 'uppercase', color: '#fff' }}>Sản Phẩm Nổi Bật</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {servicesData.map((service) => (
            <button
              key={service.id}
              onClick={() => onServiceSelect(service)}
              className="service-card-btn"
              style={{
                position: 'relative',aspectRatio: '5 / 4', width: '100%', borderRadius: '10px', border: '1px solid #444'
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `url(${service.btnImage})`, backgroundSize: 'cover',
                backgroundPosition: 'center', transition: 'transform 0.3s ease', zIndex: 0
              }} className="btn-bg-image" />
              <span style={{ position: 'relative', zIndex: 1, color: '#fff', fontSize: '3.0rem',
                fontWeight: 'bold', textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>
                {service.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* PHẦN FEEDBACK CÔNG KHAI (Chỉ hiển thị, không cho nhập) */}
      <div className="container" style={{ padding: '60px 20px', borderTop: '1px solid #333' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#fff' }}>ĐÁNH GIÁ TỪ KHÁCH HÀNG</h2>

        {feedbacks.length === 0 ? (
           <p style={{textAlign:'center', color:'#888'}}>Chưa có đánh giá nào.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {feedbacks.map(fb => (
              <div key={fb.id} style={{ background: '#1e1e1e', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ color: '#ffc107', marginBottom: '10px' }}>
                  {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                </div>
                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{fb.name}</p>
                <p style={{ color: '#ccc', fontStyle: 'italic', margin: '10px 0' }}>"{fb.comment}"</p>
                <small style={{ color: '#666' }}>{new Date(fb.date).toLocaleDateString('vi-VN')}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;