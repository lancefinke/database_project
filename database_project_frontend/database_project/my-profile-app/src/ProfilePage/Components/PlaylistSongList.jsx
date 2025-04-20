import React, { useState, useEffect } from 'react';
import './PlaylistSongList.css';
import { usePlayerContext } from '../../contexts/PlayerContext'; // Import the player context

const PlaylistSongList = ({ songs, playlistName, playlistImage, onDeleteSong, onAddToPlaylist }) => {
  // Use the global player context instead of local navigation hook
  const {
    currentSong,
    isPlaying,
    isShuffling,
    playSong,
    togglePlayPause,
    toggleShuffle
  } = usePlayerContext();

  // Function to format seconds to mm:ss
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSongClick = (song) => {
    console.log(song);
    // Use the global playSong function instead
    playSong(song, songs);
  };

  // State to track which song's action menu is open
  const [activeMenu, setActiveMenu] = useState(null);

  // Toggle menu for a specific song
  const toggleMenu = (e, songId) => {
    e.stopPropagation(); // Prevent row click event
    setActiveMenu(activeMenu === songId ? null : songId);
  };

  // Handle delete song
  const handleDeleteSong = (e, song) => {
    e.stopPropagation(); // Prevent row click event
    if (onDeleteSong) {
      onDeleteSong(song, false);
      setActiveMenu(null); // Close menu after action
    }
  };
  
  // Handle add to playlist
  const handleAddToPlaylist = (e, song) => {
    e.stopPropagation(); // Prevent row click event
    if (onAddToPlaylist) {
      onAddToPlaylist(song);
      setActiveMenu(null); // Close menu after action
    }
  };

  // Add click event listener to document to close menu when clicking outside
  useEffect(() => {
    if (activeMenu !== null) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.song-actions')) {
          setActiveMenu(null);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [activeMenu]);

  return (
    <div className="playlist-song-list-container">
      <div className="playlist-header">
        <div className="playlist-info">
          <img 
            src={playlistImage || "https://via.placeholder.com/220"} 
            alt={playlistName} 
            className="playlist-header-image" 
          />
          <div className="playlist-header-text">
            <h2 className="playlist-title">{playlistName || "Playlist"}</h2>
            <p className="song-count">{songs.length} {songs.length === 1 ? 'song' : 'songs'}</p>
          </div>
        </div>
      </div>
      
      <div className="songs-table">
        <div className="songs-table-header">
          <div className="song-number-header">#</div>
          <div className="song-image-header"></div>
          <div className="song-info-header">TITLE</div>
          <div className="song-genre-header">GENRE</div>
          <div className="song-duration-header">DURATION</div>
          <div className="song-actions-header"></div>
        </div>
        
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div key={song.id} className="song-row" onClick={() => handleSongClick(song)}>
              <div className="song-number-cell">
                <span className="song-number">{index + 1}</span>
                <button className="play-button" onClick={(e) => {
                  e.stopPropagation();
                  handleSongClick(song);
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"></path>
                  </svg>
                </button>
              </div>
              <div className="playlist-song-thumbnail-cell">
                <img 
                  src={song.image || "https://via.placeholder.com/80"} 
                  alt={song.title} 
                  className="playlist-song-thumbnail" 
                />
              </div>
              <div className="song-info">
                <div className="song-text">
                  <span className="song-title">{song.title}</span>
                  <span className="song-artist">{song.artist}</span>
                </div>
              </div>
              <div className="song-genre">{song.genre}</div>
              <div className="song-duration">
                {formatDuration(song.duration)}
              </div>
              <div className="song-actions" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="song-actions-button" 
                  onClick={(e) => toggleMenu(e, song.id)}
                  aria-label="Song actions"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                  </svg>
                </button>
                
                {activeMenu === song.id && (
                  <div className="song-actions-menu">
                    <div 
                      className="song-actions-menu-item"
                      onClick={(e) => handleAddToPlaylist(e, song)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 10H3v2h11v-2zm0-4H3v2h11V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM3 16h7v-2H3v2z"></path>
                      </svg>
                      Add to playlist
                    </div>
                    
                    <div 
                      className="song-actions-menu-item delete"
                      onClick={(e) => handleDeleteSong(e, song)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                      </svg>
                      Remove from playlist
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-playlist-message">
            <p>This playlist is empty. Add some songs to get started!</p>
          </div>
        )}
      </div>
    </div>
    // Note: We removed the MusicPlayer from here since it's now in App.jsx
  );
};

export default PlaylistSongList;