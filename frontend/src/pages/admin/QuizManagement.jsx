// src/pages/admin/QuizManagement.jsx
import React, { useEffect, useState } from "react";
import "./QuizManagement.css";

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/quizzes", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setQuizzes(data.quizzes || []));
  }, []);

  const deleteQuiz = async (id) => {
    await fetch(`http://localhost:5000/api/admin/quizzes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setQuizzes(quizzes.filter((q) => q._id !== id));
  };

  return (
    <div className="admin-container">
      <h2>Quiz Management</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Level</th>
            <th>Lesson</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.length > 0 ? (
            quizzes.map((q) => (
              <tr key={q._id}>
                <td>{q.title}</td>
                <td>{q.level}</td>
                <td>{q.lessonTitle || "N/A"}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteQuiz(q._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No quizzes found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuizManagement;
