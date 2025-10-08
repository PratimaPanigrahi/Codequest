import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import "./LessonManagement.css";

const LessonManagement = () => {
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({ title: "", difficulty: "easy" });
  const [newLevel, setNewLevel] = useState({ lessonId: "", number: "", title: "", content: "" });

  // Fetch all lessons
  const fetchLessons = async () => {
    try {
      const res = await api.get("/lessons");
      setLessons(res.data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // Add new lesson
  const handleAddLesson = async () => {
    if (!newLesson.title) return alert("Enter lesson title");
    try {
      await api.post("/lessons/add-lesson", newLesson);
      setNewLesson({ title: "", difficulty: "easy" });
      fetchLessons();
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  // Add new level
  const handleAddLevel = async () => {
    const { lessonId, number, title } = newLevel;
    if (!lessonId || !number || !title) return alert("Enter all level details");
    try {
      await api.post("/lessons/add-level", newLevel);
      setNewLevel({ lessonId: "", number: "", title: "", content: "" });
      fetchLessons();
    } catch (error) {
      console.error("Error adding level:", error);
    }
  };

  // Delete lesson
  const handleDeleteLesson = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await api.delete(`/lessons/delete-lesson/${id}`);
      fetchLessons();
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  };

  // Delete level
  const handleDeleteLevel = async (lessonId, levelNumber) => {
    if (!window.confirm("Are you sure you want to delete this level?")) return;
    try {
      await api.delete(`/lessons/delete-level/${lessonId}/${levelNumber}`);
      fetchLessons();
    } catch (error) {
      console.error("Error deleting level:", error);
    }
  };

  return (
    <div className="lesson-management">
      <h2>Lesson Management</h2>

      {/* Add Lesson */}
      <div className="add-lesson">
        <h3>Add New Lesson</h3>
        <input
          type="text"
          placeholder="Lesson Title"
          value={newLesson.title}
          onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
        />
        <select
          value={newLesson.difficulty}
          onChange={(e) => setNewLesson({ ...newLesson, difficulty: e.target.value })}
        >
          <option value="easy">Easy</option>
          <option value="intermediate">Intermediate</option>
          <option value="hard">Hard</option>
        </select>
        <button onClick={handleAddLesson}>Add Lesson</button>
      </div>

      {/* Add Level */}
      <div className="add-level">
        <h3>Add Level</h3>
        <select
          value={newLevel.lessonId}
          onChange={(e) => setNewLevel({ ...newLevel, lessonId: e.target.value })}
        >
          <option value="">Select Lesson</option>
          {lessons.map((l) => (
            <option key={l._id} value={l._id}>
              {l.title} ({l.difficulty})
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Level Number"
          value={newLevel.number}
          onChange={(e) => setNewLevel({ ...newLevel, number: e.target.value })}
        />
        <input
          type="text"
          placeholder="Level Title"
          value={newLevel.title}
          onChange={(e) => setNewLevel({ ...newLevel, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Level Content (optional)"
          value={newLevel.content}
          onChange={(e) => setNewLevel({ ...newLevel, content: e.target.value })}
        />
        <button onClick={handleAddLevel}>Add Level</button>
      </div>

      {/* Lessons List */}
      <div className="lessons-list">
        {lessons.map((lesson) => (
          <div key={lesson._id} className="lesson-card">
            <div className="lesson-header">
              <h4>
                {lesson.title} ({lesson.difficulty})
              </h4>
              <button className="delete-btn" onClick={() => handleDeleteLesson(lesson._id)}>
                Delete Lesson
              </button>
            </div>
            <ul>
              {lesson.levels.map((level) => (
                <li key={level.number}>
                  <strong>Level {level.number}:</strong> {level.title}{" "}
                  <button
                    className="delete-btn-small"
                    onClick={() => handleDeleteLevel(lesson._id, level.number)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonManagement;
