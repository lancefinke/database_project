import React, { useState, useEffect } from 'react';
import './PlaylistSongList.css';

const AlbumSongList = ({ songs, playlistName, playlistImage, onSongSelect, onDeleteSong, isMyAlbum = false, onAddToPlaylist, onAddToAlbum }) => {
  // Function to format seconds to mm:ss
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSongClick = (song) => {
    console.log(song)
    if (onSongSelect) {
      onSongSelect({
        songImage: song.image,
        songSrc: song.songFile,
        name: song.title,
        duration: song.duration,
        creator: song.artist
      });
    }
  };

  // State to track which song's action menu is open (by song ID)
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Toggle menu for a specific song
  const toggleMenu = (e, songId) => {
    e.stopPropagation(); // Prevent row click event
    setActiveMenuId(activeMenuId === songId ? null : songId);
  };

  // Handle delete song
  const handleDeleteSong = (e, song) => {
    e.stopPropagation(); // Prevent row click event
    if (onDeleteSong) {
      onDeleteSong(song, isMyAlbum);
      setActiveMenuId(null); // Close menu after action
    }
  };
  
  // Handle add to playlist
  const handleAddToPlaylist = (e, song) => {
    e.stopPropagation(); // Prevent row click event
    if (onAddToPlaylist) {
      onAddToPlaylist(song);
      setActiveMenuId(null); // Close menu after action
    }
  };
  
  // Handle add to album
  const handleAddToAlbum = (e, song) => {
    e.stopPropagation(); // Prevent row click event
    if (onAddToAlbum) {
      onAddToAlbum(song);
      setActiveMenuId(null); // Close menu after action
    }
  };

  // Add click event listener to document to close menu when clicking outside
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
            src={playlistImage || "https://via.placeholder.com/220"} 
            alt={playlistName} 
            className="playlist-header-image" 
          />
          <div className="playlist-header-text">
            <h2 className="playlist-title">{playlistName || "Album"}</h2>
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
                
                {/* THIS LINE HAD THE ERROR - Changed activeMenu to activeMenuId */}
                {activeMenuId === song.id && (
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
                    
                    {/* Only show "Add to album" for My Songs album */}
                    {isMyAlbum && (
                      <div 
                        className="song-actions-menu-item"
                        onClick={(e) => handleAddToAlbum(e, song)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zm-7.5-1c1.38 0 2.5-1.12 2.5-2.5V7h3V5h-4v5.5c-.55 0-1-.45-1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1h1v1c0 1.38-1.12 2.5-2.5 2.5S9 16.38 9 15s1.12-2.5 2.5-2.5c.17 0 .34.02.5.05v-2.1c-.16-.03-.33-.05-.5-.05C8.67 10.4 6 13.07 6 16.4c0 1.88 1.12 3.6 3.5 3.6 1.94 0 3.5-1.56 3.5-3.5v-1.5z"></path>
                        </svg>
                        Add to album
                      </div>
                    )}
                    
                    <div 
                      className="song-actions-menu-item delete"
                      onClick={(e) => handleDeleteSong(e, song)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                      </svg>
                      {isMyAlbum ? 'Remove song' : 'Remove from album'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-playlist-message">
            <p>This album is empty. Add some songs to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumSongList;