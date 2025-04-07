import React from 'react';
import '../ProfilePage/Components/PlaylistSongList.css';
import './SearchPage.css';
import { Clock, MoreVertical, Play, ArrowLeft } from 'lucide-react';

const SearchGenreSongList = ({ songs, playlistName, onBackClick, onSongSelect }) => {
  // Function to format seconds to mm:ss
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Handle song click to play music
  const handleSongClick = (song) => {
    if (onSongSelect) {
      onSongSelect({
        name: song.SongName,
        creator: song.Username
      });
    }
  };

  return (
    <div className="search-genre-list-container">
      <button 
        className="back-button" 
        onClick={onBackClick}
      >
        ← Back to Genres
      </button>
      
      <div className="playlist-header">
        <div className="playlist-info">
          {/* No image in genre view */}
          <div className="playlist-header-text">
            <h2 className="playlist-title">{playlistName || "Genre"} Songs</h2>
            <p className="song-count">{songs.length} songs</p>
          </div>
        </div>
      </div>
      
      <div className="songs-table">
        <div className="songs-table-header">
          <div className="song-number-header">#</div>
          <div className="song-info-header">TITLE</div>
          <div className="song-genre-header">ALBUM</div>
          <div className="song-duration-header">DURATION</div>
        </div>
        
        <div className="songs-list">
          {songs.map((song, index) => (
            <div 
              key={song.SongID} 
              className="song-row"
              onClick={() => handleSongClick(song)}
            >
              <div className="song-number-cell">
                <span className="song-number">{index + 1}</span>
                <button 
                  className="play-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSongClick(song);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"></path>
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
<<<<<<< HEAD
              <div className="song-album">{song.Title}</div>
              <div className="song-duration">{formatDuration(song.Duration)}</div>
=======
              <div className="song-album">{song.album}</div>
              <div className="song-duration" style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
  {formatDuration(song.duration)}
</div>
>>>>>>> 1136963190ca63c8471ffbdac4865c4c08185249
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchGenreSongList;