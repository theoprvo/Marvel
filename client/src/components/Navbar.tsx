import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiSearch, FiUser, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  return (
    <nav className="bg-gray-900 text-white shadow-lg fixed top-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold">
              MarvelApp
            </Link>
          </div>

          {/* LINKS */}
          <div className="hidden md:flex space-x-4">
            <NavLink
              to="/characters"
              className={({ isActive }) =>
                `text-lg ${isActive ? "text-blue-400" : "hover:text-blue-400"}`
              }
            >
              Characters
            </NavLink>
            <NavLink
              to="/comics"
              className={({ isActive }) =>
                `text-lg ${isActive ? "text-blue-400" : "hover:text-blue-400"}`
              }
            >
              Comics
            </NavLink>
          </div>

          {/* SEARCH + USER ICON */}
          <div className="flex items-center space-x-4">
            {/* USER DROPDOWN */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
              >
                <FiUser className="w-6 h-6 hover:text-blue-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-md shadow-lg py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Signup
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => console.log("Logout")}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        <div className="flex justify-around bg-gray-800 py-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm ${isActive ? "text-blue-400" : "hover:text-blue-400"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/characters"
            className={({ isActive }) =>
              `text-sm ${isActive ? "text-blue-400" : "hover:text-blue-400"}`
            }
          >
            Characters
          </NavLink>
          <NavLink
            to="/comics"
            className={({ isActive }) =>
              `text-sm ${isActive ? "text-blue-400" : "hover:text-blue-400"}`
            }
          >
            Comics
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
