// src/components/Navbar.jsx
import React, { useState } from "react";
import logo from "./logopocket.png"
import { NavLink } from "react-router-dom";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  // Utility classes for active links
  const activeClass = "text-white bg-gray-700";
  const inactiveClass = "text-gray-300 hover:text-white hover:bg-gray-700";

  return (
    <nav className="bg-gray-900 shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <NavLink 
              to="/" 
              className="text-white text-xl font-bold hover:text-gray-200 transition duration-200"
            >
                <div className="flex gap-2">  <img className="h-8 w-8 rounded-full
                 " src={logo} alt="" />
               
             Pocketify</div>
               
             
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              Transactions
            </NavLink>
            <NavLink
              to="/report"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              Report
            </NavLink>
            <NavLink
              to="/budget"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              Budget
            </NavLink>
            <NavLink
              to="/dash"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              Create Dashboard
            </NavLink>
            {isAuthenticated && (
              <button
                onClick={onLogout}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition duration-200"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex  items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition duration-200"
              aria-expanded="false"
            >
              <span className="  sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 ${isOpen ? 'hidden' : 'block'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`h-6  w-6 ${isOpen ? 'block' : 'hidden'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink
            to="/"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
                isActive ? activeClass : inactiveClass
              }`
            }
          >
            Home
          </NavLink>
        
          <NavLink
            to="/transactions"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
                isActive ? activeClass : inactiveClass
              }`
            }
          >
            Transactions
          </NavLink>
          <NavLink
            to="/report"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
                isActive ? activeClass : inactiveClass
              }`
            }
          >
            Report
          </NavLink>
       
          <NavLink
            to="/budget"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
                isActive ? activeClass : inactiveClass
              }`
            }
          >
            Budget
          </NavLink>
          <NavLink
            to="/dash"
            onClick={toggleMenu}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
                isActive ? activeClass : inactiveClass
              }`
            }
          >
            Create Dashboard
          </NavLink>
        
          {isAuthenticated && (
            <button
              onClick={() => {
                onLogout();
                toggleMenu();
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;