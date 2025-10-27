import React, { useState, useRef, useEffect } from 'react';
import { Menu, User, X, BookOpen, BarChart3, LayoutDashboard, CreditCard, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Component Sidebar mới với dropdown và draggable button
const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [isCommercialOpen, setIsCommercialOpen] = useState(false);
  const [position, setPosition] = useState({ x: 15, y: 760 });
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
        className="bg-[#D4B896] hover:bg-[#C4A886] text-[#5D4E37] border-none rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl"
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
            minWidth: '280px',
            maxWidth: '320px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(212, 184, 150, 0.3)'
          }}
          className={`bg-white rounded-lg overflow-hidden ${
            dropdownDirection === 'up' ? 'animate-slideUp' : 'animate-slideDown'
          }`}
        >
          {/* Header */}
          <div className="bg-[#705f44] text-white p-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <BookOpen size={20} />
              Creator Menu
            </h3>
          </div>

          {/* Menu Items */}
          <nav className="py-2">
            <Link
              to="/creator/create_course"
              className={`
                flex items-center gap-3 px-4 py-3 hover:bg-[#FFFEF7] transition-colors text-[#5D4E37] hover:text-[#243864] no-underline
                ${location.pathname === '/creator/create_course' ? 'bg-[#D4B896] text-[#5D4E37] border-r-4 border-[#243864] font-semibold' : ''}
              `}
              onClick={onToggle}
            >
              <BookOpen size={20} />
              <span className="font-medium">Create Your Course</span>
            </Link>

            <Link
              to="/creator/courseList"
              className={`
                flex items-center gap-3 px-4 py-3 hover:bg-[#FFFEF7] transition-colors text-[#5D4E37] hover:text-[#243864] no-underline
                ${location.pathname === '/creator/courseList' ? 'bg-[#D4B896] text-[#5D4E37] border-r-4 border-[#243864] font-semibold' : ''}
              `}
              onClick={onToggle}
            >
              <BarChart3 size={20} />
              <span className="font-medium">Manager</span>
            </Link>

            <Link
              to="/creator/profile"
              className={`
                flex items-center gap-3 px-4 py-3 hover:bg-[#FFFEF7] transition-colors text-[#5D4E37] hover:text-[#243864] no-underline
                ${location.pathname === '/creator/profile' ? 'bg-[#D4B896] text-[#5D4E37] border-r-4 border-[#243864] font-semibold' : ''}
              `}
              onClick={onToggle}
            >
              <User size={20} />
              <span className="font-medium">Creator Account</span>
            </Link>

            {/* Commercial Dropdown */}
            <div className="border-t border-gray-200 mt-2 pt-2">
              <button
                onClick={() => setIsCommercialOpen(!isCommercialOpen)}
                className={`
                  w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#FFFEF7] transition-colors text-[#5D4E37] hover:text-[#243864]
                  ${location.pathname.startsWith('/creator/commercial') ? 'bg-[#D4B896] text-[#5D4E37] font-semibold' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 size={20} />
                  <span className="font-medium">Commercial</span>
                </div>
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-300 ${isCommercialOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Submenu */}
              {isCommercialOpen && (
                <div className="bg-[#FFFEF7] py-2">
                  <Link
                    to="/creator/commercial/dashboard"
                    className={`
                      flex items-center gap-3 px-8 py-2.5 hover:bg-[#D4B896] transition-colors text-[#5D4E37] hover:text-[#243864] no-underline
                      ${location.pathname === '/creator/commercial/dashboard' ? 'text-[#243864] font-semibold' : ''}
                    `}
                    onClick={onToggle}
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/creator/commercial/courseDetail"
                    className={`
                      flex items-center gap-3 px-8 py-2.5 hover:bg-[#D4B896] transition-colors text-[#5D4E37] hover:text-[#243864] no-underline
                      ${location.pathname === '/creator/commercial/courseDetail' ? 'text-[#243864] font-semibold' : ''}
                    `}
                    onClick={onToggle}
                  >
                    <CreditCard size={18} />
                    <span>Course Detail</span>
                  </Link>

                  <Link
                    to="/creator/commercial/history_transaction"
                    className={`
                      flex items-center gap-3 px-8 py-2.5 hover:bg-[#D4B896] transition-colors text-[#5D4E37] hover:text-[#243864] no-underline
                      ${location.pathname === '/creator/commercial/history_transaction' ? 'text-[#243864] font-semibold' : ''}
                    `}
                    onClick={onToggle}
                  >
                    <CreditCard size={18} />
                    <span>Transaction History</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="bg-[#FFFEF7] px-4 py-3 border-t border-gray-200">
            <p className="text-xs text-[#5D4E37] text-center">© 2024 My App</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Sidebar;