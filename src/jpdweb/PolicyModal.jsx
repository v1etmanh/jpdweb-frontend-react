import React, { useEffect, useState } from 'react';
import './PolicyModal.css';

const PolicyModal = ({ onAccept, onDecline, onOpenDetail }) => {
  const [isVisible, setIsVisible] = useState(true); // luôn hiện khi reload

  // ESC key để đóng
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isVisible) {
        handleDecline();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  const handleAccept = () => {
    setIsVisible(false);
    setTimeout(() => {
      onAccept && onAccept();
    }, 300);
  };

  const handleDecline = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDecline && onDecline();
    }, 300);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('policy-detail-overlay')) {
      onDecline();
    }
  };
  const handleLinkClick = (e) => {
  e.preventDefault();
  // Khi bấm link, chỉ mở modal chi tiết, không tắt modal nhỏ bằng animation
  if (onOpenDetail) onOpenDetail();
};


  return (
    <div 
      className={`policy-overlay ${isVisible ? 'show' : ''}`} 
      onClick={handleOverlayClick} // chỉ overlay mới đóng
    >
      <div 
        className={`policy-modal ${isVisible ? 'show' : ''}`} 
        onClick={(e) => e.stopPropagation()} // chặn click trong modal nổi bọt ra ngoài
      >
        <div className="policy-header">
          <div className="policy-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <h3>Chính sách bảo mật</h3>
          <button className="policy-close" onClick={handleDecline}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="policy-body">
          <p>
            Chúng tôi sử dụng cookie và công nghệ tương tự để cải thiện trải nghiệm của bạn, 
            phân tích lưu lượng truy cập và cá nhân hóa nội dung.
          </p>
          <div className="policy-points">
            <div className="policy-point"><span className="point-icon">🍪</span>Cookie thiết yếu cho chức năng cơ bản</div>
            <div className="policy-point"><span className="point-icon">📊</span>Phân tích để cải thiện dịch vụ</div>
            <div className="policy-point"><span className="point-icon">🎯</span>Cá nhân hóa trải nghiệm học tập</div>
          </div>
          <p className="policy-note">
            Bằng cách tiếp tục, bạn đồng ý với việc sử dụng cookie của chúng tôi.
          </p>
        </div>

        <div className="policy-footer">
          <button className="btn-secondary" onClick={handleDecline}>Từ chối</button>
          <button className="btn-primary" onClick={handleAccept}>Đồng ý</button>
        </div>

<div className="policy-link">
  <button type="button" onClick={handleLinkClick}>
    Xem chính sách đầy đủ
  </button>
</div>



      </div>
    </div>
  );
};

export default PolicyModal;
