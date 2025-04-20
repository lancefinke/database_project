import React, { useState, useEffect } from 'react';
import { useUserContext } from "../../LoginContext/UserContext"; 
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    topSong: null,
    averageRating: 0,
    isReported: false,
    totalListeners: 0,
    reportedSongs: [],
    allSongs: [],
    loading: true,
    error: null
  });
   const { user } = useUserContext(); // get user info
    const artistID = user?.ArtistID;
    const API_URL = "https://localhost:7152";
    useEffect(() => {
      const fetchDashboardData = async () => {
        console.log("Starting fetch for dashboard data...");
        console.log("Artist ID from context:", artistID);
  
        if (!artistID) {
          console.warn("ArtistID is not defined.");
          setDashboardData(prev => ({
            ...prev,
            loading: false,
            error: "Artist ID not available."
          }));
          return;
        }
  
        try {
          const response = await fetch(`${API_URL}/api/Dashboard/GetArtistOverview?artistId=${artistID}`, {
            method: "GET",
            headers: {
              'Accept': 'application/json'
            },
            mode: 'cors'
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error ${response.status}: ${errorText}`);
          }
  
          const result = await response.json();
          console.log("Fetched artist overview result:", result);
  
          setDashboardData(prev => ({
            ...prev,
            averageRating: result.AverageRating || 0,
            totalListeners: result.TotalListens || 0,
            isReported: result.TotalStrikes > 0,
            loading: false,
            error: null
          }));
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          setDashboardData(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to load dashboard data. Please try again later.'
          }));
        }
      };
  
      fetchDashboardData();
    }, [artistID]);
    
  
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
          <h2>Top Listened Song</h2>
          {dashboardData.topSong ? (
            <div className="top-song">
              <div className="song-title">{dashboardData.topSong.title}</div>
              <div className="song-artist">{dashboardData.topSong.artist}</div>
              <div className="song-plays">{dashboardData.topSong.plays} plays</div>
            </div>
          ) : (
            <p>No songs played yet</p>
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
        
        <div className="stat-card">
          <h2>Total Listeners</h2>
          <div className="total-listeners">
            <span className="listener-count">{dashboardData.totalListeners}</span>
            <span className="listener-label">listeners</span>
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
              <span className="song-plays-header">Listens</span>
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
                <span className="song-plays-value">{song.plays}</span>
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
            </div>
            {dashboardData.reportedSongs.map(song => (
              <div key={song.id} className="reported-song-item">
                <span className="reported-song-title">{song.title}</span>
                <span className="reported-song-reason">{song.reportReason}</span>
                <span className="reported-song-date">{song.reportDate}</span>
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