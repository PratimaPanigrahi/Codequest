// src/pages/quizzes/QuizList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./QuizList.css";

const QuizList = () => {
  const navigate = useNavigate();

  const handleLevelQuizStart = () => {
    // Navigate to level selection page
    navigate("/quizzes/levels");
  };

  const handleTestQuizStart = () => {
    // Navigate to test selection (you can create similar structure for tests)
    navigate("/quizzes/tests");
  };

  return (
    <div className="quizlist-container">
      <div className="quizlist-header">
        <h1>🎯 Assessment Center</h1>
        <p>Choose your assessment type to begin</p>
      </div>

      <div className="assessment-options">
        {/* Level-wise Quiz Option */}
        <div className="assessment-card">
          <div className="card-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>

          <div className="card-content">
            <h2>Level-wise Quiz</h2>
            <p className="card-description">
              Step-by-step learning with structured level-based quizzes. Build strong fundamentals progressively.
            </p>

            <div className="card-features">
              <div className="feature"><i className="fas fa-check-circle"></i> Structured learning path</div>
              <div className="feature"><i className="fas fa-check-circle"></i> Progressive difficulty</div>
              <div className="feature"><i className="fas fa-check-circle"></i> Concept-focused questions</div>
              <div className="feature"><i className="fas fa-check-circle"></i> Detailed progress tracking</div>
            </div>
          </div>

          <button 
            className="start-btn primary-btn"
            onClick={handleLevelQuizStart}
          >
            <i className="fas fa-play-circle"></i>
            Choose Level
          </button>
        </div>

        {/* Test Quiz Option */}
        <div className="assessment-card">
          <div className="card-icon">
            <i className="fas fa-file-alt"></i>
          </div>

          <div className="card-content">
            <h2>Comprehensive Test</h2>
            <p className="card-description">
              Comprehensive tests covering multiple topics. Ideal for final preparation and skill assessment.
            </p>

            <div className="card-features">
              <div className="feature"><i className="fas fa-check-circle"></i> Multiple topics covered</div>
              <div className="feature"><i className="fas fa-check-circle"></i> Timed assessment</div>
              <div className="feature"><i className="fas fa-check-circle"></i> Performance analytics</div>
              <div className="feature"><i className="fas fa-check-circle"></i> Certificate ready</div>
            </div>
          </div>

          <button 
            className="start-btn secondary-btn"
            onClick={handleTestQuizStart}
          >
            <i className="fas fa-clipboard-check"></i>
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizList;