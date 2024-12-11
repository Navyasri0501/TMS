import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaUser, FaTasks } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
const EditUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchButtonState, setSearchButtonState] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchErrorMessage, setSearchErrorMessage] = useState("");
  const [userErrorMessage, setUserErrorMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [responseErrorMessage, setErrorResponseMessage] = useState("");
  const [updateResponseMessage, setUpdateResponseMessage] = useState("");
  const [updateResponseErrorMessage, setUpdateResponseErrorMessage] =
    useState("");
  const [updateButtonState, setUpdateButtonState] = useState(false);
  const [deleteButtonState, setDeleteButtonState] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const currentUser = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  }, []);

  const changePermission = (permission) => {
    let permissions = {};
    switch (permission) {
      case "edit_user":
        permissions = { ...selectedUser.permissions };
        let edit_user = permissions.edit_user === 1 ? 0 : 1;
        permissions = { ...permissions, edit_user: edit_user };
        setSelectedUser((prev) => {
          return { ...prev, permissions: permissions };
        });
        break;
      case "delete_user":
        permissions = { ...selectedUser.permissions };
        let delete_user = permissions.delete_user === 1 ? 0 : 1;
        permissions = { ...permissions, delete_user: delete_user };
        setSelectedUser((prev) => {
          return { ...prev, permissions: permissions };
        });
        break;
      case "create_task":
        permissions = { ...selectedUser.permissions };
        let create_task = permissions.create_task === 1 ? 0 : 1;
        permissions = { ...permissions, create_task: create_task };
        setSelectedUser((prev) => {
          return { ...prev, permissions: permissions };
        });
        break;
      case "edit_task":
        permissions = { ...selectedUser.permissions };
        let edit_task = permissions.edit_task === 1 ? 0 : 1;
        permissions = { ...permissions, edit_task: edit_task };
        setSelectedUser((prev) => {
          return { ...prev, permissions: permissions };
        });
        break;
      case "delete_task":
        permissions = { ...selectedUser.permissions };
        let delete_task = permissions.delete_task === 1 ? 0 : 1;
        permissions = { ...permissions, delete_task: delete_task };
        setSelectedUser((prev) => {
          return { ...prev, permissions: permissions };
        });
        break;
      case "edit_task_state":
        permissions = { ...selectedUser.permissions };
        let edit_task_state = permissions.edit_task_state === 1 ? 0 : 1;
        permissions = { ...permissions, edit_task_state: edit_task_state };
        setSelectedUser((prev) => {
          return { ...prev, permissions: permissions };
        });
        break;
      default:
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchClick = () => {
    setSearchButtonState(true);
    axios
      .post(
        "http://127.0.0.1:5000/api/users/searchUsers",
        {
          cookie: localStorage.getItem("auth-token"),
          search: searchQuery,
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
        setSearchButtonState(false);
        if (res.status === 200) {
          setSearchResults(res.data.users);
          setSearchErrorMessage("");
        } else {
          setSearchResults([]);
          setSearchErrorMessage(res.data.message);
        }
      })
      .catch((err) => {
        setSearchResults([]);
        setSearchButtonState(false);
        setSearchErrorMessage(err.message);
      });
  };

  const handleUserSelect = (user) => {
    axios
      .post(
        "http://127.0.0.1:5000/api/users/getUserbyId",
        {
          cookie: localStorage.getItem("auth-token"),
          user_id: user.user_id,
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
          setUserErrorMessage("");
          setSelectedUser(res.data.user);
        } else {
          setSelectedUser(null);
          setUserErrorMessage(res.message);
        }
      })
      .catch((err) => {
        setSelectedUser(null);
        setUserErrorMessage(err.message);
      });
  };

  const handleUpdateChanges = () => {
    if (currentUser.permissions.edit_user) {
      setUpdateButtonState(true);
      axios
        .post(
          "http://127.0.0.1:5000/api/users/updateUser",
          {
            cookie: localStorage.getItem("auth-token"),
            targetUser: { ...selectedUser },
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
            setUpdateResponseErrorMessage("");
            setUpdateResponseMessage(res.data.message);
            setTimeout(() => {
              setUpdateResponseMessage("");
            }, 3000);
            handleUserSelect({ user_id: selectedUser.user_id });
            handleSearchClick();
          } else {
            setUpdateResponseMessage("");
            setUpdateResponseErrorMessage(res.data.message);
            setTimeout(() => {
              setUpdateResponseErrorMessage("");
            }, 3000);
          }
          setUpdateButtonState(false);
        })
        .catch((err) => {
          setUpdateButtonState(false);
          setUpdateResponseErrorMessage(err.message);
          setTimeout(() => {
            setUpdateResponseErrorMessage("");
          }, 5000);
        });
    } else {
      setUpdateResponseErrorMessage("You don't have Edit User Access");
    }
  };

  const handleDelete = () => {
    if (currentUser.permissions.delete_user) {
      setUpdateButtonState(true);
      axios
        .post(
          "http://127.0.0.1:5000/api/users/deleteUser",
          {
            cookie: localStorage.getItem("auth-token"),
            targetUser: selectedUser.user_id,
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
            setUpdateResponseErrorMessage("");
            setUpdateResponseMessage(res.data.message);
            setTimeout(() => {
              setUpdateResponseMessage("");
            }, 3000);
            handleSearchClick();
            setSelectedUser(null);
          } else {
            setUpdateResponseMessage("");
            setUpdateResponseErrorMessage(res.data.message);
            setTimeout(() => {
              setUpdateResponseErrorMessage("");
            }, 5000);
          }
          setUpdateButtonState(false);
        })
        .catch((err) => {
          setUpdateButtonState(false);
          setUpdateResponseErrorMessage(err.message);
          setTimeout(() => {
            setUpdateResponseErrorMessage("");
          }, 5000);
        });
    } else {
      setUpdateResponseErrorMessage("You don't have Delete User Access");
    }
  };

  return (
    <div className="flex gap-6 mt-8">
      <div className="flex-1 p-4 bg-white shadow-md rounded-lg h-[600px] overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaSearch className="mr-2" /> Search User
        </h3>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          placeholder="Search by user ID or name"
        />
        {searchErrorMessage && (
          <p className="text-red-500 text-sm m-2 w-full flex items-center justify-center">
            {searchErrorMessage}
          </p>
        )}
        <button
          disabled={searchButtonState}
          onClick={handleSearchClick}
          className="w-full p-2 bg-blue-500 text-white rounded-md"
        >
          Search {searchButtonState ? "..." : ""}
        </button>
        <div className="space-y-4 mt-4">
          {searchResults.length === 0 ? (
            <div>No results found</div>
          ) : (
            searchResults.map((user) => (
              <div
                key={user.user_id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="font-medium">
                  {user.name} ({user.user_id})
                </span>
                <button
                  onClick={() => handleUserSelect(user)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Select
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 p-4 bg-white shadow-md rounded-lg h-[600px] overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaEdit className="mr-2" /> Edit User Details
        </h3>
        {selectedUser ? (
          <>
            <div className="space-y-4 w-auto">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  User ID
                </label>
                <input
                  type="text"
                  value={selectedUser.user_id}
                  disabled
                  className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  User Name
                </label>
                <input
                  type="text"
                  value={selectedUser.name}
                  disabled
                  className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Power
                </label>
                <input
                  type="number"
                  name="power"
                  value={selectedUser.power}
                  onChange={(event) => {
                    let u = { ...selectedUser };
                    u.power = Number(event.target.value);
                    setSelectedUser({ ...u });
                  }}
                  min="0"
                  disabled={!currentUser.permissions.edit_task}
                  className="mt-1 p-2 w-full bg-white border border-gray-300 rounded-md"
                />
                <small className="text-red-500">{}</small>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Role
                </label>
                <select
                  value={selectedUser.role}
                  onChange={(event) => {
                    let u = { ...selectedUser };
                    u.role = event.target.value;
                    setSelectedUser({ ...u });
                  }}
                  disabled={!currentUser.permissions.edit_task}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                >
                  <option value="New User">New User</option>
                  <option value="Team Member">Team Member</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Manager">Manager</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2 flex justify-start items-center">
                  <FaUser className="mr-2" />
                  User Permissions
                </h4>
                <div className="space-y-2 flex justify-start items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled={!currentUser.permissions.edit_task}
                      checked={selectedUser.permissions.edit_user}
                      onChange={() => {
                        changePermission("edit_user");
                      }}
                      className="form-checkbox"
                    />
                    Edit User
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled={!currentUser.permissions.edit_task}
                      checked={selectedUser.permissions.delete_user}
                      onChange={() => {
                        changePermission("delete_user");
                      }}
                      className="form-checkbox"
                    />
                    Delete User
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2 flex justify-start items-center">
                  <FaTasks className="mr-2" />
                  Task Permissions
                </h4>
                <div className="space-y-2 flex justify-start items-center gap-3">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled={!currentUser.permissions.edit_task}
                      checked={selectedUser.permissions.create_task}
                      onChange={() => {
                        changePermission("create_task");
                      }}
                      className="form-checkbox"
                    />
                    Create Task
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled={!currentUser.permissions.edit_task}
                      checked={selectedUser.permissions.edit_task}
                      onChange={() => {
                        changePermission("edit_task");
                      }}
                      className="form-checkbox"
                    />
                    Edit Task
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled={!currentUser.permissions.edit_task}
                      checked={selectedUser.permissions.delete_task}
                      onChange={() => {
                        changePermission("delete_task");
                      }}
                      className="form-checkbox"
                    />
                    Delete Task
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      disabled={!currentUser.permissions.edit_task}
                      checked={selectedUser.permissions.edit_task_state}
                      onChange={() => {
                        changePermission("edit_task_state");
                      }}
                      className="form-checkbox"
                    />
                    Edit Task State
                  </label>
                </div>
              </div>
              {updateResponseMessage && (
                <div className="mt-4 text-green-500 font-semibold">
                  {updateResponseMessage}
                </div>
              )}
              {updateResponseErrorMessage && (
                <div className="mt-4 text-red-500 font-semibold">
                  {updateResponseErrorMessage}
                </div>
              )}
              <div className="flex justify-center items-center gap-4">
                <button
                  disabled={updateButtonState}
                  onClick={handleUpdateChanges}
                  className="w-full p-2 bg-green-500 text-white rounded-md"
                >
                  Update Changes {updateButtonState ? "..." : ""}
                </button>
                <button
                  disabled={deleteButtonState}
                  onClick={handleDelete}
                  className="w-full p-2 bg-red-500 text-white rounded-md"
                >
                  Delete User {deleteButtonState ? "..." : ""}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-gray-500">{userErrorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default EditUser;
