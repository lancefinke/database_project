import React, { useState,useEffect } from 'react';
import './PlaylistSongList.css';

const AlbumSongList = ({ ID, selectedAlbum, onSongSelect, onDeleteSong, isMyAlbum = false }) => {
  // Function to format seconds to mm:ss
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSongClick = (song) => {
    if (onSongSelect) {
      onSongSelect({
        name: song.SongName,
      });
    }
  };

  // State to track which song's action menu is open
  const [activeMenu, setActiveMenu] = useState(null);
  const [albumId,setAlbumID] = useState(ID);
  const [album,setAlbum] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(`https://localhost:7152/api/database/GetAlbumSongs?AlbumID=${albumId}`);
        const data = await res.json();
        setAlbum(data);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, []);

  // Toggle menu for a specific song
  const toggleMenu = (e, songId) => {
    e.stopPropagation(); // Prevent row click event
    setActiveMenu(activeMenu === songId ? null : songId);
  };

  // Close menu when clicking outside
  const closeMenu = () => {
    setActiveMenu(null);
  };

  // Handle delete song
  const handleDeleteSong = (e, song) => {
    e.stopPropagation(); // Prevent row click event
    if (onDeleteSong) {
      onDeleteSong(song, isMyAlbum);
      setActiveMenu(null); // Close menu after action
    }
  };



  // Add click event listener to document to close menu when clicking outside
  React.useEffect(() => {
    if (activeMenu !== null) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.song-actions')) {
          closeMenu();
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
      {/* No back button here - it's now in the parent component */}
      
      <div className="playlist-header">
        <div className="playlist-info">
          <img 
            src={selectedAlbum.AlbumCoverArtFileName || "https://via.placeholder.com/100"} 
            alt={selectedAlbum.Title} 
            className="playlist-header-image" 
          />
          <div className="playlist-header-text">
            <h2 className="playlist-title">{selectedAlbum.Title || "Album"}</h2>
            <p className="song-count">{album.length} songs</p>
          </div>
        </div>
      </div>
      
      <div className="songs-table">
        <div className="songs-table-header">
          <div className="song-number-header">#</div>
          <div className="song-info-header">TITLE</div>
          <div className="song-genre-header">GENRE</div>
          <div className="song-duration-header">DURATION</div>
          <div className="song-actions-header"></div> {/* New header for actions */}
        </div>
        
        <div className="songs-list">
          {album.map((song, index) => (
            <div key={song.SongID} className="song-row" onClick={() => handleSongClick(song)}>
              <div className="song-number-cell">
                <span className="song-number">{index + 1}</span>
                <button className="play-button" onClick={(e) => {
                  e.stopPropagation();
                  handleSongClick(song);
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7"></path>
                  </svg>
                </button>
              </div>
              <div className="song-info">
                <img 
                  src={song.CoverArtFileName || "https://via.placeholder.com/40"} 
                  alt={song.SongName} 
                  className="song-image" 
                />
                <div className="song-text">
                  <div className="song-title">{song.SongName}</div>
                  <div className="song-artist">{song.Username}</div>
                </div>
              </div>
              <div className="song-genre">{song.GenreText}</div>
              <div className="song-duration" style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
  {formatDuration(song.Duration)}
</div>
              <div className="song-actions" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="song-actions-button" 
                  onClick={(e) => toggleMenu(e, song.SongID)}
                  aria-label="Song actions"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                  </svg>
                </button>
                
                {activeMenu === song.SongID && (
                  <div className="song-actions-menu">
                    <div 
                      className="song-actions-menu-item delete"
                      onClick={(e) => handleDeleteSong(e, song)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                      </svg>
                      {isMyAlbum ? 'Delete from library' : 'Remove from album'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumSongList;