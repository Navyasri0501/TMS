import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import Users from "./components/Users";
import UserProfile from "./components/UserProfile";
import EditUser from "./components/EditUser";
import Tasks from "./components/Tasks";
import ViewTasks from "./components/ViewTasks";
import CreateTask from "./components/NewTask";
import Home from "./components/Home";
import Logout from "./components/Logout";
import NewTask from "./components/NewTask";
import CreatedTasks from "./components/CreatedTasks";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />}>
          <Route index element={<UserProfile />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="edit" element={<EditUser />} />
        </Route>
        <Route path="/tasks" element={<Tasks />}>
          <Route index element={<ViewTasks />} />
          <Route path="view-tasks" element={<ViewTasks />} />
          <Route path="created-tasks" element={<CreatedTasks />} />
          <Route path="new-task" element={<NewTask />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
