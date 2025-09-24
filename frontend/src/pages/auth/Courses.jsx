import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/layout/Layout"; // corrected path
import api from "../../api/axios";
import "./Courses.css";


const Courses = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchCourses = async () => {
      try {
        const response = await api.get("/user/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, token]);

  return (
    <Layout>
      <div className="courses-page">
        <h1>Courses Applied</h1>

        {loading && <p>Loading courses...</p>}

        {!loading && courses.length === 0 && <p>No courses applied yet.</p>}

        {!loading && courses.length > 0 && (
          <ul className="courses-list">
            {courses.map((course) => (
              <li key={course._id}>
                <span className="course-title">{course.title}</span>
                <span className={`status ${course.status.toLowerCase()}`}>
                  {course.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Courses;
