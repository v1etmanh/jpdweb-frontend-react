import { Link } from "react-router-dom";
import finallogo from "../images/finallogo.jpg";
import { Home, LogIn, BookOpen, User, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from "react";

export default function HeaderComponent() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    const controlHeader = () => {
      // Current scroll position
      const currentScrollY = window.scrollY;
      
      // Determine if we're scrolling up
      const isScrollingUp = currentScrollY < lastScrollY;
      
      // Apply background when scrolled down a bit
      if (currentScrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Show header at top or when scrolling up
      if (currentScrollY < 10 || isScrollingUp) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      
      // Remember last position for direction comparison
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  return (
    <header className={`font-grotesk fixed left-0 right-0 z-50 ${
      visible 
        ? "top-0 translate-y-0" 
        : "-top-24 translate-y-0"
      } ${
      scrolled 
        ? "bg-white border-b border-gray-200" 
        : "bg-white/80 backdrop-blur-md"
      } transition-all duration-300 transform`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <img
            src={finallogo}
            alt="Logo"
            className="w-10 h-10 rounded-full"
          />
          <span className="text-[#1e88e5] font-bold text-xl hidden sm:block">JPD Web</span>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-gray-700 hover:text-[#1e88e5] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex gap-2 items-center">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:text-[#1e88e5] hover:bg-[#1e88e5]/5 rounded-md transition duration-200 no-underline"
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
            </li>

       
         
            <li>
              <Link
                to="/myLearning"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:text-[#1e88e5] hover:bg-[#1e88e5]/5 rounded-md transition duration-200 no-underline"
              >
                <BookOpen size={18} />
                <span>My Learning</span>
              </Link>
            </li>
            <li>
              <Link
                to="/account"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:text-[#1e88e5] hover:bg-[#1e88e5]/5 rounded-md transition duration-200 no-underline"
              >
                <User size={18} />
                <span>My Account</span>
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:text-[#1e88e5] hover:bg-[#1e88e5]/5 rounded-md transition duration-200 no-underline"
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  // Keep empty onClick handler
                }}
                className="flex items-center gap-2 px-4 py-2 text-red-500 font-medium hover:text-red-600 hover:bg-red-50 rounded-md transition duration-200"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* User Avatar - shown on desktop */}
        <div className="hidden lg:block">
          <div className="flex items-center">
            <div className="relative group">
              <img
                src={finallogo}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-[#1e88e5]/20 cursor-pointer hover:border-[#1e88e5] transition-all duration-300"
              />
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-white"></div>
              
              {/* Tooltip */}
              <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                <div className="bg-white rounded-md border border-gray-100 p-4 text-sm">
                  <div className="font-medium text-gray-800">User Name</div>
                  <div className="text-gray-500">user@example.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 rounded-b-lg">
          <ul className="flex flex-col py-2">
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 px-6 py-3 text-gray-700 font-medium hover:bg-[#1e88e5]/5 hover:text-[#1e88e5]"
                onClick={() => setMenuOpen(false)}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="flex items-center gap-3 px-6 py-3 text-gray-700 font-medium hover:bg-[#1e88e5]/5 hover:text-[#1e88e5]"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            </li>
            <li>
              <Link
                to="/myLearning"
                className="flex items-center gap-3 px-6 py-3 text-gray-700 font-medium hover:bg-[#1e88e5]/5 hover:text-[#1e88e5]"
                onClick={() => setMenuOpen(false)}
              >
                <BookOpen size={18} />
                <span>My Learning</span>
              </Link>
            </li>
            <li>
              <Link
                to="/account"
                className="flex items-center gap-3 px-6 py-3 text-gray-700 font-medium hover:bg-[#1e88e5]/5 hover:text-[#1e88e5]"
                onClick={() => setMenuOpen(false)}
              >
                <User size={18} />
                <span>My Account</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  // Keep empty onClick handler
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 px-6 py-3 text-red-500 font-medium w-full text-left hover:bg-red-50/50"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </li>
            {/* User info in mobile view */}
            <li className="mt-2 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-3 px-6 py-3">
                <img 
                  src={finallogo}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-[#1e88e5]/20"
                />
                <div>
                  <div className="font-medium text-gray-800">User Name</div>
                  <div className="text-xs text-gray-500">user@example.com</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      )}
      </div>
    </header>
  );
}