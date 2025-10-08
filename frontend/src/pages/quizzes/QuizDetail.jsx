// src/pages/QuizDetail.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./QuizDetail.css";

const QuizDetail = () => {
  const [quiz, setQuiz] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showStart, setShowStart] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const lessonSummary = `High-level, interpreted, dynamically typed, easy-to-read language.
Created by Guido van Rossum in 1989; named after Monty Python.
Readability, cross-platform, batteries included, large community.
Web development, data science, AI/ML.
Emphasis on readability and simplicity.
Rich set of built-in modules for common tasks.
Install Python, choose IDE (VS Code/PyCharm).
print("Hello, Python Learner!"); basics of variables and comments.
Reinforce key concepts and applications.`;

  // Timer effect
  useEffect(() => {
    if (!showStart && !showResult && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, showStart, showResult, quizCompleted]);

  // Fetch dynamic quiz from backend
  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://localhost:5000/api/quiz/generate", {
        content: lessonSummary,
        numQuestions: 5,
      });
      setQuiz(res.data);
      setCurrent(0);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setShowStart(false);
      setShowResult(false);
      setSelectedOption(null);
      setTimeLeft(30);
      setQuizCompleted(false);
    } catch (err) {
      console.error(err);
      setError("Failed to generate quiz. Try again.");
    }
    setLoading(false);
  };

  const handleAnswer = (option, index) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(index);
    const isCorrect = option === quiz[current].answer;
    
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (current + 1 < quiz.length) {
        setCurrent(current + 1);
        setSelectedOption(null);
        setTimeLeft(30);
      } else {
        setQuizCompleted(true);
        setShowResult(true);
      }
    }, 1500);
  };

  const handleTimeUp = () => {
    setSelectedOption(-1);
    setStreak(0);
    
    setTimeout(() => {
      if (current + 1 < quiz.length) {
        setCurrent(current + 1);
        setSelectedOption(null);
        setTimeLeft(30);
      } else {
        setQuizCompleted(true);
        setShowResult(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setShowStart(true);
    setQuiz([]);
  };

  const getOptionClass = (index) => {
    if (selectedOption === null) return "option";
    if (index === selectedOption) {
      return quiz[current].options[index] === quiz[current].answer 
        ? "option correct" 
        : "option wrong";
    }
    if (quiz[current].options[index] === quiz[current].answer) {
      return "option correct";
    }
    return "option disabled";
  };

  const getScoreMessage = () => {
    const percentage = (score / quiz.length) * 100;
    if (percentage >= 90) return { message: "PYTHON MASTER!", color: "#ffd700" };
    if (percentage >= 80) return { message: "EXCELLENT!", color: "#9b59b6" };
    if (percentage >= 70) return { message: "GREAT JOB!", color: "#27ae60" };
    if (percentage >= 60) return { message: "WELL DONE!", color: "#3498db" };
    if (percentage >= 50) return { message: "GOOD EFFORT!", color: "#f39c12" };
    return { message: "KEEP LEARNING!", color: "#e74c3c" };
  };

  // Start Screen
  if (showStart) {
    return (
      <div className="quiz-container">
        <div className="start-screen">
          <div className="header">
            <h1>Python Quiz</h1>
            <p>Test your Python knowledge</p>
          </div>

          <div className="content">
            <div className="rules">
              <h3>Rules:</h3>
              <ul>
                <li>5 questions total</li>
                <li>30 seconds per question</li>
                <li>Select the correct answer</li>
                <li>See your score at the end</li>
              </ul>
            </div>

            {error && <div className="error">{error}</div>}
            
            <button 
              className="start-btn" 
              onClick={fetchQuiz}
              disabled={loading}
            >
              {loading ? "Loading..." : "Start Quiz"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResult) {
    const scoreInfo = getScoreMessage();
    return (
      <div className="quiz-container">
        <div className="results-screen">
          <div className="header">
            <h1>Quiz Completed</h1>
          </div>

          <div className="content">
            <div className="score-section">
              <div className="score">
                {score}<span> / {quiz.length}</span>
              </div>
              <div className="percentage">
                {Math.round((score / quiz.length) * 100)}%
              </div>
              <div className="message" style={{ color: scoreInfo.color }}>
                {scoreInfo.message}
              </div>
            </div>

            <div className="stats">
              <div className="stat">
                <div>Max Streak</div>
                <div>{maxStreak}</div>
              </div>
              <div className="stat">
                <div>Correct</div>
                <div>{score}</div>
              </div>
            </div>

            <div className="actions">
              <button className="btn" onClick={restartQuiz}>
                Play Again
              </button>
              <button className="btn" onClick={fetchQuiz}>
                New Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  return (
    <div className="quiz-container">
      <div className="quiz-screen">
        {/* Header */}
        <div className="header-bar">
          <div className="progress">
            Question {current + 1} of {quiz.length}
          </div>
          <div className="timer">
            Time: {timeLeft}s
          </div>
          <div className="score">
            Score: {score}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div 
            className="progress-bar"
            style={{ width: `${((current + 1) / quiz.length) * 100}%` }}
          ></div>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="streak">
            Streak: {streak}
          </div>
        )}

        {/* Main Content */}
        <div className="quiz-content">
          <div className="question">
            <h2>{quiz[current].question}</h2>
          </div>

          <div className="options">
            {quiz[current].options.map((option, index) => (
              <button
                key={index}
                className={getOptionClass(index)}
                onClick={() => handleAnswer(option, index)}
                disabled={selectedOption !== null}
              >
                <span className="option-text">{option}</span>
                {selectedOption !== null && (
                  <>
                    {quiz[current].options[index] === quiz[current].answer && (
                      <span className="icon">✓</span>
                    )}
                    {index === selectedOption && quiz[current].options[index] !== quiz[current].answer && (
                      <span className="icon">✗</span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {selectedOption !== null && (
            <div className="feedback">
              {quiz[current].options[selectedOption] === quiz[current].answer ? (
                <div className="correct">Correct! Well done!</div>
              ) : selectedOption === -1 ? (
                <div className="timeup">Time's up!</div>
              ) : (
                <div className="incorrect">Incorrect!</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;