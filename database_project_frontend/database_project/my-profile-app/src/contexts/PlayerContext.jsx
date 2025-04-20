import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context to store the player state
const PlayerContext = createContext();

// Provider component
export const PlayerProvider = ({ children }) => {
  // Store currently playing song data
  const [currentSong, setCurrentSong] = useState(null);
  // Store current playlist
  const [playlistSongs, setPlaylistSongs] = useState([]);
  // Current song index in playlist
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  // Playing state
  const [isPlaying, setIsPlaying] = useState(false);
  // Shuffling state
  const [isShuffling, setIsShuffling] = useState(false);

  /**
   * Play a specific song within a playlist
   */
  const playSong = (song, playlist = []) => {
    // Ensure song has a consistent ID field
    const normalizedSong = {
      ...song,
      id: song.id || song.SongID || song.songId || Date.now().toString()  // Use SongID as fallback if id is undefined
    };
    
    // Normalize all songs in the playlist to have consistent id fields
    const normalizedPlaylist = playlist.map(s => ({
      ...s,
      id: s.id || s.SongID || s.songId || Date.now().toString()
    }));
    
    // Now proceed with the normalized objects
    if (normalizedPlaylist && normalizedPlaylist.length > 0) {
      setPlaylistSongs(normalizedPlaylist);
      
      // Find the index of the selected song in the playlist
      const index = normalizedPlaylist.findIndex(s => s.id === normalizedSong.id);
      if (index !== -1) {
        setCurrentSongIndex(index);
        setCurrentSong(normalizedPlaylist[index]);
        setIsPlaying(true);
      }
    } else {
      // Single song play
      setCurrentSong(normalizedSong);
      setPlaylistSongs([normalizedSong]);
      setCurrentSongIndex(0);
      setIsPlaying(true);
    }
  };

  /**
   * Change to a specific song by index
   */
  const changeSong = (index) => {
    if (index >= 0 && index < playlistSongs.length) {
      setCurrentSongIndex(index);
      setCurrentSong(playlistSongs[index]);
      return true;
    }
    return false;
  };

  /**
   * Play the previous song
   */
  const playPreviousSong = () => {
    if (playlistSongs.length <= 1) return false;
    
    let newIndex;
    if (isShuffling) {
      do {
        newIndex = Math.floor(Math.random() * playlistSongs.length);
      } while (newIndex === currentSongIndex && playlistSongs.length > 1);
    } else {
      newIndex = (currentSongIndex - 1 + playlistSongs.length) % playlistSongs.length;
    }
    
    return changeSong(newIndex);
  };

  /**
   * Play the next song
   */
  const playNextSong = () => {
    if (playlistSongs.length <= 1) return false;
    
    let newIndex;
    if (isShuffling) {
      do {
        newIndex = Math.floor(Math.random() * playlistSongs.length);
      } while (newIndex === currentSongIndex && playlistSongs.length > 1);
    } else {
      newIndex = (currentSongIndex + 1) % playlistSongs.length;
    }
    
    return changeSong(newIndex);
  };

  /**
   * Handle when a song ends
   */
  const handleSongEnd = () => {
    // Auto-play next song if available
    if (playlistSongs.length > 1) {
      playNextSong();
      // Resume playing
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  /**
   * Toggle shuffle mode
   */
  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  /**
   * Toggle play/pause
   */
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Value to provide to consumers
  const value = {
    currentSong,
    setCurrentSong,
    playlistSongs,
    setPlaylistSongs,
    currentSongIndex,
    isPlaying,
    isShuffling,
    playSong,
    changeSong,
    playPreviousSong,
    playNextSong,
    handleSongEnd,
    toggleShuffle,
    togglePlayPause,
    setIsPlaying
  };
  
  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => useContext(PlayerContext);

export default PlayerContext;