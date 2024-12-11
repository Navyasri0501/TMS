import React, { useState, useEffect } from "react";
import { login, logout } from "../redux/slices/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaClock, FaFlag, FaRegClipboard } from "react-icons/fa";
import { IoIosPersonAdd } from "react-icons/io";

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseErrorMessage, setResponseErrorMessage] = useState("");
  const [viewTasksMessage, setViewTasksMessage] = useState(
    "No Tasks Assigned to you"
  );
  const [updateButtonStatus, setUpdateButtonStatus] = useState(false);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
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
            let gotoLogin = () => navigate("/login");
            gotoLogin();
          }
          if (res.status === 200) {
            dispatch(login({ sessionId: cookie }));
          }
        });
    } else {
      dispatch(login({ sessionId: cookie }));
      axios
        .post(
          "http://127.0.0.1:5000/api/tasks/getTasks",
          {
            cookie: cookie,
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
            if (res.data.tasks.length === 0) {
              setViewTasksMessage("No Tasks Assigned to you");
            } else {
              setTasks(res.data.tasks);
              setViewTasksMessage("");
            }
          } else {
            setViewTasksMessage(res.data.message);
          }
        })
        .catch((err) => {
          setViewTasksMessage(err.message);
        });
    }
  }, []);

  const fetchtasks = () => {
    axios
      .post(
        "http://127.0.0.1:5000/api/tasks/getTasks",
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
        if (res.status === 200) {
          if (res.data.tasks.length === 0) {
            setViewTasksMessage("No Tasks Assigned to you");
          } else {
            setTasks(res.data.tasks);
            setViewTasksMessage("");
          }
        } else {
          setViewTasksMessage(res.data.message);
        }
      })
      .catch((err) => {
        setViewTasksMessage(err.message);
      });
  };

  const handleTaskSelect = (task_id) => {
    axios
      .post(
        "http://127.0.0.1:5000/api/tasks/getTaskById",
        {
          cookie: localStorage.getItem("auth-token"),
          task_id: task_id,
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
          setResponseErrorMessage("");
          setSelectedTask(res.data.task);
          setStatus(res.data.task.logs[0].marked_status);
        } else {
          setSelectedTask(null);
          setResponseErrorMessage(res.data.message);
          setStatus("");
        }
      })
      .catch((err) => {
        setSelectedTask(null);
        setResponseErrorMessage(err.message);
        setStatus("");
      });
  };

  const handleUpdateStatus = () => {
    if (status === selectedTask.logs[0].marked_status) {
      setResponseErrorMessage("There is no change in State or Priority.");
      setTimeout(() => setResponseErrorMessage(""), 4000);
    } else {
      if (comment) {
        setUpdateButtonStatus(true);
        axios
          .post(
            "http://127.0.0.1:5000/api/tasks/updateTaskState",
            {
              cookie: localStorage.getItem("auth-token"),
              task_id: selectedTask.task_id,
              comment: comment,
              marked_status: status,
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
            setUpdateButtonStatus(false);
            if (res.status === 200) {
              setResponseMessage(res.data.message);
              setTimeout(() => setResponseMessage(""), 3000);
              handleTaskSelect(selectedTask.task_id);
              fetchtasks();
              setComment("");
            } else {
              setResponseMessage("");
              setComment("");
              setResponseErrorMessage(res.data.message);
              setTimeout(() => setResponseErrorMessage(""), 4000);
            }
          })
          .catch((err) => {
            setUpdateButtonStatus(false);
            setResponseMessage("");
            setComment("");
            setResponseErrorMessage(err.message);
            setTimeout(() => setResponseErrorMessage(""), 4000);
          });
      } else {
        setResponseMessage("");
        setResponseErrorMessage("Comment required");
        setTimeout(() => setResponseErrorMessage(""), 4000);
      }
    }
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1 p-4 bg-white shadow-md rounded-lg h-[600px] overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Tasks</h3>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p>{viewTasksMessage}</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.task_id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 flex flex-col gap-2 flex-wrap"
                onClick={() => handleTaskSelect(task.task_id)}
              >
                <h4 className="font-medium text-gray-700">{`${task.title} - (Task ID : ${task.task_id})`}</h4>
                <div className="flex gap-5 justify-start items-center">
                  <p className="text-sm text-gray-500 flex gap-2 justify-center items-center">
                    <IoIosPersonAdd className="text-black-500" />
                    {task.assigned_by_user_id}
                  </p>
                  <p className="text-sm text-gray-500 flex gap-2 justify-center items-center">
                    <FaClock className="text-blue-500" />{" "}
                    {new Date(task.due_date).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 flex gap-2 justify-center items-center">
                    <FaFlag className="text-red-500" /> {task.priority}
                  </p>
                  <p className="text-sm text-gray-500 flex gap-2 justify-center items-center">
                    <FaRegClipboard className="text-yellow-500" />
                    {task.recent_log.marked_status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedTask && (
        <div className="flex-1 p-4 bg-white shadow-md rounded-lg h-[600px] overflow-y-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Task Details
          </h3>
          {selectedTask ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Title
                </label>
                <input
                  type="text"
                  value={selectedTask.title}
                  disabled
                  className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  value={selectedTask.description}
                  disabled
                  className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded-md"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Assigned Date
                </label>
                <input
                  type="text"
                  value={new Date(selectedTask.assigned_date).toLocaleString()}
                  disabled
                  className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Due Date
                </label>
                <input
                  type="text"
                  value={new Date(selectedTask.due_date).toLocaleString()}
                  disabled
                  className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm  font-medium text-gray-600">
                  Priority
                </label>
                <select
                  id="priority"
                  value={selectedTask.priority}
                  disabled
                  className="mt-1 p-2 w-full border bg-gray-100 border-gray-300 rounded-md"
                >
                  <option value="P0">P0</option>
                  <option value="P1">P1</option>
                  <option value="P2">P2</option>
                  <option value="P3">P3</option>
                  <option value="P4">P4</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Assigned By
                </label>
                <input
                  type="text"
                  value={selectedTask.assigned_by_user_id}
                  disabled
                  className="mt-1 p-2 w-full bg-gray-100 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Current State
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                  className="mt-1 p-2 w-full bg-white border border-gray-300 rounded-md"
                >
                  {status === "Created" ? (
                    <option value="Created">Created</option>
                  ) : (
                    <></>
                  )}
                  <option value="Initiated">Initiated</option>
                  <option value="To Do">To Do</option>
                  <option value="On Hold">On Hold</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={comment}
                  required
                  placeholder="write about change"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>

              <div>
                <p className="text-red-500 text-sm mt-2"></p>
              </div>

              <div className="mt-4 flex flex-row gap-2">
                <button
                  disabled={updateButtonStatus}
                  onClick={handleUpdateStatus}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Update Status {updateButtonStatus ? "..." : ""}
                </button>
              </div>

              {responseMessage && (
                <div className="mt-4 text-green-500 font-semibold">
                  {responseMessage}
                </div>
              )}
              {responseErrorMessage && (
                <div className="mt-4 text-red-500 font-semibold">
                  {responseErrorMessage}
                </div>
              )}

              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Task Logs
                </h4>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left bg-gray-200">
                        Timestamp
                      </th>
                      <th className="px-4 py-2 text-left bg-gray-200">State</th>
                      <th className="px-4 py-2 text-left bg-gray-200">
                        Changed By
                      </th>
                      <th className="px-4 py-2 text-left bg-gray-200">
                        Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTask.logs.slice().map((log, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-4 py-2">
                          {new Date(log.activity_time_stamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-2">{log.marked_status}</td>
                        <td className="px-4 py-2">{log.user_id}</td>
                        <td className="px-4 py-2">{log.comments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            { responseErrorMessage }
          )}
        </div>
      )}
    </div>
  );
};

export default ViewTasks;
