import React, { useState, useRef, useEffect } from 'react';
import { Menu, User, X, BookOpen, BarChart3, LayoutDashboard, CreditCard, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Component Sidebar mới với dropdown và draggable button
const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [isCommercialOpen, setIsCommercialOpen] = useState(false);
  const [position, setPosition] = useState({ x: 15, y: 770 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dropdownDirection, setDropdownDirection] = useState('down'); // 'up' hoặc 'down'
  const [dropdownAlign, setDropdownAlign] = useState('left'); // 'left' hoặc 'right'
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Xử lý bắt đầu kéo
  const handleMouseDown = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  // Kiểm tra vị trí và xác định hướng dropdown
  const checkDropdownDirection = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const dropdownHeight = 500; // Ước tính chiều cao dropdown
      const dropdownWidth = 300; // Ước tính chiều rộng dropdown
      
      // Kiểm tra không gian phía dưới
      const spaceBelow = windowHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const spaceRight = windowWidth - buttonRect.right;
      const spaceLeft = buttonRect.left;
      
      // Xác định hướng dọc (lên/xuống)
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownDirection('up');
      } else {
        setDropdownDirection('down');
      }
      
      // Xác định hướng ngang (trái/phải)
      if (spaceRight < dropdownWidth && spaceLeft > dropdownWidth) {
        setDropdownAlign('right');
      } else {
        setDropdownAlign('left');
      }
    }
  };

  // Xử lý di chuyển khi kéo
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Kiểm tra hướng dropdown sau khi thả chuột
      checkDropdownDirection();
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Kiểm tra hướng dropdown khi mở
  useEffect(() => {
    if (isOpen) {
      checkDropdownDirection();
    }
  }, [isOpen]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && 
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleMenuClick = () => {
    if (!isDragging) {
      checkDropdownDirection();
      onToggle();
    }
  };

  return (
    <>
      {/* Draggable Button */}
      <button
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onClick={!isDragging ? handleMenuClick : undefined}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 1100,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        className="bg-gradient-to-r from-[#06B6D4] to-[#0891B2] hover:from-[#F97316] hover:to-[#EA580C] text-white border-none rounded-full w-12 h-12 flex items-center justify-center shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-110"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            // Xác định vị trí ngang (trái hoặc phải)
            ...(dropdownAlign === 'right' 
              ? { right: `${window.innerWidth - position.x - 48}px` }
              : { left: `${position.x}px` }
            ),
            // Xác định vị trí dọc (trên hoặc dưới)
            ...(dropdownDirection === 'up' 
              ? { bottom: `${window.innerHeight - position.y}px` }
              : { top: `${position.y + 60}px` }
            ),
            zIndex: 1099,
            minWidth: '300px',
            maxWidth: '340px',
            boxShadow: '0 20px 60px rgba(6, 182, 212, 0.3), 0 10px 30px rgba(249, 115, 22, 0.2)',
            border: '2px solid rgba(6, 182, 212, 0.2)'
          }}
          className={`bg-white rounded-2xl overflow-hidden ${
            dropdownDirection === 'up' ? 'animate-slideUp' : 'animate-slideDown'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white p-5">
            <h3 className="font-black text-xl flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <BookOpen size={22} />
              </div>
              Creator Menu
            </h3>
          </div>

          {/* Menu Items */}
          <nav className="py-3">
            <Link
              to="/creator/create_course"
              className={`
                flex items-center gap-3 px-5 py-3.5 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 text-gray-700 hover:text-[#06B6D4] no-underline group
                ${location.pathname === '/creator/create_course' ? 'bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white border-l-4 border-[#F97316] font-bold shadow-md' : ''}
              `}
              onClick={onToggle}
            >
              <div className={`p-1.5 rounded-lg transition-all ${location.pathname === '/creator/create_course' ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-[#06B6D4]/10'}`}>
                <BookOpen size={20} />
              </div>
              <span className="font-semibold">Create Your Course</span>
            </Link>

            <Link
              to="/creator/courseList"
              className={`
                flex items-center gap-3 px-5 py-3.5 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 text-gray-700 hover:text-[#06B6D4] no-underline group
                ${location.pathname === '/creator/courseList' ? 'bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white border-l-4 border-[#F97316] font-bold shadow-md' : ''}
              `}
              onClick={onToggle}
            >
              <div className={`p-1.5 rounded-lg transition-all ${location.pathname === '/creator/courseList' ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-[#06B6D4]/10'}`}>
                <BarChart3 size={20} />
              </div>
              <span className="font-semibold">Manager</span>
            </Link>

            <Link
              to="/creator/profile"
              className={`
                flex items-center gap-3 px-5 py-3.5 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 text-gray-700 hover:text-[#06B6D4] no-underline group
                ${location.pathname === '/creator/profile' ? 'bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white border-l-4 border-[#F97316] font-bold shadow-md' : ''}
              `}
              onClick={onToggle}
            >
              <div className={`p-1.5 rounded-lg transition-all ${location.pathname === '/creator/profile' ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-[#06B6D4]/10'}`}>
                <User size={20} />
              </div>
              <span className="font-semibold">Creator Account</span>
            </Link>

            {/* Commercial Dropdown */}
            <div className="border-t-2 border-gradient-to-r from-[#06B6D4]/20 to-[#F97316]/20 mt-3 pt-3">
              <button
                onClick={() => setIsCommercialOpen(!isCommercialOpen)}
                className={`
                  w-full flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 text-gray-700 hover:text-[#06B6D4] rounded-lg group
                  ${location.pathname.startsWith('/creator/commercial') ? 'bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-white font-bold shadow-md' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-all ${location.pathname.startsWith('/creator/commercial') ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-[#06B6D4]/10'}`}>
                    <BarChart3 size={20} />
                  </div>
                  <span className="font-semibold">Commercial</span>
                </div>
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-300 ${isCommercialOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Submenu */}
              {isCommercialOpen && (
                <div className="bg-gradient-to-br from-cyan-50/50 to-blue-50/50 py-2 mt-2 rounded-lg mx-2">
                  <Link
                    to="/creator/commercial/dashboard"
                    className={`
                      flex items-center gap-3 px-6 py-3 mx-2 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 text-gray-700 hover:text-[#06B6D4] no-underline group
                      ${location.pathname === '/creator/commercial/dashboard' ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-bold shadow-lg' : ''}
                    `}
                    onClick={onToggle}
                  >
                    <div className={`p-1 rounded ${location.pathname === '/creator/commercial/dashboard' ? 'bg-white/20' : 'bg-[#06B6D4]/10 group-hover:bg-[#06B6D4]/20'}`}>
                      <LayoutDashboard size={18} />
                    </div>
                    <span className="font-semibold">Dashboard</span>
                  </Link>

                  <Link
                    to="/creator/commercial/courseDetail"
                    className={`
                      flex items-center gap-3 px-6 py-3 mx-2 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 text-gray-700 hover:text-[#06B6D4] no-underline group
                      ${location.pathname === '/creator/commercial/courseDetail' ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-bold shadow-lg' : ''}
                    `}
                    onClick={onToggle}
                  >
                    <div className={`p-1 rounded ${location.pathname === '/creator/commercial/courseDetail' ? 'bg-white/20' : 'bg-[#06B6D4]/10 group-hover:bg-[#06B6D4]/20'}`}>
                      <CreditCard size={18} />
                    </div>
                    <span className="font-semibold">Course Detail</span>
                  </Link>

                  <Link
                    to="/creator/commercial/history_transaction"
                    className={`
                      flex items-center gap-3 px-6 py-3 mx-2 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 text-gray-700 hover:text-[#06B6D4] no-underline group
                      ${location.pathname === '/creator/commercial/history_transaction' ? 'bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white font-bold shadow-lg' : ''}
                    `}
                    onClick={onToggle}
                  >
                    <div className={`p-1 rounded ${location.pathname === '/creator/commercial/history_transaction' ? 'bg-white/20' : 'bg-[#06B6D4]/10 group-hover:bg-[#06B6D4]/20'}`}>
                      <CreditCard size={18} />
                    </div>
                    <span className="font-semibold">Transaction History</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="bg-gradient-to-r from-slate-50 to-cyan-50 px-5 py-4 border-t-2 border-[#06B6D4]/20">
            <p className="text-xs text-gray-600 text-center font-semibold">© 2024 JPD Learning Platform</p>
            <div className="flex justify-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-[#06B6D4]"></div>
              <div className="w-2 h-2 rounded-full bg-[#F97316]"></div>
              <div className="w-2 h-2 rounded-full bg-[#06B6D4]"></div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </>
  );
};

export default Sidebar;