// src/pages/progress/ProgressDashboard.jsx
import React, { useEffect, useState } from "react";
import { FaCoins, FaClock, FaChartLine, FaFire } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from "recharts";
import api from "../../api/axios.js";
import "./ProgressDashboard.css";

const ProgressDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await api.get("/progress/me");
        const progress = data.progress;

        const lessonHistory = progress.lessons
          .filter(l => l.completed)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        let streak = 0;
        for (let i = lessonHistory.length - 1; i >= 0; i--) {
          const day = new Date(lessonHistory[i].createdAt).toDateString();
          const prevDay = streak > 0 ? new Date(lessonHistory[i + 1]?.createdAt).toDateString() : null;
          if (!prevDay || day === prevDay) streak++;
          else break;
        }

        const dailyPointsHistory = lessonHistory.map(h => ({
          date: h.createdAt,
          lessons: 1,
          points: 5
        }));

        const totalPoints = progress.points || dailyPointsHistory.reduce((acc, d) => acc + d.points, 0);
        const totalLevelsCompleted = Math.floor(totalPoints / 100);

        setStats({
          totalPoints,
          totalLevelsCompleted,
          dailyTime: progress.lessons.reduce((acc, l) => acc + (l.timeSpent || 0), 0) / 60,
          streak,
          lessonsCompleted: progress.lessons.filter(l => l.completed).length,
          quizzesCompleted: progress.quizzes.filter(q => q.completed).length,
          quizHistory: progress.quizzes || [],
          dailyPointsHistory,
          achievements: progress.achievements || [],
          strugglingTopics: progress.strugglingTopics || []
        });

        setActivityData(
          lessonHistory.map(h => ({
            day: new Date(h.createdAt).toLocaleDateString("en-US", { weekday: "short" }),
            time: h.timeSpent || 0,
          }))
        );

        setQuizData(
          (progress.quizzes || []).map(q => ({
            quiz: q.quiz.name || "Quiz",
            score: q.score || 0,
          }))
        );

      } catch (err) {
        console.error("Error fetching progress:", err);
        setError(err.message || "Failed to fetch progress");
      }
    };

    fetchProgress();
  }, []);

  if (error) return <div className="dashboard-wrapper"><p className="error">{error}</p></div>;
  if (!stats) return <div className="dashboard-wrapper"><p>Loading...</p></div>;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-content">
        
        {/* 🔥 Streak Section */}
        <div className="streak-section">
          <div className="streak-icon">🔥</div>
          <h2 className="streak-title">Day Streak</h2>
          <p className="streak-subtext">Practice each day so your streak won't reset!</p>
          <div className="streak-days">
            {["Mo","Tu","We","Th","Fr","Sa","Su"].map((day, idx) => (
              <div key={idx} className={`day-circle ${idx < stats.streak ? "active" : ""}`}>
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* 📊 Lesson Progress */}
        <div className="lesson-progress">
          <div className="lesson-header">
            <h3>Well done! 🎉</h3>
            <p>You completed {stats.lessonsCompleted} lessons</p>
          </div>
          <div className="progress-track">
            <span style={{fontSize: '11px'}}>{Math.floor((stats.lessonsCompleted / (stats.lessonsCompleted + 10)) * 100)}%</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${Math.floor((stats.lessonsCompleted / (stats.lessonsCompleted + 10)) * 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card"><FaCoins className="stat-icon gold" /><h3>{stats.totalPoints}</h3><p>Points</p></div>
          <div className="stat-card"><FaChartLine className="stat-icon green" /><h3>{stats.totalLevelsCompleted}</h3><p>Levels</p></div>
          <div className="stat-card"><FaClock className="stat-icon blue" /><h3>{Math.floor(stats.dailyTime)} min</h3><p>Learning Time</p></div>
          <div className="stat-card"><FaFire className="stat-icon red" /><h3>{stats.streak}</h3><p>Streak</p></div>
        </div>

        {/* Charts - Made much smaller */}
        <div className="charts-grid">
          <div className="chart-card">
            <h4>Weekly Activity</h4>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={activityData}>
                <XAxis dataKey="day" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="time" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4>Quiz Performance</h4>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={quizData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quiz" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="score" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Achievements */}
        <div className="achievements">
          <h4>🏆 Achievements</h4>
          <div className="achievement-cards">
            {stats.achievements.length > 0 ? stats.achievements.map((ach, idx) => (
              <div key={idx} className="achievement-card">{ach.name}</div>
            )) : <p className="text-muted">No achievements yet</p>}
          </div>
        </div>

        {/* Struggling Topics */}
        <div className="struggling-topics">
          <h4>⚠️ Struggling Topics</h4>
          {stats.strugglingTopics.length > 0 ? (
            <ul>
              {stats.strugglingTopics.map((topic, idx) => (
                <li key={idx}>{topic.topic} ({topic.attempts} attempts)</li>
              ))}
            </ul>
          ) : <p className="text-muted">No struggling topics</p>}
        </div>

      </div>
    </div>
  );
};

export default ProgressDashboard;