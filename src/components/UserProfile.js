import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";
import {
  FaUser,
  FaEnvelope,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaSave,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/slices/userSlice.js";

const UserProfile = () => {
  const user = useSelector((state) => state.user);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [user_id] = useState(user.user_id);
  const [role] = useState(user.role);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailOTP, setEmailOTP] = useState("");
  const [passwordOTP, setPasswordOTP] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nameMessage, setNameMessage] = useState("");
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passswordMessage, setPasswordMessage] = useState("");
  const [passswordErrorMessage, setPasswordErrorMessage] = useState("");
  const [emailOTPSignal, setEmailOTPSignal] = useState(false);
  const [passwordOTPSignal, setPasswordOTPSignal] = useState(false);
  const [updateNameButtonState, setUpdateNameButtonState] = useState(false);
  const [updateEmailButtonState, setUpdateEmailButtonState] = useState(false);
  const [updatePasswordButtonState, setUpdatePasswordButtonState] =
    useState(false);
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
            let gotoLogin = () => navigate("/login");
            gotoLogin();
          }
          if (res.status === 200) {
            dispatch(login({ sessionId: cookie }));
          }
        });
    } else {
      dispatch(login({ sessionId: cookie }));
    }
    axios
      .post(
        "http://127.0.0.1:5000/api/users/getUser",
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
        if (res.status === 200) {
          dispatch(
            setUser({
              ...res.data.user,
            })
          );
        }
      });
  }, []);

  const handleNameChange = () => {
    if (name) {
      setUpdateNameButtonState(true);
      axios
        .post(
          "http://127.0.0.1:5000/api/users/renameUser",
          { cookie: localStorage.getItem("auth-token"), newName: name },
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
          if (res.status === 200) {
            dispatch(setUser({ name: name, ...user }));
            setNameMessage(res.data.message);
            setTimeout(() => {
              setNameMessage("");
            }, 3000);
          } else {
            setNameErrorMessage(res.data.message);
            setTimeout(() => {
              setNameErrorMessage("");
            }, 3000);
          }
          setUpdateNameButtonState(false);
        });
    } else {
      setNameErrorMessage("Name should not be empty!");
      setTimeout(() => {
        setNameErrorMessage("");
      }, 3000);
    }
  };

  const handleEmailChange = () => {
    if (email) {
      setUpdateEmailButtonState(true);
      axios
        .post(
          "http://127.0.0.1:5000/api/users/emailChange",
          { cookie: localStorage.getItem("auth-token"), newEmail: email },
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
          setUpdateEmailButtonState(false);
          if (res.status === 200) {
            setEmailOTPSignal(true);
            setEmailMessage(res.data.message);
          } else {
            setEmailErrorMessage(res.data.message);
            setTimeout(() => {
              setEmailErrorMessage("");
            }, 3000);
          }
        });
    } else {
      setUpdateEmailButtonState(false);
      setEmailErrorMessage("Email should not be empty!");
      setTimeout(() => {
        setEmailErrorMessage("");
      }, 3000);
    }
  };

  const verifyEmailOTP = () => {
    if (emailOTP) {
      setUpdateEmailButtonState(true);
      axios
        .post(
          "http://127.0.0.1:5000/api/users/verifyEmailOTP",
          { cookie: localStorage.getItem("auth-token"), otp: emailOTP },
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
          setUpdateEmailButtonState(false);
          if (res.status === 200) {
            setEmailOTPSignal(false);
            setEmailOTP("");
            dispatch(setUser({ email: email, ...user }));
            setEmailMessage(res.data.message);
            setTimeout(() => {
              setEmailMessage("");
            }, 3000);
          } else {
            setEmailErrorMessage(res.data.message);
            setTimeout(() => {
              setEmailErrorMessage("");
            }, 3000);
          }
        });
    } else {
      setUpdateEmailButtonState(false);
      setEmailErrorMessage("OTP should not be empty!");
      setTimeout(() => {
        setEmailErrorMessage("");
      }, 3000);
    }
  };

  const handlePasswordChange = () => {
    setUpdatePasswordButtonState(true);
    if (currentPassword && newPassword && confirmPassword) {
      axios
        .post(
          "http://127.0.0.1:5000/api/users/passwordChange",
          {
            cookie: localStorage.getItem("auth-token"),
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
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
          setUpdatePasswordButtonState(false);
          if (res.status === 200) {
            setPasswordOTPSignal(true);
            setPasswordMessage(res.data.message);
          } else {
            setPasswordErrorMessage(res.data.message);
            setTimeout(() => {
              setPasswordErrorMessage("");
            }, 3000);
          }
        });
    } else {
      setUpdatePasswordButtonState(true);
      setPasswordErrorMessage("Fill all the password fields");
      setTimeout(() => {
        setPasswordErrorMessage("");
      }, 3000);
    }
  };

  const verifyPasswordOTP = () => {
    if (passwordOTP) {
      setUpdatePasswordButtonState(true);
      axios
        .post(
          "http://127.0.0.1:5000/api/users/verifyPasswordOTP",
          { cookie: localStorage.getItem("auth-token"), otp: passwordOTP },
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
          setUpdatePasswordButtonState(false);
          if (res.status === 200) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordOTPSignal(false);
            setPasswordOTP("");
            setPasswordMessage(res.data.message);
            setTimeout(() => {
              setPasswordMessage("");
            }, 3000);
          } else {
            setPasswordErrorMessage(res.data.message);
            setTimeout(() => {
              setPasswordErrorMessage("");
            }, 3000);
          }
        });
    } else {
      setUpdatePasswordButtonState(false);
      setPasswordErrorMessage("OTP should not be empty!");
      setTimeout(() => {
        setPasswordErrorMessage("");
      }, 3000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col lg:flex-col gap-6 p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <div className="flex-1 p-4 border border-gray-300 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaUser className="mr-2" /> User Information
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-600"
            >
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={user_id}
              disabled
              className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
            {nameMessage ? (
              <p className="text-green-500 text-sm mt-2">{nameMessage}</p>
            ) : (
              <></>
            )}
            {nameErrorMessage ? (
              <p className="text-red-500 text-sm mt-2">{nameErrorMessage}</p>
            ) : (
              <></>
            )}
            <button
              disabled={updateNameButtonState}
              onClick={handleNameChange}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
            >
              <FaSave className="mr-2" /> Save Name{" "}
              {updateNameButtonState ? "..." : ""}
            </button>
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-600"
            >
              Role
            </label>
            <input
              id="role"
              type="text"
              value={role}
              disabled
              className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 border border-gray-300 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaEnvelope className="mr-2" /> Email Change
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          {emailMessage ? (
            <p className="text-green-500 text-sm mt-2">{emailMessage}</p>
          ) : (
            <></>
          )}
          {emailErrorMessage ? (
            <p className="text-red-500 text-sm mt-2">{emailErrorMessage}</p>
          ) : (
            <></>
          )}
          {emailOTPSignal && (
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-600"
              >
                OTP
              </label>
              <input
                id="otp"
                type="text"
                value={emailOTP}
                onChange={(e) => setEmailOTP(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
          )}

          <button
            disabled={updateEmailButtonState}
            onClick={emailOTPSignal ? verifyEmailOTP : handleEmailChange}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
          >
            <FaSave className="mr-2" />
            {emailOTPSignal ? "Verify OTP" : "Change Email"}{" "}
            {updateEmailButtonState ? "..." : ""}
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 border border-gray-300 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaKey className="mr-2" /> Change Password
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-600"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
              <button
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-4 justify-center"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-600"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
              <button
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-4"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-600"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
              <button
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-4"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {passswordMessage ? (
            <p className="text-green-500 text-sm mt-2">{passswordMessage}</p>
          ) : (
            <></>
          )}
          {passswordErrorMessage ? (
            <p className="text-red-500 text-sm mt-2">{passswordErrorMessage}</p>
          ) : (
            <></>
          )}
          {passwordOTPSignal && (
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-600"
              >
                OTP
              </label>
              <input
                id="otp"
                type="text"
                value={passwordOTP}
                onChange={(e) => setPasswordOTP(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>
          )}
          <button
            onClick={
              passwordOTPSignal ? verifyPasswordOTP : handlePasswordChange
            }
            disabled={updatePasswordButtonState}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
          >
            <FaSave className="mr-2" />
            {passwordOTPSignal ? "Verify OTP" : "Change Password"}
            {updatePasswordButtonState ? "..." : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
