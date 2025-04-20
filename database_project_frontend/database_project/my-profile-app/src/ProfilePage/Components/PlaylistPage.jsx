import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlaylistSongList from './PlaylistSongList';
import './PlaylistPage.css';

const PlaylistPage = ({ onSongSelect }) => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Get current user's ID from token
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        setUserId(userId);
      } catch (error) {
        console.error("Error parsing JWT token:", error);
        setError("Failed to get user information");
      }
    }
  }, []);

  // Fetch all playlists for the user
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:5142/api/database/GetUserPlaylists?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch playlists');
        }
        const data = await response.json();
        setPlaylists(data);
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPlaylists();
    }
  }, [userId]);

  // Fetch specific playlist when playlistId changes
  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!userId || !playlistId) return;

      try {
        let response;
        // Handle "Saved Songs" playlist differently
        if (playlistId === 'saved-songs') {
          response = await fetch(`http://localhost:5142/api/database/GetUserSongs?userId=${userId}`);
        } else {
          response = await fetch(`http://localhost:5142/api/database/GetPlaylist?playlistId=${playlistId}&userId=${userId}`);
        }

        if (!response.ok) {
          throw new Error('Failed to fetch playlist');
        }

        const data = await response.json();
        
        // Format the data based on whether it's saved songs or a regular playlist
        if (playlistId === 'saved-songs') {
          setSelectedPlaylist({
            id: 'saved-songs',
            name: 'Saved Songs',
            image: 'https://via.placeholder.com/100',
            songs: data
          });
        } else {
          setSelectedPlaylist(data);
        }
      } catch (err) {
        console.error("Error fetching playlist:", err);
        setError(err.message);
      }
    };

    if (userId && playlistId) {
      fetchPlaylist();
    }
  }, [playlistId, userId]);

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist.PlaylistID}`);
  };

  const handleBack = () => {
    setSelectedPlaylist(null);
    navigate('/profile');
  };

  if (!userId) {
    return <div className="playlist-error">Please log in to view playlists</div>;
  }

  if (loading) {
    return <div className="playlist-loading">Loading playlists...</div>;
  }

  if (error) {
    return (
      <div className="playlist-error">
        <p>Error: {error}</p>
        <button onClick={handleBack} className="retry-button">Go Back</button>
      </div>
    );
  }

  return (
    <div className="playlist-page">
      {selectedPlaylist ? (
        <>
          <div className="styled-back-button" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
            </svg>
            <span>Back to Playlists</span>
          </div>

          <PlaylistSongList 
            songs={selectedPlaylist.songs || []}
            playlistName={selectedPlaylist.name}
            playlistImage={selectedPlaylist.image}
            onSongSelect={onSongSelect}
          />
        </>
      ) : (
        <div className="playlist-list-container">
          <h1 className="playlist-list-title">Your Playlists</h1>
          <div className="playlist-grid">
            {playlists.map(playlist => (
              <div 
                key={playlist.PlaylistID}
                className="playlist-item"
                onClick={() => handlePlaylistClick(playlist)}
              >
                <img
                  src={playlist.PlaylistPicture || "https://via.placeholder.com/100"}
                  alt={`${playlist.Title} Cover`}
                  className="playlist-image"
                />
                <div className="playlist-info">
                  <h3 className="playlist-name">{playlist.Title}</h3>
                  <p className="playlist-description">{playlist.PlaylistDescription}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;