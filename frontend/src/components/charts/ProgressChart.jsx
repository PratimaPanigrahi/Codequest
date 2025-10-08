// src/components/charts/ProgressChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ProgressChart = ({ completedLessons = [] }) => {
  // ✅ Build safe chart data
  const activityData = completedLessons.map((lesson) => {
    const date = lesson?.completedAt
      ? new Date(lesson.completedAt)
      : new Date();

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      xp: lesson?.xp || 0,
    };
  });

  // ✅ Prevent crash when no lessons
  if (activityData.length === 0) {
    return <p className="text-muted">No activity yet 📉</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={activityData}>
        <XAxis dataKey="day" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Line type="monotone" dataKey="xp" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
