import React from 'react';
import './PlaylistSongList.css';
import { usePlayerContext } from '../../contexts/PlayerContext';
import UserLink from '../../UserLink/UserLink';

const GenreSongList = ({ songs, playlistName, playlistImage, isOwnProfile = false }) => {
  // Use the global player context instead of local navigation hook
  const {
    currentSong,
    isPlaying,
    playSong
  } = usePlayerContext();

  // Function to format seconds to mm:ss with improved error handling
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

  const handleSongClick = (song) => {
    console.log("Playing song:", song);
    playSong(song, songs);
  };

  // Debug log the songs to see what duration values we have
  console.log("GenreSongList received songs:", songs);

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
              <div className="song-actions">
                {/* No actions when viewing other profiles */}
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
  );
};

export default GenreSongList;