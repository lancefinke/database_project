import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FollowingPage.css';

const FollowingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Sample data for followed users with additional details
  const followedUsers = [
    { id: 1, name: "John Smith", profileImage: "https://via.placeholder.com/150", followers: 2.4, category: "Artist" },
    { id: 2, name: "Emma Johnson", profileImage: "https://via.placeholder.com/150", followers: 8.7, category: "Friend" },
    { id: 3, name: "Michael Brown", profileImage: "https://via.placeholder.com/150", followers: 1.3, category: "Artist" },
    { id: 4, name: "Sophia Williams", profileImage: "https://via.placeholder.com/150", followers: 4.2, category: "Artist" },
    { id: 5, name: "Alex Rodriguez", profileImage: "https://via.placeholder.com/150", followers: 9.3, category: "Friend" }
  ];

  // Function to handle navigation to user profile
  const handleNavigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // Filter users based on search term and category
  const filteredUsers = followedUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (selectedCategory === 'All' || user.category === selectedCategory)
  );

  // Activity data
  const recentActivity = [
    { id: 1, user: "Emma Johnson", action: "added new music", time: "2 hours ago" },
    { id: 2, user: "Michael Brown", action: "is now following you", time: "Yesterday" },
    { id: 3, user: "John Smith", action: "updated their profile", time: "2 days ago" }
  ];

  return (
    <div className="following-container">
      <div className="following-header">
        <h1 className="following-title">Following</h1>
        {/* Removed following count */}
      </div>
      <p className="following-subtitle">These are the users you are following</p>
      
      {/* Search bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search following..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {/* Category tabs - removed Producers */}
      <div className="category-tabs">
        <button 
          className={`category-tab ${selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('All')}
        >
          All
        </button>
        <button 
          className={`category-tab ${selectedCategory === 'Artist' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('Artist')}
        >
          Artists
        </button>
        <button 
          className={`category-tab ${selectedCategory === 'Friend' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('Friend')}
        >
          Friends
        </button>
      </div>
      
      {/* User stats - removed Tracks */}
      <div className="following-stats">
        <div className="stat-box">
          <span className="stat-number">{followedUsers.length}</span>
          <span className="stat-label">Following</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">241</span>
          <span className="stat-label">Mutual</span>
        </div>
      </div>
      
      {/* Recent activity section */}
      <div className="activity-section">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-text">
                <strong>{activity.user}</strong> {activity.action}
              </div>
              <span className="activity-time">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Following list */}
      <h2 className="section-title">All Following</h2>
      <div className="following-list-container">
        {filteredUsers.map(user => (
          <div key={user.id} className="following-card">
            <button 
              className="following-button"
              onClick={() => handleNavigateToProfile(user.id)}
            >
              <img
                src={user.profileImage}
                alt={`${user.name}'s profile`}
                className="following-image"
              />
              <div className="user-info">
                <span className="following-name">{user.name}</span>
                <span className="user-details">{user.followers}K followers</span>
                <span className="user-category">{user.category}</span>
              </div>
              <div className="play-button">
                <span>▶</span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowingPage;