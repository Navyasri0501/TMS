import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaEye, FaPlusCircle, FaTasks } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
const Tasks = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-4 flex space-x-6 justify-start">
          <NavLink
            to="view-tasks"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-blue-500 font-medium text-lg"
                : "flex items-center text-gray-800 hover:text-blue-500 font-medium text-lg"
            }
          >
            <FaEye className="mr-2" /> View Tasks
          </NavLink>
          <NavLink
            to="created-tasks"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-blue-500 font-medium text-lg"
                : "flex items-center text-gray-800 hover:text-blue-500 font-medium text-lg"
            }
          >
            <FaPlusCircle className="mr-2" /> Created Tasks
          </NavLink>
          <NavLink
            to="new-task"
            className={({ isActive }) =>
              isActive
                ? "flex items-center text-blue-500 font-medium text-lg"
                : "flex items-center text-gray-800 hover:text-blue-500 font-medium text-lg"
            }
          >
            <FaPlusCircle className="mr-2" /> New Task
          </NavLink>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <Outlet />{" "}
      </div>
    </div>
  );
};

export default Tasks;
