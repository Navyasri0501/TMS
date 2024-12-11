import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Logout = () => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cookie = localStorage.getItem("auth-token");
    if (!cookie) {
      navigate("/");
    }
  }, []);

  const handleLogout = () => {
    axios
      .post(
        "http://127.0.0.1:5000/api/auth/logout",
        {
          cookie: localStorage.getItem("auth-token"),
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
        localStorage.removeItem("auth-token");
        navigate("/");
      });
  };

  const cancelLogout = () => {
    setShowModal(false);
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div>
        {showModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Are you sure you want to log out?
              </h2>
              <div className="flex justify-between">
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300"
                >
                  Yes
                </button>
                <button
                  onClick={cancelLogout}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition duration-300"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logout;
