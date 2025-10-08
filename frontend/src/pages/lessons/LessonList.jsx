// src/pages/lessons/LessonList.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../utils/tokenHelper";

const LessonList = () => {
  const { difficulty } = useParams(); // "beginner", "intermediate", "advanced"
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:5000/api/lessons", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // filter lessons of selected difficulty
        const filteredLessons = res.data.lessons.filter(
          (lesson) => lesson.difficulty.toLowerCase() === difficulty
        );

        setLessons(filteredLessons);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch lessons");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [difficulty]);

  const handleLevelClick = (levelId) => {
    navigate(`/lessons/detail/${levelId}`);
  };

  if (loading) return <p>Loading lessons...</p>;

  return (
    <div className="lessonlist-container">
      <h2>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Levels</h2>

      {lessons.length === 0 ? (
        <p>No lessons available for this difficulty.</p>
      ) : (
        lessons.map((lesson) => (
          <div key={lesson._id} className="lesson-card" style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h3>{lesson.title}</h3>

            {lesson.levels && lesson.levels.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {lesson.levels.map((level) => (
                  <li key={level._id} style={{ margin: "5px 0" }}>
                    <button
                      onClick={() => handleLevelClick(level._id)}
                      style={{ padding: "8px 12px", cursor: "pointer" }}
                    >
                      {level.title}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No levels added yet.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default LessonList;
