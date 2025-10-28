import { Link } from "react-router-dom";
import finallogo from "../images/finallogo.jpg";
import { useAuth } from "./security/Authentication";
import { logOutKeycloak } from "./api/KeycloakService";
export default function HeaderComponent() {
  const auth = useAuth();

  return (
    <header className="font-grotesk fixed top-0 left-0 right-0 z-50 w-full bg-white bg-opacity-15 shadow-md backdrop-blur-md">
      <div className="flex justify-between items-center px-8 py-6">
        {/* Logo bên trái */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#D4B896] rounded-full flex items-center justify-center">
            <span className="text-[#5D4E37] font-bold text-sm">LOGO</span>
          </div>
        </div>

        {/* Navigation ở giữa */}
        <nav className="flex-1 flex justify-center">
          <ul className="flex gap-8 items-center m-0">
            <li>
              <Link
                to="/"
                className="inline-block text-black text-xl font-semibold hover:scale-110 transition duration-200 transform no-underline"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="inline-block text-black text-xl font-semibold hover:scale-110 transition duration-200 transform no-underline"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="inline-block text-black text-xl font-semibold hover:scale-110 transition duration-200 transform no-underline"
              >
                Contact
              </Link>
            </li>
            {auth.isAuthentication && (
              <li>
                <Link
                  to="/myLearning"
                  className="inline-block text-black text-xl font-semibold hover:scale-110 transition duration-200 transform no-underline"
                >
                  My Learning
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
                className="inline-block text-black text-xl font-semibold hover:scale-110 transition duration-200 transform no-underline"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-[#D4B896] text-[#5D4E37] font-semibold rounded-full hover:bg-[#C4A886] hover:text-[#FFFEF7] transition duration-300 shadow-md hover:shadow-lg no-underline text-lg"
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
                className="text-red-600 text-lg font-semibold hover:text-red-800 transition"
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