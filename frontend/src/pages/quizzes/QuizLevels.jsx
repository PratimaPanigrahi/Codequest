// src/pages/quizzes/QuizLevels.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QuizLevels.css";

const difficultyLevelsMap = {
  beginner: [1, 2, 3],
  intermediate: [4, 5, 6],
  advanced: [7, 8, 9],
};

const difficultyColors = {
  beginner: "#4CAF50",
  intermediate: "#2196F3",
  advanced: "#FF9800",
};

const difficultyIcons = {
  beginner: "🌱",
  intermediate: "🚀",
  advanced: "🏆",
};

const QuizLevels = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const handleDifficultySelect = (diff) => setSelectedDifficulty(diff);

  const handleLevelSelect = (level) => {
    navigate(`/quizzes/${selectedDifficulty}/${level}`);
  };

  const handleBack = () => setSelectedDifficulty(null);

  return (
    <div className="quiz-levels-container">
      {!selectedDifficulty ? (
        <>
          <h1>📚 Choose Your Quiz Difficulty</h1>
          <div className="difficulty-cards">
            {Object.keys(difficultyLevelsMap).map(diff => (
              <div key={diff} className="difficulty-card" style={{ borderLeft: `4px solid ${difficultyColors[diff]}` }}>
                <h2>{difficultyIcons[diff]} {diff.charAt(0).toUpperCase() + diff.slice(1)}</h2>
                <p>
                  {diff === "beginner" ? "Start with basic concepts" :
                   diff === "intermediate" ? "Build on fundamentals" :
                   "Master advanced concepts"}
                </p>
                <button 
                  style={{ color: difficultyColors[diff], borderColor: difficultyColors[diff] }}
                  onClick={() => handleDifficultySelect(diff)}
                >
                  Start {diff} Quiz →
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2>{difficultyIcons[selectedDifficulty]} {selectedDifficulty.toUpperCase()} - Select Level</h2>
          <div className="level-buttons">
            {difficultyLevelsMap[selectedDifficulty].map(level => (
              <button key={level} style={{ backgroundColor: difficultyColors[selectedDifficulty] + "aa" }} onClick={() => handleLevelSelect(level)}>
                Level {level}
              </button>
            ))}
          </div>
          <button className="back-button" onClick={handleBack}>← Back to Difficulty</button>
        </>
      )}
    </div>
  );
};

export default QuizLevels;
