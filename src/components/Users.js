import React from "react";
import { NavLink, Route, Routes, Outlet } from "react-router-dom";
import { FaUser, FaPlusCircle, FaEdit } from "react-icons/fa";

const Users = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 flex space-x-6 justify-start">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-blue-500 font-medium text-lg"
                : "flex items-center text-gray-800 hover:text-blue-500 font-medium text-lg"
            }
          >
            <FaUser className="mr-2" /> Profile
          </NavLink>

          <NavLink
            to="edit"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-blue-500 font-medium text-lg"
                : "flex items-center text-gray-800 hover:text-blue-500 font-medium text-lg"
            }
          >
            <FaEdit className="mr-2" /> Edit User
          </NavLink>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Users;
