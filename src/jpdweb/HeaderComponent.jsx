import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import finallogo from "../images/finallogo.jpg";
import logo from "../images/logo.png";
import { useAuth } from "./security/Authentication";
import { logOutKeycloak } from "./api/KeycloakService";

export default function HeaderComponent() {
  const auth = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`font-grotesk fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : (isHomePage ? "bg-transparent" : "bg-white shadow-md")
      }`}
    >
      <div className="flex justify-between items-center px-8">
        {/* Logo bên trái */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-[85px] w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Navigation ở giữa */}
        <nav className="flex-1 flex justify-center">
          <ul className="flex gap-10 items-center m-0">
            <li>
              <Link
                to="/"
                className={`relative inline-block text-xl font-semibold no-underline group transition-colors duration-300 ${
                  !isScrolled && isHomePage ? "text-white hover:text-white/80" : "text-gray-800 hover:text-[#06B6D4]"
                }`}
              >
                Home
                <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-gradient-to-r from-[#06B6D4] to-[#F97316] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link
                to="/course_result/all"
                className={`relative inline-block text-xl font-semibold no-underline group transition-colors duration-300 ${
                  !isScrolled && isHomePage ? "text-white hover:text-white/80" : "text-gray-800 hover:text-[#06B6D4]"
                }`}
              >
                Explore
                <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-gradient-to-r from-[#06B6D4] to-[#F97316] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`relative inline-block text-xl font-semibold no-underline group transition-colors duration-300 ${
                  !isScrolled && isHomePage ? "text-white hover:text-white/80" : "text-gray-800 hover:text-[#06B6D4]"
                }`}
              >
                About
                <span className="absolute left-0 bottom-[-5px] w-0 h-0.5 bg-gradient-to-r from-[#06B6D4] to-[#F97316] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`relative inline-block text-xl font-semibold no-underline group transition-colors duration-300 ${
                  !isScrolled && isHomePage ? "text-white hover:text-white/80" : "text-gray-800 hover:text-[#06B6D4]"
                }`}
              >
                Contact
                <span className="absolute left-0 bottom-[-3px] w-0 h-0.5 bg-gradient-to-r from-[#06B6D4] to-[#F97316] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            {auth.isAuthentication && (
              <li>
                <Link
                  to="/myLearning"
                  className={`relative inline-block text-xl font-semibold no-underline group transition-colors duration-300 ${
                    !isScrolled && isHomePage ? "text-white hover:text-white/80" : "text-gray-800 hover:text-[#06B6D4]"
                  }`}
                >
                  My Learning
                  <span className="absolute left-0 bottom-[-3px] w-0 h-0.5 bg-gradient-to-r from-[#06B6D4] to-[#F97316] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Auth buttons và avatar bên phải */}
        <div className="flex items-center gap-4">
          {!auth.isAuthentication ? (
            <>
              <Link
                to="/login"
                className={`relative inline-block text-xl font-semibold no-underline group transition-colors duration-300 ${
                  !isScrolled && isHomePage ? "text-white hover:text-white/80" : "text-black hover:text-[#06B6D4]"
                }`}
              >
                Login
                <span className="absolute left-0 bottom-[-3px] w-0 h-0.5 bg-[#FF8A80] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-[#F97316] text-white font-semibold rounded-full hover:bg-[#EA580C] transition duration-300 shadow-md hover:shadow-lg no-underline text-lg"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  logOutKeycloak();
                  auth.setAuthentication(false);
                }}
                className={`text-lg font-semibold transition-colors duration-300 ${
                  !isScrolled && isHomePage
                    ? "text-white hover:text-red-200"
                    : "text-red-600 hover:text-red-800"
                }`}
              >
                Logout
              </button>
              <img
                src={finallogo}
                alt="User Avatar"
                className="w-10 h-10 rounded-full cursor-pointer hover:scale-105 transition-transform duration-300"
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
