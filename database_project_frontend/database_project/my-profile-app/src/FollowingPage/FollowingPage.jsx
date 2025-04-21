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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState("None");

  // Listen for follow/unfollow events to trigger refresh
  useEffect(() => {
    const handleFollowEvent = () => {
      setLastRefreshTime(new Date().toLocaleTimeString());
      setRefreshTrigger(prev => prev + 1);
    };
    const handleStorageEvent = (e) => {
      if (e.key === 'followingUpdated' || e.key === null) {
        setLastRefreshTime(new Date().toLocaleTimeString());
        setRefreshTrigger(prev => prev + 1);
      }
    };
    window.addEventListener('followStatusChanged', handleFollowEvent);
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('followStatusChanged', handleFollowEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const statsRes = await fetch(`${API_URL}/api/Follow/GetUserFollowStats?userId=${userId}`);
        if (!statsRes.ok) throw new Error(`Fetch follow stats failed: ${statsRes.status}`);
        const stats = await statsRes.json();
        if (!stats?.FollowingArtists || !Array.isArray(stats.FollowingArtists)) {
          setFollowedUsers([]);
          setLoading(false);
          return;
        }

        // filter out self
        const filtered = stats.FollowingArtists.filter(a => {
          const artistId = a.ArtistID || a.Id;
          const name = (a.ArtistName || '').toLowerCase();
          return !(artistId === userId && name === user.Username.toLowerCase());
        });
        if (filtered.length === 0) {
          setFollowedUsers([]);
          setLoading(false);
          return;
        }

        // fetch all users once
        const usersRes = await fetch(`${API_URL}/api/Users/GetUsers`);
        const allUsers = usersRes.ok ? await usersRes.json() : [];

        const details = await Promise.all(filtered.map(async artist => {
          const artistId = artist.ArtistID || artist.Id;
          const followCount = artist.Followers || artist.FollowingCount || 0;
          
          // Find the user with matching ArtistID, not UserID
          const match = allUsers.find(u => u.ArtistID === artistId);
          
          if (match) {
            return {
              id: artistId,  // Store the ArtistID consistently
              userId: match.UserID, // Store the UserID for reference
              name: match.Username,
              profileImage: match.ProfilePicture || "https://placehold.co/150x150",
              followers: followCount,
              category: "Artist"
            };
          }
          // fallback to stats data
          return {
            id: artistId,  // Store the ArtistID consistently
            name: artist.ArtistName || 'Unknown Artist',
            profileImage: "https://placehold.co/150x150",
            followers: followCount,
            category: "Artist"
          };
        }));

        setFollowedUsers(details);
      } catch (err) {
        console.error(err);
        setFollowedUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedUsers();
    const interval = setInterval(() => {
      if (localStorage.getItem('followingUpdated')) {
        localStorage.removeItem('followingUpdated');
        setLastRefreshTime(new Date().toLocaleTimeString());
        setRefreshTrigger(prev => prev + 1);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [userId, refreshTrigger]);

  const handleNavigateToProfile = (username) => {
    if (user.Username === username) navigate('/profile');
    else navigate(`/profile/${username}`);
  };

  const filteredUsers = followedUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || u.category === selectedCategory)
  );

  return (
    <div className="following-container">
      <div className="following-header">
        <h1 className="following-title">Following</h1>
        
      </div>
      <p className="following-subtitle">These are the users you are following</p>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search following..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="category-tabs">
        {['All', 'Artist'].map(cat => (
          <button
            key={cat}
            className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
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
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <p>Loading your follows...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map(u => (
            <div key={u.id} className="following-card">
              <button
                className="following-button"
                onClick={() => handleNavigateToProfile(u.name)}
              >
                <img
                  src={u.profileImage}
                  alt={`${u.name}'s profile`}
                  className="following-image"
                />
                <div className="user-info">
                  <span className="following-name">{u.name}</span>
                  <span className="user-details">{u.followers} followers</span>
                  <span className="user-category">{u.category}</span>
                </div>
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>You aren't following anyone yet.</p>
            <p>Explore artists and follow them to see them here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingPage;
