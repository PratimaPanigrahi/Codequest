// src/pages/admin/AdminDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const options = [
    { title: "User Management", route: "/admin/users" },
    { title: "Lesson Management", route: "/admin/lessons" },
    { title: "Quiz Management", route: "/admin/quizzes" },
  ];

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="cards-container">
        {options.map((opt) => (
          <div
            key={opt.title}
            className="admin-card"
            onClick={() => navigate(opt.route)}
          >
            <h2>{opt.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
