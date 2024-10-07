import React from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  // Handle logout by removing the token from localStorage
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    navigate("/register"); // Redirect to sign-in page
  };

  return (
    <nav className="bg-blue-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link to="/">
            <div>
              <h2>TechForing</h2>
              <span>Shaping Tomorrows Cybersecurity</span>
            </div>
          </Link>
        </div>

        {/* Conditionally render buttons based on whether the user is logged in */}
        <ul className="flex space-x-4 text-white">
          {authToken ? (
            <>
              {/* If logged in, show Main Page and Logout */}
              <li>
                <Link
                  to="/main"
                  className="hover:underline hover:text-gray-300"
                >
                  Main Page
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="hover:underline hover:text-gray-300"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              {/* If not logged in, show Sign In and Register */}
              <li>
                <Link
                  to="/signin"
                  className="hover:underline hover:text-gray-300"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:underline hover:text-gray-300"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
