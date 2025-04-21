import React, { useState, useEffect } from 'react';
import './PlaylistSongList.css';
import { usePlayerContext } from '../../contexts/PlayerContext';
import UserLink from '../../UserLink/UserLink';

const PlaylistSongList = ({ songs, playlistName, playlistImage, onDeleteFromPlaylist, isOwnProfile = true }) => {
  // Use the global player context
  const {
    currentSong,
    isPlaying,
    playSong
  } = usePlayerContext();

  // Debug log to check incoming song data
  console.log("PlaylistSongList received songs:", songs);
  const formatDuration = (seconds) => {
    // If it's already a formatted string like "3:45", just return it
    if (typeof seconds === 'string' && seconds.includes(':')) {
      return seconds;
    }
    
    // Handle invalid inputs
    if (seconds === undefined || seconds === null || isNaN(seconds)) {
      return "0:00";
    }
    
    // Parse string to number if needed
    if (typeof seconds === 'string') {
      seconds = parseFloat(seconds);
      if (isNaN(seconds)) return "0:00";
    }
    
    // Format the duration
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  // State to track which song's action menu is open
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Toggle menu for a specific song
  const toggleMenu = (e, songId) => {
    e.stopPropagation(); // Prevent row click event
    setActiveMenuId(activeMenuId === songId ? null : songId);
  };

  // Handle remove from playlist
  const handleRemoveFromPlaylist = (e, song) => {
    e.stopPropagation();
    if (onDeleteFromPlaylist) {
      onDeleteFromPlaylist(song);
      setActiveMenuId(null);
    }
  };

  const handleSongClick = (song) => {
    console.log("Playing song from playlist:", song);
    playSong(song, songs);
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (activeMenuId !== null) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.song-actions')) {
          setActiveMenuId(null);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [activeMenuId]);

  return (
    <div className="playlist-song-list-container">
      <div className="playlist-header">
        <div className="playlist-info">
          <img 
            src={playlistImage || "https://placehold.co/150x150"}
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
            <div key={song.id || index} className="song-row" onClick={() => handleSongClick(song)}>
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
                  src={song.image || "https://placehold.co/80x80"}
                  alt={song.title} 
                  className="playlist-song-thumbnail" 
                />
              </div>
              <div className="song-info">
                <div className="song-text">
                  <span className="song-title">{song.title}</span>
                  <span className="song-artist">
                    <UserLink text={song.artist} userName={song.artist} />
                  </span>
                </div>
              </div>
              <div className="song-genre">{song.genre}</div>
              <div className="song-duration">
  {typeof song.duration === 'string' && song.duration.includes(':') 
    ? song.duration 
    : formatDuration(song.duration)}
</div>
              <div className="song-actions" onClick={(e) => e.stopPropagation()}>
                {isOwnProfile && onDeleteFromPlaylist && (
                  <>
                    <button 
                      className="song-actions-button" 
                      onClick={(e) => toggleMenu(e, song.id)}
                      aria-label="Song actions"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                      </svg>
                    </button>
                    
                    {activeMenuId === song.id && (
                      <div className="song-actions-menu">
                        <div 
                          className="song-actions-menu-item delete"
                          onClick={(e) => handleRemoveFromPlaylist(e, song)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                          </svg>
                          Remove from playlist
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-playlist-message">
            <p>This playlist is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistSongList;