import React from "react";
import './PolicyModalDetail.css';

const PolicyModalDetail = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
  if (e.target.classList.contains('policy-overlay')) {
    onClose();
  }
};


  return (
    <div className="policy-detail-overlay" onClick={handleOverlayClick}>
      <div className="policy-detail-modal">
        {/* Header */}
        <div className="policy-header">
          <h2>Chính sách dành cho Creator</h2>
          <button className="policy-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="policy-body">
          <h3>1. Quy tắc về nội dung khóa học</h3>
          <ul>
            <li>Nội dung phải chính xác, rõ ràng, không gây hiểu lầm.</li>
            <li>Không chứa yếu tố phân biệt chủng tộc, tôn giáo, giới tính, chính trị cực đoan.</li>
            <li>Không sử dụng nội dung vi phạm bản quyền (hình ảnh, video, nhạc, sách, tài liệu).</li>
            <li>Khóa học phải theo chuẩn chất lượng (âm thanh rõ, hình ảnh sáng, cấu trúc mạch lạc).</li>
            <li>Không quảng bá sản phẩm/dịch vụ cá nhân ngoài phạm vi được phép.</li>
          </ul>

          <h3>2. Quy tắc về giảng dạy</h3>
          <ul>
            <li>Creator cần tương tác chuyên nghiệp với học viên.</li>
            <li>Cam kết cập nhật nội dung khi có thay đổi.</li>
            <li>Tránh copy-paste giáo trình, khuyến khích sáng tạo.</li>
          </ul>

          <h3>3. Quy tắc pháp lý và bản quyền</h3>
          <ul>
            <li>Chỉ sử dụng tài nguyên được phép.</li>
            <li>Creator chịu trách nhiệm nếu vi phạm bản quyền.</li>
            <li>Tôn trọng quyền riêng tư của học viên.</li>
          </ul>

          <h3>4. Quy tắc tài chính</h3>
          <ul>
            <li>Tuân thủ chính sách chia sẻ doanh thu.</li>
            <li>Không giao dịch bên ngoài nền tảng.</li>
            <li>Thu nhập phải tuân theo quy định thuế.</li>
          </ul>

          <h3>5. Quy tắc hành vi</h3>
          <ul>
            <li>Không lôi kéo học viên sang nền tảng khác.</li>
            <li>Không tạo đánh giá giả mạo.</li>
            <li>Giữ tư cách đạo đức nghề nghiệp.</li>
          </ul>

          <h3>6. Hướng dẫn kỹ thuật</h3>
          <ul>
            <li>Video: tối thiểu 720p.</li>
            <li>Âm thanh: rõ, không ồn, mic đạt chuẩn.</li>
            <li>Cấu trúc khóa học rõ ràng.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PolicyModalDetail;
