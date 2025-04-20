import React from 'react';
import './PlaylistSongList.css';
import { usePlayerContext } from '../../contexts/PlayerContext'; // Import the player context

const GenreSongList = ({ songs, playlistName, playlistImage }) => {
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
    // Use the global playSong function instead
    playSong(song, songs);
  };

  return (
    <div className="playlist-song-list-container genre-song-list">
      <div className="playlist-header genre-header">
        <div className="playlist-info genre-info">
          <div className="playlist-header-text genre-header-text">
            <h2 className="playlist-title">{playlistName || "Genre"}</h2>
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
        
        <div className="songs-list">
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
                <div className="song-actions">
                  {/* No actions for genre songs */}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-playlist-message">
              <p>No songs found in this genre.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    // MusicPlayer removed - now in App.jsx
  );
};

export default GenreSongList;