// src/pages/auth/Profile.jsx
import React from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/layout/Layout";
import "./Profile.css";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Layout><p>Loading profile...</p></Layout>;

  return (
    <Layout>
      <div className="profile-page">
        <h1>My Profile</h1>
        <div className="profile-info-card">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <h2>{user.name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Contact Number:</strong> {user.contact || "Not provided"}</p>
            <p><strong>Login Date:</strong> {user.loginDate || "Not available"}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
