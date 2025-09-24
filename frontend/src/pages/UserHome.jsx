// src/pages/UserHome.jsx
import React from "react";
import { useSelector } from "react-redux";
import "./UserHome.css";

const UserHome = () => {
  const { user } = useSelector((state) => state.auth) || {};

  const levels = [
    { title: "Beginner", description: "Start your coding journey with easy challenges." },
    { title: "Intermediate", description: "Level up your skills with real projects." },
    { title: "Hard", description: "Test your mastery with advanced challenges." },
  ];

  const handleLevelSelect = (level) => {
    if (!user?.selectedCourse) {
      alert("Please select a course first from the navbar!");
      return;
    }
    alert(`You selected ${level} level for ${user.selectedCourse} course`);
    // Here you can navigate to the actual game/lesson page
  };

  return (
    <div className="userhome-container">
      <h1 className="welcome-text">Welcome, {user?.name || "User"}!</h1>
      {user?.selectedCourse && (
        <p className="selected-course">Selected Course: {user.selectedCourse}</p>
      )}

      <div className="level-cards">
        {levels.map((level, index) => (
          <div key={index} className="level-card">
            <div className="level-card-content">
              <h2>{level.title}</h2>
              <p>{level.description}</p>
              <button onClick={() => handleLevelSelect(level.title)}>Start</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHome;
