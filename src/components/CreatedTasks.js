import React, { useState, useEffect } from "react";
import { login, logout } from "../redux/slices/authSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaClock, FaFlag, FaRegClipboard } from "react-icons/fa";
import { IoIosPersonAdd } from "react-icons/io";

const CreatedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseErrorMessage, setResponseErrorMessage] = useState("");
  const [viewTasksMessage, setViewTasksMessage] = useState(
    "No Tasks Assigned to you"
  );
  const [updateButtonState, setUpdateButtonState] = useState(false);
  const [deleteButtonState, setDeleteButtonState] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("P0");

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
          "http://127.0.0.1:5000/api/tasks/getCreatedTasks",
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

  const fetchTasks = () => {
    axios
      .post(
        "http://127.0.0.1:5000/api/tasks/getCreatedTasks",
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
          setTasks([]);
          setViewTasksMessage(res.data.message);
        }
      })
      .catch((err) => {
        setViewTasksMessage(err.message);
      });
  };

  const formatDueDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
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
          setTitle(res.data.task.title);
          setDescription(res.data.task.description);
          setPriority(res.data.task.priority);
          setDueDate(formatDueDate(res.data.task.due_date));
        } else {
          setSelectedTask(null);
          setTitle("");
          setDescription("");
          setPriority("P0");
          setDueDate(formatDueDate(new Date()));
          setResponseErrorMessage(res.data.message);
        }
      })
      .catch((err) => {
        setSelectedTask(null);
        setTitle("");
        setDescription("");
        setPriority("P0");
        setDueDate(formatDueDate(new Date()));
        setResponseErrorMessage(err.message);
      });
  };

  const handleUpdateTask = () => {
    if (!title || !description || !dueDate) {
      setResponseErrorMessage("Please fill all the required fields.");
      setTimeout(() => setResponseErrorMessage(""), 4000);
    } else {
      let body = {
        title: title,
        task_id: selectedTask.task_id,
        description: description,
        priority: priority,
        due_date: dueDate,
      };
      axios
        .post(
          "http://127.0.0.1:5000/api/tasks/updateTask",
          {
            cookie: localStorage.getItem("auth-token"),
            ...body,
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
            handleTaskSelect(selectedTask.task_id);
            fetchTasks();
            setResponseMessage(res.data.message);
            setTimeout(() => setResponseMessage(""), 4000);
          } else {
            setResponseErrorMessage(res.data.message);
            setTimeout(() => setResponseErrorMessage(""), 4000);
          }
        })
        .catch((err) => {
          setResponseErrorMessage(err.message);
          setTimeout(() => setResponseErrorMessage(""), 4000);
        });
    }
  };

  const handleDeleteTask = () => {
    axios
      .post(
        "http://127.0.0.1:5000/api/tasks/deleteTask",
        {
          cookie: localStorage.getItem("auth-token"),
          task_id: selectedTask.task_id,
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
          handleTaskSelect(null);
          fetchTasks();
          setResponseMessage(res.data.message);
          setTimeout(() => setResponseMessage(""), 4000);
        } else {
          fetchTasks();
          setResponseErrorMessage(res.data.message);
          setTimeout(() => setResponseErrorMessage(""), 4000);
        }
      })
      .catch((err) => {
        setResponseErrorMessage(err.message);
        setTimeout(() => setResponseErrorMessage(""), 4000);
      });
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
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  className="mt-1 p-2 w-full  border border-gray-300 rounded-md"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 p-2 w-full  border border-gray-300 rounded-md"
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
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 p-2 w-full  border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm  font-medium text-gray-600">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="mt-1 p-2 w-full border  border-gray-300 rounded-md"
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
                <p className="text-red-500 text-sm mt-2"></p>
              </div>

              <div className="flex justify-start items-center gap-6">
                <div className="mt-4 flex flex-row gap-2">
                  <button
                    disabled={updateButtonState}
                    onClick={handleUpdateTask}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Update Task {updateButtonState ? "..." : ""}
                  </button>
                </div>

                <div className="mt-4 flex flex-row gap-2">
                  <button
                    disabled={deleteButtonState}
                    onClick={handleDeleteTask}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete Task {deleteButtonState ? "..." : ""}
                  </button>
                </div>
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

export default CreatedTasks;
