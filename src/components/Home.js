import React, { useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { FaEye, FaPlus, FaEdit, FaChartBar } from "react-icons/fa";
import illustration from "../assets/Completed-amico.png"; // Import the PNG image
import axios from "axios";
import { useDispatch } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";
const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    let cookie = localStorage.getItem("auth-token");
    if (!cookie) {
      axios
        .post(
          "http://127.0.0.1:5000/api/auth/",
          {
            cookie,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer <your-token-here>",
            },
            validateStatus: (status) => {
              return true;
            },
          }
        )
        .then((res) => {
          if (res.status !== 200) {
            localStorage.removeItem("auth-token");
            dispatch(logout());
          }
          if (res.status === 200) {
            dispatch(login({ sessionId: cookie }));
          }
        });
    } else {
      dispatch(login({ sessionId: cookie }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Task Management System
        </h1>

        <div className="text-center mb-8">
          <img
            src={illustration}
            alt="Illustration"
            className="mx-auto"
            width="275"
            height="275"
          />
        </div>

        <div className="flex justify-center items-center gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 w-1/3">
            <h1 className="text-xl font-semibold text-gray-700 mb-4">
              Task Overview
            </h1>
            <p className="text-gray-600 mb-4">
              Overview of all your tasks, including status, deadlines, and
              priorities.
            </p>
            <div className="flex justify-between">
              <Link to="/tasks/view-tasks">
                <button className="text-blue-600 hover:text-blue-800">
                  <FaEye className="inline-block mr-2" /> View
                </button>
              </Link>
              <Link to="/tasks/new-task">
                <button className="text-green-600 hover:text-green-800">
                  <FaPlus className="inline-block mr-2" /> Add
                </button>
              </Link>
              <Link to="/tasks/view-tasks">
                <button className="text-yellow-600 hover:text-yellow-800">
                  <FaEdit className="inline-block mr-2" /> Update
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300 w-1/3">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Task Statistics
            </h2>
            <p className="text-gray-600 mb-4">
              View detailed statistics about your tasks, such as completion
              rate, pending tasks, etc.
            </p>
            <div className="flex justify-between">
              <Link to="/tasks">
                <button className="text-blue-600 hover:text-blue-800">
                  <FaChartBar className="inline-block mr-2" /> View Stats
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/tasks">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300">
              Go to Tasks
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
