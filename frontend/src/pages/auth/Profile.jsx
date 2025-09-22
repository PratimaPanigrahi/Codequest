import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setOpen(!open);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="profile-container" ref={dropdownRef}>
      <div className="profile-initial" onClick={toggleDropdown}>
        {initial}
      </div>
      {open && (
        <div className="profile-dropdown">
          <div className="profile-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user._id || user.id}</p>
          </div>
          <div className="profile-courses">
            <p><strong>Courses Applied:</strong></p>
            {user.courses && user.courses.length > 0 ? (
              <ul>
                {user.courses.map((course, index) => (
                  <li key={index}>{course}</li>
                ))}
              </ul>
            ) : (
              <p>No courses applied</p>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
