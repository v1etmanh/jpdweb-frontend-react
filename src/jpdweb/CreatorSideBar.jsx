import React, { useState } from 'react';
import { 
  Menu, 
  Home, 
  User, 
  Settings, 
  X, 
  BookOpen, 
  BarChart3, 
  LayoutDashboard, 
  CreditCard,
  ChevronDown,
  ChevronRight,
  DollarSign,
  History,
  Wallet
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Component Sidebar
const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [isCommercialOpen, setIsCommercialOpen] = useState(false);

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  // Navigation items configuration
  const mainMenuItems = [
    { path: '/creator/create_course', icon: BookOpen, label: 'Create Your Course' },
    { path: '/creator/courseList', icon: BarChart3, label: 'Manager' },
    { path: '/creator/class/kahoot', icon: BarChart3, label: 'Kahoot' },
    { path: '/creator/profile', icon: User, label: 'Creator Account' },
  ];

  const commercialSubItems = [
    { path: '/creator/commercial/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/creator/commercial/courseDetail', icon: CreditCard, label: 'Commercial Course Detail' },
    { path: '/creator/commercial/history_transaction', icon: History, label: 'Transaction History' },
    { path: '/creator/commercial/balance', icon: Wallet, label: 'Your Budget' },
  ];

  // Active link checker
  const isActiveLink = (path) => location.pathname === path;
  const isCommercialActive = commercialSubItems.some(item => isActiveLink(item.path));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-gray-900 text-white z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        md:translate-x-0 w-64 border-r border-gray-700
      `}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Creator Hub
            </span>
          </div>
          
          <button 
            onClick={onToggle}
            className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Container */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Main Menu Items */}
          <div className="space-y-1 px-3">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600 shadow-lg shadow-blue-500/25 border-l-4 border-blue-400' 
                      : 'hover:bg-gray-800 hover:border-l-4 hover:border-gray-600'
                    }
                  `}
                  onClick={handleLinkClick}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                  <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Commercial Section */}
          <div className="mt-8 px-3">
            {/* Commercial Header */}
            <button
              onClick={() => setIsCommercialOpen(!isCommercialOpen)}
              className={`
                w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                ${isCommercialActive 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/25' 
                  : 'hover:bg-gray-800'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <DollarSign size={20} className={isCommercialActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                <span className={`font-medium ${isCommercialActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                  Commercial
                </span>
              </div>
              {isCommercialOpen ? (
                <ChevronDown size={16} className={isCommercialActive ? 'text-white' : 'text-gray-400'} />
              ) : (
                <ChevronRight size={16} className={isCommercialActive ? 'text-white' : 'text-gray-400'} />
              )}
            </button>

            {/* Commercial Submenu */}
            {isCommercialOpen && (
              <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-700 pl-3 py-2">
                {commercialSubItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveLink(item.path);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group
                        ${isActive 
                          ? 'bg-green-500/20 text-green-300 border-l-2 border-green-400' 
                          : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                        }
                      `}
                      onClick={handleLinkClick}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-700 p-6 bg-gray-800/50">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">
              Powered by Learning Platform
            </div>
            <div className="text-xs text-gray-500">
              © 2024 All rights reserved
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;