import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../LoginContext/UserContext';
import './FollowingPage.css';

const FollowingPage = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const userId = user?.UserID;
  const API_URL = "http://localhost:5142";

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [followedUsers, setFollowedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/Follow/GetUserFollowStats?userId=${userId}`);
        const data = await response.json();

        console.log("👥 Fetched user follow stats:", data);

        const artistDetails = await Promise.all(
          data.FollowingArtists.map(async (artist) => {
            try {
              const userRes = await fetch(`${API_URL}/api/Users/GetUserByName?name=${encodeURIComponent(artist.ArtistName)}`);
              const userData = await userRes.json();

              console.log(`🎨 User data for ${artist.ArtistName}:`, userData);

              return {
                id: userData.UserID,
                name: userData.Username,
                profileImage: userData.ProfilePicture || "https://via.placeholder.com/150",
                followers: artist.Followers || 0,
                category: "Artist"
              };
            } catch (err) {
              console.error(`❌ Failed to fetch info for ${artist.ArtistName}:`, err);
              return null;
            }
          })
        );

        setFollowedUsers(artistDetails.filter(Boolean));
      } catch (err) {
        console.error("❌ Failed to load followed users:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFollowedUsers();
    }
  }, [userId]);

  const handleNavigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const filteredUsers = followedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || user.category === selectedCategory)
  );

  return (
    <div className="following-container">
      <div className="following-header">
        <h1 className="following-title">Following</h1>
      </div>
      <p className="following-subtitle">These are the users you are following</p>
      {/* SEARCH BOX MIGHT READD LATER */}
      {/* <div className="search-container">
        <input
          type="text"
          placeholder="Search following..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div> */}

      <div className="category-tabs">
        <button className={`category-tab ${selectedCategory === 'All' ? 'active' : ''}`} onClick={() => setSelectedCategory('All')}>
          All
        </button>
        <button className={`category-tab ${selectedCategory === 'Artist' ? 'active' : ''}`} onClick={() => setSelectedCategory('Artist')}>
          Artists
        </button>
      </div>

      <div className="following-stats">
        <div className="stat-box">
          <span className="stat-number">{followedUsers.length}</span>
          <span className="stat-label">Following</span>
        </div>
      </div>

      <h2 className="section-title">All Following</h2>
      <div className="following-list-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className="following-card">
              <button className="following-button" onClick={() => handleNavigateToProfile(user.id)}>
                <img
                  src={user.profileImage}
                  alt={`${user.name}'s profile`}
                  className="following-image"
                />
                <div className="user-info">
                  <span className="following-name">{user.name}</span>
                  <span className="user-details">{user.followers} followers</span>
                  <span className="user-category">{user.category}</span>
                </div>
                {/* Play button removed from here */}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FollowingPage;