import React, { useState, useEffect } from "react";
import axios from "axios";
import { login, logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [otpSignal, setOtpSignal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [buttonState, setButtonState] = useState(false);
  const navigate = useNavigate();
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
          } else {
            dispatch(login({ sessionId: cookie }));
            let gotoTasks = () => navigate("/tasks");
            gotoTasks();
          }
        });
    } else {
      dispatch(login({ sessionId: cookie }));
      navigate("/tasks");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setButtonState(true);
    axios
      .post(
        "http://127.0.0.1:5000/api/auth/register",
        { ...formData },
        {
          withCredentials: true,
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
        setButtonState(false);
        switch (res.status) {
          case 200:
            setOtpSignal(true);
            setMessage(res.data.message);
            setErrorMessage("");
            break;
          default:
            setErrorMessage(res.data.message);
            setMessage("");
        }
      })
      .catch((error) => {
        setButtonState(false);
        setMessage("");
        setErrorMessage(
          error.message ||
            "An unexpected error occurred. Please try again later."
        );
      });
  };

  const handleOtpSubmit = (e) => {
    setButtonState(true);
    e.preventDefault();
    let { username, otp, ...rest } = formData;
    axios
      .post(
        "http://127.0.0.1:5000/api/auth/verifyOTP",
        { username, otp },
        {
          withCredentials: true,
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
        switch (res.status) {
          case 200:
            setMessage(res.data.message + " Redirecting to Login page");
            setErrorMessage("");
            let gotoLogin = () => navigate("/login");
            setTimeout(() => {
              gotoLogin();
            }, 5000);
            break;
          default:
            setButtonState(false);
            setErrorMessage(res.data.message);
            setMessage("");
        }
      })
      .catch((error) => {
        setButtonState(false);
        setMessage("");
        setErrorMessage(
          error.message ||
            "An unexpected error occurred. Please try again later."
        );
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Register</h2>
        <form onSubmit={otpSignal ? handleOtpSubmit : handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength="4"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              disabled={otpSignal}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              disabled={otpSignal}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              disabled={otpSignal}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="8"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              disabled={otpSignal}
            />
          </div>

          {otpSignal ? (
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP (One-Time Password)
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                maxLength="6"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP"
              />
            </div>
          ) : (
            <></>
          )}
          {errorMessage ? (
            <p className="text-red-500 text-sm mt-2 w-full flex items-center justify-center">
              {errorMessage}
            </p>
          ) : (
            <></>
          )}

          {message ? (
            <p className="text-green-500 text-sm mt-2 w-full flex items-center justify-center">
              {message}
            </p>
          ) : (
            <></>
          )}

          <button
            type="submit"
            disabled={buttonState}
            className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {otpSignal ? "Verify OTP" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
