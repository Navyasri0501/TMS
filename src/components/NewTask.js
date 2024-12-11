import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../redux/slices/authSlice";
const NewTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("P0");
  const [userId, setUserId] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [responseErrorMessage, setResponseErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !description || !dueDate || !userId) {
      setResponseMessage("Please fill all the required fields.");
      return;
    }

    const currentDate = new Date();
    const selectedDate = new Date(dueDate);

    if (selectedDate < currentDate) {
      setResponseMessage("Due date cannot be in the past.");
      return;
    }

    axios
      .post(
        "http://127.0.0.1:5000/api/tasks/createTask",
        {
          title: title,
          description: description,
          priority: priority,
          userId: userId,
          due_date: dueDate,
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
        setLoading(false);
        if (res.status === 200) {
          setResponseMessage(res.data.message);
          setResponseErrorMessage("");
          setTimeout(() => setResponseMessage(""), 3000);
          setPriority("P0");
          setDescription("");
          setTitle("");
          setDueDate("");
          setUserId("");
        } else {
          setResponseErrorMessage(res.data.message);
          setResponseMessage("");
          setTimeout(() => setResponseErrorMessage(""), 5000);
        }
      })
      .catch((err) => {
        setLoading(false);
        setResponseErrorMessage(err.message);
        setResponseMessage("");
        setTimeout(() => setResponseErrorMessage(""), 5000);
      });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Create Task</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-600"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-600"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-600"
          >
            Due Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            id="dueDate"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-600"
          >
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          >
            <option value="P0">P0</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="userId"
            className="block text-sm font-medium text-gray-600"
          >
            User ID {`(Use commas for multiple users)`}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
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

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
          disabled={loading}
        >
          {loading ? "Creating Task..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default NewTask;
