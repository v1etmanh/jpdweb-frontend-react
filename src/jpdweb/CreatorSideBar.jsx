import React, { useState, useEffect } from 'react';
import { 
  Menu, Home, User, Settings, X, BookOpen, BarChart3, 
  LayoutDashboard, CreditCard, ChevronDown, ChevronRight,
  PenTool, Users, Star, TrendingUp, HelpCircle, Zap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Component Sidebar
const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [isCommercialOpen, setIsCommercialOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  // Effect to handle automatic sidebar collapsing on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`creator-sidebar`}
      style={{
    position: 'fixed',
    top: '0',
    left: '0px',   // hiệu ứng trượt
    width: `${collapsed ? '80px' : '260px'}`,
    height: '100vh',
    backgroundColor: '#fdfdfd',
    boxShadow: '2px 0 15px rgba(0,0,0,0.1)',
    zIndex: 999,
    transition: 'left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    borderRight: '1px solid #e9ecef',
    display: 'flex',
    flexDirection: 'column'
  }}>
      {/* Sidebar overlay on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white z-50 
        transition-all duration-300 ease-in-out shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 ${collapsed ? 'w-20' : 'w-64'}
        flex flex-col
      `}>
        {/* Header của sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            {!collapsed && <span className="text-xl font-bold text-[#1e88e5]">Creator Hub</span>}
            {collapsed && <PenTool size={28} className="text-[#1e88e5] mx-auto" />}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-1.5 hover:bg-gray-700 rounded-full"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
            </button>
            <button 
              onClick={onToggle}
              className="md:hidden p-1.5 hover:bg-gray-700 rounded-full"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Menu items */}
        <nav className="mt-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
       

          {/* Creator specific links */}
          <div className="mt-2 space-y-1 px-3">
            <h3 className={`text-xs uppercase text-gray-400 font-semibold px-3 mb-2 ${collapsed ? "text-center" : ""}`}>
              {!collapsed ? "Content Management" : ""}
            </h3>
            
            <Link
              to="/creator/create_course"
              className={`
                group w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg
                hover:bg-[#1e88e5]/20 transition-colors text-left
                ${location.pathname === '/creator/create_course' 
                  ? 'bg-[#1e88e5]/20 text-[#1e88e5]' 
                  : 'text-gray-300 hover:text-white'}
              `}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md ${location.pathname === '/creator/create_course' ? 'bg-[#1e88e5]' : 'bg-gray-700 group-hover:bg-[#1e88e5]/50'}`}>
                  <BookOpen size={collapsed ? 22 : 18} className={location.pathname === '/creator/create_course' ? 'text-[#a6d5fa]' : ''} />
                </div>
                {!collapsed && <span>Create Your Course</span>}
              </div>
              {!collapsed && location.pathname === '/creator/create_course' && (
                <div className="w-1.5 h-8 bg-[#1e88e5] rounded-full"></div>
              )}
            </Link>
            
            <Link
              to="/creator/courseList"
              className={`
                group w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg
                hover:bg-[#1e88e5]/20 transition-colors text-left
                ${location.pathname === '/creator/courseList' 
                  ? 'bg-[#1e88e5]/20 text-[#1e88e5]' 
                  : 'text-gray-300 hover:text-white'}
              `}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md ${location.pathname === '/creator/courseList' ? 'bg-[#1e88e5]' : 'bg-gray-700 group-hover:bg-[#1e88e5]/50'}`}>
                  <LayoutDashboard size={collapsed ? 22 : 18} className={location.pathname === '/creator/courseList' ? 'text-[#a6d5fa]' : ''} />
                </div>
                {!collapsed && <span>Course Manager</span>}
              </div>
              {!collapsed && location.pathname === '/creator/courseList' && (
                <div className="w-1.5 h-8 bg-[#1e88e5] rounded-full"></div>
              )}
            </Link>
            
            <Link
              to="/creator/profile"
              className={`
                group w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg
                hover:bg-[#1e88e5]/20 transition-colors text-left
                ${location.pathname === '/creator/profile' 
                  ? 'bg-[#1e88e5]/20 text-[#1e88e5]' 
                  : 'text-gray-300 hover:text-white'}
              `}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md ${location.pathname === '/creator/profile' ? 'bg-[#1e88e5]' : 'bg-gray-700 group-hover:bg-[#1e88e5]/50'}`}>
                  <User size={collapsed ? 22 : 18} className={location.pathname === '/creator/profile' ? 'text-blue-100' : ''} />
                </div>
                {!collapsed && <span>Creator Profile</span>}
              </div>
              {!collapsed && location.pathname === '/creator/profile' && (
                <div className="w-1.5 h-8 bg-[#1e88e5] rounded-full"></div>
              )}
            </Link>
            
            <div className="my-4 border-t border-gray-700/50"></div>
            
            <h3 className={`text-xs uppercase text-gray-400 font-semibold px-3 mb-2 ${collapsed ? "text-center" : ""}`}>
              {!collapsed ? "Insights & Analytics" : ""}
            </h3>
            
            <Link
              to="/creator/analytics"
              className={`
                group w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg
                hover:bg-[#1e88e5]/20 transition-colors text-left
                ${location.pathname === '/creator/analytics' 
                  ? 'bg-[#1e88e5]/20 text-[#1e88e5]' 
                  : 'text-gray-300 hover:text-white'}
              `}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md ${location.pathname === '/creator/analytics' ? 'bg-[#1e88e5]' : 'bg-gray-700 group-hover:bg-[#1e88e5]/50'}`}>
                  <BarChart3 size={collapsed ? 22 : 18} className={location.pathname === '/creator/analytics' ? 'text-blue-100' : ''} />
                </div>
                {!collapsed && <span>Analytics</span>}
              </div>
              {!collapsed && location.pathname === '/creator/analytics' && (
                <div className="w-1.5 h-8 bg-[#1e88e5] rounded-full"></div>
              )}
            </Link>
            
            <Link
              to="/creator/students"
              className={`
                group w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg
                hover:bg-[#1e88e5]/20 transition-colors text-left
                ${location.pathname === '/creator/students' 
                  ? 'bg-[#1e88e5]/20 text-[#1e88e5]' 
                  : 'text-gray-300 hover:text-white'}
              `}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md ${location.pathname === '/creator/students' ? 'bg-[#1e88e5]' : 'bg-gray-700 group-hover:bg-[#1e88e5]/50'}`}>
                  <Users size={collapsed ? 22 : 18} className={location.pathname === '/creator/students' ? 'text-blue-100' : ''} />
                </div>
                {!collapsed && <span>Student Management</span>}
              </div>
              {!collapsed && location.pathname === '/creator/students' && (
                <div className="w-1.5 h-8 bg-[#1e88e5] rounded-full"></div>
              )}
            </Link>
            
            <Link
              to="/creator/reviews"
              className={`
                group w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg
                hover:bg-[#1e88e5]/20 transition-colors text-left
                ${location.pathname === '/creator/reviews' 
                  ? 'bg-[#1e88e5]/20 text-[#1e88e5]' 
                  : 'text-gray-300 hover:text-white'}
              `}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md ${location.pathname === '/creator/reviews' ? 'bg-[#1e88e5]' : 'bg-gray-700 group-hover:bg-[#1e88e5]/50'}`}>
                  <Star size={collapsed ? 22 : 18} className={location.pathname === '/creator/reviews' ? 'text-blue-100' : ''} />
                </div>
                {!collapsed && <span>Reviews & Ratings</span>}
              </div>
              {!collapsed && location.pathname === '/creator/reviews' && (
                <div className="w-1.5 h-8 bg-[#1e88e5] rounded-full"></div>
              )}
            </Link>
          </div>
        </nav>

         <div>
        <button
          onClick={() => setIsCommercialOpen(!isCommercialOpen)}
          className={`
            w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left
            ${location.pathname.startsWith('/creator/commercial') 
              ? 'bg-[#1e88e5] border-r-4 border-[#1e88e5]/70' 
              : ''}
          `}
        >
          <BarChart3 size={20} />
            {!collapsed && <span>Commercial</span>}
        </button>

        {/* Submenu */}
        {isCommercialOpen && (
          <div className="ml-6 mt-2 flex flex-col gap-2">
            <Link
              to="/creator/commercial/dashboard"
              className={`
                flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700
                ${location.pathname === '/creator/commercial/dashboard' 
                  ? 'bg-[#1e88e5]' 
                  : ''}
              `}
            >
              <LayoutDashboard size={18} />
              {!collapsed && <span>Dashboard</span>}
            </Link>

            <Link
              to="/creator/commercial/courseDetail"
              className={`
                flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700
                ${location.pathname === '/creator/commercial/code' 
                  ? 'bg-[#1e88e5]' 
                  : ''}
              `}
            >
              <CreditCard size={18} />
             {!collapsed && <span>Commercial Course Detail</span>} 
            </Link>
          </div>
        )}
      </div>

        {/* Footer của sidebar */}
    
      </div>
    </div>
  );
};

export default Sidebar;