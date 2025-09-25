import React, { useState } from 'react';
import { Menu, Home, User, Settings, X, BookOpen, BarChart3, LayoutDashboard, CreditCard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Component Sidebar
const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
 const [isCommercialOpen, setIsCommercialOpen] = useState(false);


  return (
    <>
     
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-gray-800 text-white z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 w-64
      `}>
        {/* Header của sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
        
          <button 
            onClick={onToggle}
            className="md:hidden p-1 hover:bg-gray-700 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu items */}
        <nav className="mt-4">
       

          {/* Creator specific links */}
          <div className="mt-4 border-t border-gray-700 pt-4">
            <Link
              to="/creator/create_course"
              className={`
                w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left
                ${location.pathname === '/creator/create_course' ? 'bg-blue-600 border-r-4 border-blue-400' : ''}
              `}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
            >
              <BookOpen size={20} />
              <span>Create Your Course</span>
            </Link>
            
            <Link
              to="/creator/courseList"
              className={`
                w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left
                ${location.pathname === '/creator/manager' ? 'bg-blue-600 border-r-4 border-blue-400' : ''}
              `}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
            >
              <BarChart3 size={20} />
              <span>Manager</span>
            </Link>
             <Link
              to="/creator/profile"
              className={`
                w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left
                ${location.pathname === '/creator/manager' ? 'bg-blue-600 border-r-4 border-blue-400' : ''}
              `}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
            >
              <BarChart3 size={20} />
              <span>Creator Account</span>
            </Link>
             
          </div>
        </nav>

         <div>
        <button
          onClick={() => setIsCommercialOpen(!isCommercialOpen)}
          className={`
            w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left
            ${location.pathname.startsWith('/creator/commercial') 
              ? 'bg-blue-600 border-r-4 border-blue-400' 
              : ''}
          `}
        >
          <BarChart3 size={20} />
          <span>Commercial</span>
        </button>

        {/* Submenu */}
        {isCommercialOpen && (
          <div className="ml-6 mt-2 flex flex-col gap-2">
            <Link
              to="/creator/commercial/dashboard"
              className={`
                flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700
                ${location.pathname === '/creator/commercial/dashboard' 
                  ? 'bg-blue-500' 
                  : ''}
              `}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/creator/commercial/courseDetail"
              className={`
                flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700
                ${location.pathname === '/creator/commercial/code' 
                  ? 'bg-blue-500' 
                  : ''}
              `}
            >
              <CreditCard size={18} />
              <span>Commercial Course Detail</span>
            </Link>
          </div>
        )}
      </div>

        {/* Footer của sidebar */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-sm text-gray-400 text-center">
            © 2024 My App
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;