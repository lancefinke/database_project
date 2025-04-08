import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    topSong: null,
    averageRating: 0,
    isReported: false,
    reportedSongs: [],
    allSongs: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    // Simulate API fetch with mock data
    const fetchDashboardData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for testing until your API is ready
        const mockData = {
          topSong: {
            title: "Example Song",
            artist: "Example Artist"
          },
          averageRating: 4.2,
          isReported: false,
          reportedSongs: [
            { 
              id: 1, 
              title: "Controversial Song", 
              reportReason: "Inappropriate content", 
              reportDate: "2025-03-15",
              status: 1 // 1 for flagged
            },
            { 
              id: 2, 
              title: "Copyright Issue", 
              reportReason: "Copyright violation", 
              reportDate: "2025-04-02", 
              status: 3 // 3 for removed
            },
            { 
              id: 3, 
              title: "Offensive Lyrics", 
              reportReason: "Hate speech", 
              reportDate: "2025-04-05", 
              status: 1 // 1 for flagged
            }
          ],
          allSongs: [
            {
              id: 101,
              title: "Summer Vibes",
              plays: 142,
              rating: 4.7,
              releaseDate: "2024-06-15"
            },
            {
              id: 102,
              title: "Midnight Drive",
              plays: 98,
              rating: 4.3,
              releaseDate: "2024-08-22"
            },
            {
              id: 103,
              title: "Lost in Thought",
              plays: 65,
              rating: 3.9,
              releaseDate: "2024-10-05"
            },
            {
              id: 104,
              title: "New Beginnings",
              plays: 112,
              rating: 4.5,
              releaseDate: "2025-01-10"
            },
            {
              id: 105,
              title: "Rainy Day",
              plays: 78,
              rating: 4.1,
              releaseDate: "2025-02-28"
            }
          ]
        };
        
        setDashboardData({
          ...mockData,
          loading: false,
          error: null
        });
        
        /* Uncomment this when your API is ready
        const token = localStorage.getItem('userToken');
        
        const response = await axios.get('/api/user/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setDashboardData({
          topSong: response.data.topSong,
          averageRating: response.data.averageRating,
          isReported: response.data.isReported,
          reportedSongs: response.data.reportedSongs || [],
          allSongs: response.data.allSongs || [],
          loading: false,
          error: null
        });
        */
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load dashboard data. Please try again later.'
        }));
      }
    };

    fetchDashboardData();
  }, []);

  // Function to render status badges
  const renderStatusBadge = (status) => {
    if (status === 1) {
      return <span className="status-badge flagged">Flagged</span>;
    } else if (status === 3) {
      return <span className="status-badge removed">Removed</span>;
    }
    return <span className="status-badge unknown">Unknown</span>;
  };

  if (dashboardData.loading) {
    return <div className="dashboard-loading">Loading dashboard data...</div>;
  }

  if (dashboardData.error) {
    return <div className="dashboard-error">{dashboardData.error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Your Music Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>Highest Rated Song</h2>
          {dashboardData.topSong ? (
            <div className="top-song">
              <div className="song-title">{dashboardData.topSong.title}</div>
              <div className="song-artist">{dashboardData.topSong.artist}</div>
            </div>
          ) : (
            <p>No rated songs yet</p>
          )}
        </div>
        
        <div className="stat-card">
          <h2>Average Rating</h2>
          <div className="average-rating">
            <span className="rating-value">{dashboardData.averageRating.toFixed(1)}</span>
            <span className="rating-max">/5.0</span>
          </div>
        </div>
        
        <div className="stat-card">
          <h2>Account Status</h2>
          <div className={`account-status ${dashboardData.isReported ? 'reported' : 'good'}`}>
            {dashboardData.isReported ? 'Reported' : 'Good Standing'}
          </div>
        </div>
      </div>

      {/* All Songs Section */}
      <div className="songs-section">
        <h2 className="section-title">Your Songs Performance</h2>
        {dashboardData.allSongs && dashboardData.allSongs.length > 0 ? (
          <div className="songs-list">
            <div className="song-header">
              <span className="song-title-header">Song Title</span>
              <span className="song-rating-header">Rating</span>
              <span className="song-date-header">Release Date</span>
            </div>
            {dashboardData.allSongs.map(song => (
              <div key={song.id} className="song-item">
                <span className="song-title-value">{song.title}</span>
                <span className="song-rating-value">
                  <span className="rating-stars">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className={`star ${index < Math.floor(song.rating) ? 'filled' : index < song.rating ? 'half-filled' : ''}`}>★</span>
                    ))}
                  </span>
                  <span className="rating-number">{song.rating.toFixed(1)}</span>
                </span>
                <span className="song-date-value">{song.releaseDate}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-songs">You haven't uploaded any songs yet.</p>
        )}
      </div>

      {/* Reported Songs Section */}
      <div className="reported-songs-section">
        <h2 className="section-title">Reported Songs</h2>
        {dashboardData.reportedSongs && dashboardData.reportedSongs.length > 0 ? (
          <div className="reported-songs-list">
            <div className="reported-song-header">
              <span className="song-title-header">Song Title</span>
              <span className="report-reason-header">Reason</span>
              <span className="report-date-header">Date Reported</span>
              <span className="report-status-header">Status</span>
            </div>
            {dashboardData.reportedSongs.map(song => (
              <div key={song.id} className="reported-song-item">
                <span className="reported-song-title">{song.title}</span>
                <span className="reported-song-reason">{song.reportReason}</span>
                <span className="reported-song-date">{song.reportDate}</span>
                <span className="reported-song-status">
                  {renderStatusBadge(song.status)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reports">No songs have been reported. Keep up the good work!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;