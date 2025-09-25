import { Link } from "react-router-dom";
import finallogo from "../images/finallogo.jpg";
export default function HeaderComponent() {
 
  
 



  return (
    <header className="font-grotesk fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-[70%]  bg-white bg-opacity-15 shadow-md rounded-3xl backdrop-blur-md">
      <div className="flex justify-between items-center ">
        <nav>
          <ul className="flex gap-6 items-center justify-center ">
            <li>
              <Link
                to="/"
                className="inline-block text-black text-xl font-semibold hover:scale-110  transition duration-200 transform  no-underline"
              >
                Home
              </Link>
            </li>

           
              <>
                <li>
                  <Link
                    to="/login"
                    className="inline-block text-black text-xl font-semibold hover:scale-110  transition duration-200 transform  no-underline"
                  >
                    Login
                  </Link>
                </li>

           
         
                <li>
                  <Link
                    to="/myLearning"
                    className="inline-block text-black text-xl font-semibold hover:scale-110  transition duration-200 transform  no-underline"
                  >
                    My Learning
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account"
                    className="inline-block text-black text-xl font-semibold hover:scale-110  transition duration-200 transform  no-underline"
                  >
                    My Account
                  </Link>
                </li>
                

                <li>
                  <button
                    onClick={() => {
                   
                    }}
                    className="text-red-600 text-xl font-semibold hover:text-red-800 transition"
                  >
                    Logout
                  </button>
                </li>
              </>
           
          </ul>
        </nav>

          <div>
          <img
            src={finallogo}  // Replace with your image path or URL
            alt="User Avatar"
            className="w-9 h-9 mr-2 rounded-full  cursor-pointer hover:scale-105 transition-transform duration-300"
          />
        </div>



      </div>
    </header>
  );
}