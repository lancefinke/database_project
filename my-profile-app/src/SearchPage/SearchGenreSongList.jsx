import React from 'react';
import './SearchGenreSongList.css'; // Import the dedicated CSS file
import { ArrowLeft } from 'lucide-react';

// SearchGenreSongList component that displays songs in a genre with a back button
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
        songSrc: song.songFile,
        songImage: song.image,     
        duration: song.duration,
        name: song.title,
        creator: song.artist
      });
    }
  };

  return (
    <div className="search-genre-list-container">
      <button 
        className="back-button" 
        onClick={onBackClick}
      >
        <ArrowLeft size={18} />
        Back to Genres
      </button>
      
      <div className="playlist-header">
        <div className="playlist-info">
          <h2 className="playlist-title">{playlistName || "Genre"}</h2>
          <p className="song-count">{songs.length} {songs.length === 1 ? 'song' : 'songs'}</p>
        </div>
      </div>
      
      <div className="songs-table">
        <div className="songs-table-header">
          <div className="song-number-header">#</div>
          <div className="song-title-header">TITLE</div>
          <div className="song-album-header">ALBUM</div>
          <div className="song-duration-header">DURATION</div>
        </div>
        
        <div className="songs-list">
          {songs.length > 0 ? (
            songs.map((song, index) => (
              <div 
                key={song.id} 
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z"></path>
                    </svg>
                  </button>
                </div>
                <div className="song-title-cell">
                  <div className="song-title-container">
                    <img 
                      src={song.image || "https://via.placeholder.com/80"} 
                      alt={song.title} 
                      className="song-thumbnail" 
                    />
                    <div className="song-text">
                    <div className="song-title" style={{ paddingRight: 0 }}>{song.title}</div>

                      <div className="song-artist">{song.artist}</div>
                    </div>
                  </div>
                </div>
                <div className="song-album">{song.album}</div>
                <div className="song-duration">
                  {formatDuration(song.duration)}
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
  );
};

export default SearchGenreSongList;