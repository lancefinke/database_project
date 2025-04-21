import React, { useState, useEffect } from 'react';
import { useUserContext } from "../../LoginContext/UserContext"; 
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    topSong: null,
    AverageRating: 0,
    isReported: false,
    TotalListens: 0,
    reportedSongs: [],
    allSongs: [],
    loading: true,
    error: null
  });

  const { user } = useUserContext(); 
  const artistID = user?.ArtistID;
  const API_URL = "http://localhost:5142";

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log("👤 User from context:", user);
      console.log("🎨 Artist ID:", artistID);

      if (!artistID || artistID === 0) {
        console.warn("⚠️ ArtistID is missing or 0. Skipping fetch.");
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: "Artist ID not available."
        }));
        return;
      }

      try {
        const [overviewRes, songPerfRes, reportedRes] = await Promise.all([
          fetch(`${API_URL}/api/Dashboard/GetArtistOverview?artistId=${artistID}`),
          fetch(`${API_URL}/api/Dashboard/GetSongPerformance?artistId=${artistID}`),
          fetch(`${API_URL}/api/Dashboard/GetReportedSongsByArtist?artistId=${artistID}`)
        ]);

        if (!overviewRes.ok || !songPerfRes.ok || !reportedRes.ok) 
          throw new Error("One or more API calls failed");

        const overview = await overviewRes.json();
        const songs = await songPerfRes.json();
        const reports = await reportedRes.json();
        
        // Calculate total listens
        const totalListens = songs.reduce((total, song) => total + song.Listens, 0);
        
        const mappedSongs = songs.map(song => ({
          SongID: song.SongID,
          Title: song.Title,
          Rating: song.Rating,
          plays: song.Listens,
          releaseDate: new Date(song.ReleaseDate).toLocaleDateString()
        }));
        
        // Sort songs by plays for top songs
        const sortedSongs = [...mappedSongs].sort((a, b) => b.plays - a.plays);
        
        // Map reports with a unique composite ID
        const mappedReports = reports.map((report, index) => ({
          id: `report-${report.SongID}-${index}`, // Create composite unique ID
          SongID: report.SongID,
          Title: report.Title,
          Reason: report.Reason,
          ReportDate: new Date(report.ReportDate).toLocaleDateString(),
          ReportStatus: report.ReportStatus
        }));

        setDashboardData(prev => ({
          ...prev,
          AverageRating: overview.AverageRating || 0,
          TotalListens: totalListens || overview.TotalListens || 0,
          isReported: overview.TotalStrikes > 0,
          allSongs: sortedSongs, // Use sorted songs
          reportedSongs: mappedReports,
          topSong: sortedSongs.length > 0 ? {
            Title: sortedSongs[0].Title,
            artist: user?.Username || "You",
            plays: sortedSongs[0].plays
          } : null,
          loading: false,
          error: null
        }));

      } catch (err) {
        console.error(" Error fetching dashboard data:", err);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: "Failed to load dashboard data."
        }));
      }
    };

    fetchDashboardData();
  }, [artistID, user]);
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 1: return "Pending";
      case 2: return "Dismissed";
      case 3: return "Banned";
      default: return "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1: return "status-badge pending";
      case 2: return "status-badge dismissed";
      case 3: return "status-badge banned";
      default: return "status-badge";
    }
  };

  if (dashboardData.loading) {
    return <div className="dashboard-loading">Loading dashboard data...</div>;
  }

  if (dashboardData.error) {
    return <div className="dashboard-error">{dashboardData.error}</div>;
  }

  // Calculate average listens per song (only once)
  const avgListensPerSong = dashboardData.allSongs.length > 0
    ? Math.round(dashboardData.TotalListens / dashboardData.allSongs.length)
    : 0;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Your Music Dashboard</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>Top Listened Song</h2>
          {dashboardData.topSong ? (
            <div className="top-song">
              <div className="song-title">{dashboardData.topSong.Title}</div>
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
            <span className="rating-value">{dashboardData.AverageRating.toFixed(1)}</span>
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
          <h2>Total Listens</h2>
          <div className="total-listeners">
            <span className="listener-count">{dashboardData.TotalListens}</span>
            <span className="listener-label">listens</span>
          </div>
        </div>
      </div>

      {/* Streamlined analytics section */}
      <div className="listens-section">
        <h2 className="section-title">Listening Analytics</h2>
        <div className="analytics-grid">
          {dashboardData.allSongs.length > 0 && (
            <div className="analytics-card">
              <h3>Average Listens</h3>
              <div className="analytics-value">{avgListensPerSong}</div>
              <div className="analytics-label">per song</div>
            </div>
          )}
          
          {dashboardData.allSongs.length >= 2 && (
            <div className="analytics-card">
              <h3>Song Count</h3>
              <div className="analytics-value">{dashboardData.allSongs.length}</div>
              <div className="analytics-label">total songs published</div>
            </div>
          )}
          
          {dashboardData.topSong && (
            <div className="analytics-card">
              <h3>Most Popular</h3>
              <div className="analytics-value">{dashboardData.topSong.plays}</div>
              <div className="analytics-label">plays for {dashboardData.topSong.Title}</div>
            </div>
          )}
        </div>
      </div>

      <div className="songs-section">
        <h2 className="section-title">Your Songs Performance</h2>
        {dashboardData.allSongs.length > 0 ? (
          <div className="songs-list">
            <div className="song-header">
              <span className="song-title-header">Song Title</span>
              <span className="song-rating-header">Rating</span>
              <span className="song-plays-header">Listens</span>
              <span className="song-date-header">Release Date</span>
            </div>
            {dashboardData.allSongs.map((song, index) => (
              <div key={`song-${song.SongID || index}`} className="song-item">
                <span className="song-title-value">{song.Title}</span>
                <span className="song-rating-value">
                  <span className="rating-stars">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <span
                        key={`star-${song.SongID || index}-${starIndex}`}
                        className={`star ${
                          starIndex < Math.floor(song.Rating)
                            ? 'filled'
                            : starIndex < song.Rating
                            ? 'half-filled'
                            : ''
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </span>
                  <span className="rating-number">{song.Rating.toFixed(1)}</span>
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
      
      {/* Reported song Panel */}
      <div className="reported-songs-section">
        <h2 className="section-title">Reported Songs</h2>
        {dashboardData.reportedSongs.length > 0 ? (
          <div className="reported-songs-list">
            <div className="reported-song-header">
              <span className="song-title-header">Song Title</span>
              <span className="report-reason-header">Reason</span>
              <span className="report-date-header">Date Reported</span>
              <span className="report-status-header">Status</span>
            </div>
            {dashboardData.reportedSongs.map(song => (
              <div key={song.id} className="reported-song-item">
                <span className="reported-song-title">{song.Title}</span>
                <span className="reported-song-reason">{song.Reason}</span>
                <span className="reported-song-date">{song.ReportDate}</span>
                <span className={getStatusClass(song.ReportStatus)}>{getStatusLabel(song.ReportStatus)}</span>
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