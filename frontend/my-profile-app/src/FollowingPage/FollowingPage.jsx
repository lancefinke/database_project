import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FollowingPage.css';

const FollowingPage = () => {
  const navigate = useNavigate();
  
  // Sample data for followed users
  const followedUsers = [
    { id: 1, name: "John Smith", profileImage: "https://via.placeholder.com/150" },
    { id: 2, name: "Emma Johnson", profileImage: "https://via.placeholder.com/150" },
    { id: 3, name: "Michael Brown", profileImage: "https://via.placeholder.com/150" },
    { id: 4, name: "Sophia Williams", profileImage: "https://via.placeholder.com/150" },
    { id: 5, name: "Alex Rodriguez", profileImage: "https://via.placeholder.com/150" }
  ];

  // Function to handle navigation to user profile
  const handleNavigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="following-container">
      <h1 className="following-title">Following</h1>
      <p className="following-subtitle">These are the users you are following</p>
      
      <div className="following-list-container">
        {followedUsers.map(user => (
          <button 
            key={user.id} 
            className="playlist-button"
            onClick={() => handleNavigateToProfile(user.id)}
          >
            <img
              src={user.profileImage}
              alt={`${user.name}'s profile`}
              className="playlist-image"
            />
            <span className="playlist-name">{user.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FollowingPage;