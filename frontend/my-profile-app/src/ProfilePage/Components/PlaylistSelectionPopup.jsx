import React from "react";
import "./PlaylistSelectionPopup.css";

const PlaylistSelectionPopup = ({ onClose, playlists, onAddToPlaylist, currentSong }) => {
  return (
    <>
      <div className="playlist-selection-overlay" onClick={onClose}></div>
      <div className="playlist-selection-popup">
        <div className="playlist-selection-header">
          <h3>Add to Playlist</h3>
          <button className="playlist-selection-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="playlist-selection-song-info">
          <img 
            src={currentSong?.image || "https://via.placeholder.com/40"} 
            alt="Song cover" 
          />
          <div>
            <p className="playlist-selection-song-title">{currentSong?.title || "Current Song"}</p>
            <p className="playlist-selection-song-artist">{currentSong?.artist || "Artist"}</p>
          </div>
        </div>
        
        <div className="playlist-selection-list">
          {playlists.length === 0 ? (
            <p className="no-playlists-message">No playlists available</p>
          ) : (
            playlists.map(playlist => (
              <div 
                key={playlist.id}
                className="playlist-selection-item"
                onClick={() => onAddToPlaylist(playlist.id)}
              >
                <img 
                  src={playlist.image} 
                  alt={`${playlist.name} cover`} 
                />
                <span>{playlist.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default PlaylistSelectionPopup;