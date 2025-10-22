import React from "react";
import { Link, NavLink } from "react-router";

const NavBar = () => {
  const nav = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md transition-colors duration-200 font-medium
       ${
         isActive
           ? "bg-blue-600 text-white shadow-md"
           : "text-gray-700 hover:bg-blue-100 mx-2 hover:text-blue-700"
       }`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/liveTv"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md transition-colors duration-200 font-medium
       ${
         isActive
           ? "bg-blue-600 text-white shadow-md"
           : "text-gray-700 mx-2 hover:bg-blue-100 hover:text-blue-700"
       }`
          }
        >
          Tv
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md transition-colors duration-200 font-medium
       ${
         isActive
           ? "bg-blue-600 text-white shadow-md"
           : "text-gray-700 mx-2 hover:bg-blue-100 hover:text-blue-700"
       }`
          }
        >
          About
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `block px-4 py-2 rounded-md transition-colors duration-200 font-medium
       ${
         isActive
           ? "bg-blue-600 text-white shadow-md"
           : "text-gray-700 mx-2 hover:bg-blue-100 hover:text-blue-700"
       }`
          }
        >
          Contact
        </NavLink>
      </li>
    </>
  );
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {nav}
            </ul>
          </div>
          <Link to="/" className="btn btn-ghost text-xl">
            SH Tv
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{nav}</ul>
        </div>
        <div className="navbar-end">
          <a className="btn">Coming Soon !</a>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
