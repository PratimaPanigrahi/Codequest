// src/pages/progress/ProgressDashboard.jsx
import React from "react";
import { useSelector } from "react-redux";
import { FaCoins, FaChartLine, FaFire, FaTrophy, FaBook, FaGamepad } from "react-icons/fa";
import "./ProgressDashboard.css";

// ✅ Import ProgressChart component
import ProgressChart from "../../components/charts/ProgressChart";

const ProgressDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const completedLessons = user?.completedLessons || [];
  const quizScores = user?.quizScores || [];
  const totalXP = user?.totalXP || 0;

  // Level Progress
  const nextLevelXP = 100;
  const currentLevel = Math.floor(totalXP / nextLevelXP) + 1;
  const xpForCurrentLevel = totalXP % nextLevelXP;
  const xpProgressPercent = Math.floor((xpForCurrentLevel / nextLevelXP) * 100);

  // Lessons completed
  const lessonsCompleted = completedLessons.length;

  // Quiz performance
  const totalQuizzes = quizScores.length;
  const averageQuizScore = totalQuizzes > 0 
    ? Math.round(quizScores.reduce((sum, score) => sum + score, 0) / totalQuizzes)
    : 0;

  // Daily streak (combines lessons and quizzes)
  let streak = 0;
  const allActivities = [
    ...completedLessons.map(l => ({ date: l.completedAt, type: 'lesson' })),
    ...quizScores.map(q => ({ date: q.completedAt, type: 'quiz' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (allActivities.length > 0) {
    const today = new Date();
    let currentStreak = 0;
    
    for (let i = 0; i < allActivities.length; i++) {
      const activityDate = new Date(allActivities[i].date);
      const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
      
      if (i === 0 && diffDays <= 1) {
        currentStreak = 1;
      } else if (diffDays === currentStreak) {
        currentStreak++;
      } else {
        break;
      }
    }
    streak = currentStreak;
  }

  // Achievements based on both lessons and quizzes
  const achievements = [];
  if (lessonsCompleted >= 1) achievements.push({ name: "Getting Started", icon: "🚀", color: "#4CAF50" });
  if (lessonsCompleted >= 3) achievements.push({ name: "Quick Learner", icon: "📚", color: "#2196F3" });
  if (totalQuizzes >= 2) achievements.push({ name: "Quiz Explorer", icon: "🎯", color: "#FF9800" });
  if (averageQuizScore >= 70) achievements.push({ name: "Good Scorer", icon: "⭐", color: "#FFD700" });
  if (streak >= 3) achievements.push({ name: "Consistent", icon: "🔥", color: "#FF5722" });

  return (
    <div className="progress-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1>Learning Progress</h1>
        <p>Track your courses and quiz performance</p>
      </div>

      <div className="dashboard-content">
        {/* Top Stats Row */}
        <div className="stats-row">
          <div className="main-stat-card level-card">
            <div className="level-content">
              <div className="level-badge">
                <FaChartLine className="level-icon" />
                <span>Level {currentLevel}</span>
              </div>
              <div className="level-progress">
                <div className="level-bar">
                  <div
                    className="level-fill"
                    style={{ width: `${xpProgressPercent}%` }}
                  ></div>
                </div>
                <p>{xpForCurrentLevel} / {nextLevelXP} XP</p>
              </div>
            </div>
          </div>

          <div className="main-stat-card streak-card">
            <div className="streak-content">
              <FaFire className="streak-icon" />
              <div className="streak-info">
                <h3>{streak}</h3>
                <p>Day Streak</p>
              </div>
            </div>
            <div className="streak-calendar">
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                <div
                  key={day}
                  className={`streak-day ${day <= streak ? 'active' : ''}`}
                >
                  <span>{['S', 'M', 'T', 'W', 'T', 'F', 'S'][day-1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon lessons">
              <FaBook />
            </div>
            <div className="metric-info">
              <h3>{lessonsCompleted}</h3>
              <p>Lessons</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon quizzes">
              <FaGamepad />
            </div>
            <div className="metric-info">
              <h3>{totalQuizzes}</h3>
              <p>Quizzes</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon xp">
              <FaCoins />
            </div>
            <div className="metric-info">
              <h3>{totalXP}</h3>
              <p>Total XP</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon score">
              <FaTrophy />
            </div>
            <div className="metric-info">
              <h3>{averageQuizScore}%</h3>
              <p>Avg Score</p>
            </div>
          </div>
        </div>

        {/* Charts and Achievements Row */}
        <div className="content-row">
          {/* Progress Chart */}
          <div className="chart-section">
            <div className="section-header">
              <h3>Weekly Progress</h3>
            </div>
            <div className="chart-container">
              <ProgressChart completedLessons={completedLessons} quizScores={quizScores} />
            </div>
          </div>

          {/* Achievements */}
          <div className="achievements-section">
            <div className="section-header">
              <h3>Achievements</h3>
              <span>{achievements.length}/5</span>
            </div>
            <div className="achievements-grid">
              {achievements.length > 0 ? (
                achievements.map((achievement, index) => (
                  <div key={index} className="achievement-card" style={{ borderLeftColor: achievement.color }}>
                    <div className="achievement-icon" style={{ color: achievement.color }}>
                      {achievement.icon}
                    </div>
                    <div className="achievement-info">
                      <h4>{achievement.name}</h4>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-achievements">
                  <FaTrophy className="no-achievements-icon" />
                  <p>Start learning to earn achievements!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;