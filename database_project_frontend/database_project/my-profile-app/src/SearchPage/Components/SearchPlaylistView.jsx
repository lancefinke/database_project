import React, { useState, useEffect } from 'react';
import './SearchPlaylistView.css';
import MusicPlayer from '../../ProfilePage/Components/MusicPlayer';
import useSongNavigation from '../../hooks/useSongNavigation';

const SearchPlaylistView = ({ songs, playlistName, playlistImage, onBack, onSongSelect }) => {
  const {
    currentSongIndex,
    currentSong,
    isPlaying,
    isShuffling,
    changeSong,
    playPreviousSong,
    playNextSong,
    handleSongEnd,
    togglePlayPause,
    toggleShuffle,
    setIsPlaying
  } = useSongNavigation(songs);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSongClick = (song) => {
    const index = songs.findIndex(s => s.id === song.id);
    if (index !== -1) {
      changeSong(index);
      setIsPlaying(true);
      if (onSongSelect) {
        onSongSelect(song);
      }
    }
  };

  return (
    <div className="search-playlist-view">
      <div className="search-playlist-header">
        <button className="search-playlist-back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
          </svg>
          <span>Back to Search</span>
        </button>
        
        <div className="search-playlist-info">
          <img 
            src={playlistImage || "https://via.placeholder.com/300"} 
            alt={playlistName} 
            className="search-playlist-image" 
          />
          <div className="search-playlist-text">
            <h1 className="search-playlist-title">{playlistName || "Playlist"}</h1>
            <p className="search-playlist-count">{songs.length} {songs.length === 1 ? 'song' : 'songs'}</p>
          </div>
        </div>
      </div>
      
      <div className="search-songs-table">
        <div className="search-songs-table-header">
          <div className="search-song-number-header">#</div>
          <div className="search-song-image-header"></div>
          <div className="search-song-info-header">TITLE</div>
          <div className="search-song-genre-header">GENRE</div>
          <div className="search-song-duration-header">DURATION</div>
        </div>
        
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div key={song.id} className="search-song-row" onClick={() => handleSongClick(song)}>
              <div className="search-song-number-cell">
                <span className="search-song-number">{index + 1}</span>
                <button className="search-play-button" onClick={(e) => {
                  e.stopPropagation();
                  handleSongClick(song);
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"></path>
                  </svg>
                </button>
              </div>
              <div className="search-song-thumbnail-cell">
                <img 
                  src={song.image || "https://via.placeholder.com/80"} 
                  alt={song.title} 
                  className="search-song-thumbnail" 
                />
              </div>
              <div className="search-song-info">
                <div className="search-song-text">
                  <span className="search-song-title">{song.title}</span>
                  <span className="search-song-artist">{song.artist}</span>
                </div>
              </div>
              <div className="search-song-genre">{song.genre}</div>
              <div className="search-song-duration">
                {formatDuration(song.duration)}
              </div>
            </div>
          ))
        ) : (
          <div className="search-empty-playlist-message">
            <p>This playlist is empty.</p>
          </div>
        )}
      </div>

      {currentSong && (
        <MusicPlayer
          id={currentSong.id}
          songSrc={currentSong.songFile}
          songImage={currentSong.image}
          song={currentSong.title}
          artist={currentSong.artist}
          duration={currentSong.duration}
          pageName="playlist"
          isPlaying={isPlaying}
          isShuffling={isShuffling}
          togglePlayPause={togglePlayPause}
          toggleShuffle={toggleShuffle}
          playPreviousSong={playPreviousSong}
          playNextSong={playNextSong}
          handleSongEnd={handleSongEnd}
          setIsPlaying={setIsPlaying}
          playlistSongs={songs}
        />
      )}
    </div>
  );
};

export default SearchPlaylistView; 