// src/components/layout/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, updateUserCourse } from "../../store/authSlice";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth) || {};

  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const courseRef = useRef();
  const profileRef = useRef();

  const courses = ["Python", "Fullstack", "C++", "Java"];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (courseRef.current && !courseRef.current.contains(e.target)) {
        setShowCourseDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCourse = (course) => {
    if (!user) return;
    const today = new Date().toLocaleDateString();
    dispatch(updateUserCourse({ course, date: today }));
    alert(`You enrolled in ${course}`);
    setShowCourseDropdown(false);
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left" onClick={() => navigate("/userhome")}>
        CodeQuest
      </div>

      {/* Navigation */}
      <div className="navbar-middle">
        <button className="nav-link" onClick={() => navigate("/userhome")}>
          Home
        </button>

        {/* Courses Dropdown */}
        <div className="nav-link" ref={courseRef}>
          <button
            className="profile-like-btn"
            onClick={() => setShowCourseDropdown((prev) => !prev)}
          >
            Courses
          </button>
          {showCourseDropdown && (
            <div className="profile-dropdown">
              <div className="profile-actions">
                {courses.map((course, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectCourse(course)}
                  >
                    {course}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button className="nav-link" onClick={() => navigate("/quizzes")}>
          Quiz
        </button>
        <button className="nav-link" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
      </div>

      {/* Profile Dropdown */}
      <div className="navbar-right" ref={profileRef}>
        <button
          className="profile-btn"
          onClick={() => setShowProfileDropdown((prev) => !prev)}
        >
          {userInitial}
        </button>
        {showProfileDropdown && (
          <div className="profile-dropdown">
            <div className="profile-info">
              <strong>{user?.name || "User"}</strong>
              <p>{user?.email || "No email"}</p>
            </div>
            <div className="profile-actions">
              <button
                onClick={() => {
                  navigate("/profile");
                  setShowProfileDropdown(false);
                }}
              >
                Profile
              </button>
              <div>
                <strong>Courses Applied:</strong>
                {user?.selectedCourses?.length
                  ? user.selectedCourses.map((c, idx) => (
                      <div key={idx}>
                        {c.course} ({c.date})
                      </div>
                    ))
                  : "None"}
              </div>
              <button
                onClick={() => {
                  dispatch(logoutUser());
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
