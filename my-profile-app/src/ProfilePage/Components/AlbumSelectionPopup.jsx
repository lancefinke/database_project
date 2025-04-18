import React from "react";
import "./PlaylistSelectionPopup.css"; // We'll reuse the same styling

const AlbumSelectionPopup = ({ onClose, albums, onAddToAlbum, currentSong }) => {
  return (
    <>
      <div className="playlist-selection-overlay" onClick={onClose}></div>
      <div className="playlist-selection-popup">
        <div className="playlist-selection-header">
          <h3>Add to Album</h3>
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
          {albums.length === 0 ? (
            <p className="no-playlists-message">No albums available</p>
          ) : (
            albums.map(album => (
              <div 
                key={album.id}
                className="playlist-selection-item"
                onClick={() => onAddToAlbum(album.id)}
              >
                <img 
                  src={album.image} 
                  alt={`${album.name} cover`} 
                />
                <span>{album.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AlbumSelectionPopup;