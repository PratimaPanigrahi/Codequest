import React from "react";
import { useNavigate } from "react-router-dom";

const UserHome = () => {
  const navigate = useNavigate();
  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  const handleCardClick = (difficulty) => {
    navigate(`/lessons/${difficulty.toLowerCase()}`);
  };

  return (
    <div className="userhome-container">
      <h1>Available Lessons</h1>
      <div className="difficulty-cards">
        {difficulties.map((diff) => (
          <div
            key={diff}
            className="difficulty-card"
            onClick={() => handleCardClick(diff)}
            style={{
              cursor: "pointer",
              padding: "20px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            <h2>{diff}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHome;
