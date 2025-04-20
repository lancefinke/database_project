import { useState, useEffect } from 'react';

/**
 * Custom hook for handling song navigation in playlists
 * @param {Array} initialSongs - Initial array of songs
 * @param {Function} onSongChange - Optional callback when song changes
 * @returns {Object} Navigation state and functions
 */
export const useSongNavigation = (initialSongs = [], onSongChange = null) => {
  // Current song index in playlist
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  // Store the current playlist songs
  const [playlistSongs, setPlaylistSongs] = useState(initialSongs);
  // Shuffling state
  const [isShuffling, setIsShuffling] = useState(false);
  // Is playing state
  const [isPlaying, setIsPlaying] = useState(false);

  // Update songs when they change
  useEffect(() => {
    setPlaylistSongs(initialSongs);
    // Reset current index if it's invalid
    if (currentSongIndex >= initialSongs.length) {
      setCurrentSongIndex(0);
    }
  }, [initialSongs]);

  // Get the current song object
  const currentSong = playlistSongs.length > 0 ? playlistSongs[currentSongIndex] : null;

  /**
   * Change to a specific song by index
   * @param {number} index - New song index
   * @returns {boolean} Success status
   */
  const changeSong = (index) => {
    if (index >= 0 && index < playlistSongs.length) {
      setCurrentSongIndex(index);
      // Notify parent component if callback exists
      if (onSongChange) {
        onSongChange(index);
      }
      return true;
    }
    return false;
  };

  /**
   * Play the previous song
   * @returns {boolean} Success status
   */
  const playPreviousSong = () => {
    if (playlistSongs.length <= 1) return false;
    
    let newIndex;
    if (isShuffling) {
      // Get random song (excluding current one)
      do {
        newIndex = Math.floor(Math.random() * playlistSongs.length);
      } while (newIndex === currentSongIndex && playlistSongs.length > 1);
    } else {
      // Go to previous song or wrap to end
      newIndex = (currentSongIndex - 1 + playlistSongs.length) % playlistSongs.length;
    }
    
    return changeSong(newIndex);
  };

  /**
   * Play the next song
   * @returns {boolean} Success status
   */
  const playNextSong = () => {
    if (playlistSongs.length <= 1) return false;
    
    let newIndex;
    if (isShuffling) {
      // Get random song (excluding current one)
      do {
        newIndex = Math.floor(Math.random() * playlistSongs.length);
      } while (newIndex === currentSongIndex && playlistSongs.length > 1);
    } else {
      // Go to next song or wrap to beginning
      newIndex = (currentSongIndex + 1) % playlistSongs.length;
    }
    
    return changeSong(newIndex);
  };

  /**
   * Handle when a song ends
   */
  const handleSongEnd = () => {
    setIsPlaying(false);
    
    // Auto-play next song if available
    if (playlistSongs.length > 1) {
      playNextSong();
      // Resume playing after a short delay to ensure state updates
      setTimeout(() => {
        setIsPlaying(true);
      }, 100);
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

  // Return everything needed for navigation
  return {
    currentSongIndex,
    currentSong,
    playlistSongs,
    isShuffling,
    isPlaying,
    changeSong,
    playPreviousSong,
    playNextSong,
    handleSongEnd,
    toggleShuffle,
    togglePlayPause,
    setIsPlaying
  };
};

export default useSongNavigation;