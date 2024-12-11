import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaUser, FaTasks, FaUserPlus } from "react-icons/fa";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { useSelector } from "react-redux";

const Header = () => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  let loginUI = (
    <NavLink
      to="/login"
      className="text-white hover:text-blue-400"
      activeClassName="text-blue-500 font-bold"
    >
      <FiLogIn className="inline-block mr-2" /> Login
    </NavLink>
  );
  let registerUI = (
    <NavLink
      to="/register"
      className="text-white hover:text-blue-400"
      activeClassName="text-blue-500 font-bold"
    >
      <FaUserPlus className="inline-block mr-2" /> Register
    </NavLink>
  );
  let ui = <></>;
  if (location.pathname === "/login") {
    ui = <>{registerUI}</>;
  }
  if (location.pathname === "/register") {
    ui = <>{loginUI}</>;
  }
  if (location.pathname === "/") {
    ui = (
      <>
        {loginUI}
        {registerUI}
      </>
    );
  }
  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <NavLink to="/">
          <h1 className="text-2xl font-bold">Task Management System</h1>
        </NavLink>

        <nav className="space-x-6">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/users"
                className="text-white hover:text-blue-400"
                activeClassName="text-blue-500 font-bold"
              >
                <FaUser className="inline-block mr-2" />
                Users
              </NavLink>
              <NavLink
                to="/tasks"
                className="text-white hover:text-blue-400"
                activeClassName="text-blue-500 font-bold"
              >
                <FaTasks className="inline-block mr-2" />
                Tasks
              </NavLink>
              <NavLink
                to="/logout"
                className="text-white hover:text-blue-400"
                activeClassName="text-blue-500 font-bold"
              >
                <FiLogOut className="inline-block mr-2" />
                Logout
              </NavLink>
            </>
          ) : (
            <>{ui}</>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
