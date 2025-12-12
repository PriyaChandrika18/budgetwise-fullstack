import React from "react";
import "./Profile.css";

const Profile = () => {
  const user = {
    fullName: "Priya Chandrika",
    email: "priyachandrika22@gmail.com",
    loginDate: "11/14/2025",
    avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png", // You can change this image
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src={user.avatar} alt="Profile Avatar" className="profile-avatar" />
          <div>
            <h2>Welcome, {user.fullName.split(" ")[0]} 👋</h2>
            <p className="subtitle">Here’s your personal account overview.</p>
          </div>
        </div>

        <div className="profile-info">
          <h3>Profile Information</h3>
          <div className="info-row">
            <span>Full Name:</span>
            <span>{user.fullName}</span>
          </div>
          <div className="info-row">
            <span>Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="info-row">
            <span>Login Date:</span>
            <span>{user.loginDate}</span>
          </div>
        </div>

        <div className="profile-footer">
          <button className="edit-btn">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
