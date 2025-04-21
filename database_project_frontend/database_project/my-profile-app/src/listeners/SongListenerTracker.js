/**
 * SongListenerTracker.js
 * This module tracks how many times each song is played in local storage
 * and provides statistics about user listening habits.
 */

class SongListenerTracker {
  constructor() {
    this.listenCounts = this.loadListenData() || {};
  }

  /**
   * Load existing listen data from localStorage if available
   * @returns {Object|null} Stored listen data or null if not available
   */
  loadListenData() {
    try {
      const savedData = localStorage.getItem('songListenData');
      return savedData ? JSON.parse(savedData) : {};
    } catch (error) {
      console.error('Error loading listen data:', error);
      return {};
    }
  }

  /**
   * Save listen data to localStorage
   */
  saveListenData() {
    try {
      localStorage.setItem('songListenData', JSON.stringify(this.listenCounts));
    } catch (error) {
      console.error('Error saving listen data:', error);
    }
  }

  /**
   * Track song play locally (no API calls)
   * @param {string|number} songId - The ID of the song being played
   * @param {{ name: string, creator: string }} songData - Basic song metadata
   * @returns {number} The updated play count
   */
  trackLocalPlay(songId, songData) {
    // Validate input
    if (!songId || !songData || !songData.name) {
      console.warn("Cannot track play: Invalid song data");
      return 0;
    }

    // Create song identifier if not exists
    if (!this.listenCounts[songId]) {
      this.listenCounts[songId] = {
        title: songData.name,
        artist: songData.creator || "Unknown Artist",
        playCount: 0,
        lastPlayed: null,
        firstPlayed: new Date().toISOString()
      };
    }
  
    // Update play count and timestamp
    this.listenCounts[songId].playCount += 1;
    this.listenCounts[songId].lastPlayed = new Date().toISOString();
    
    // Save updated data locally
    this.saveListenData();
    
    console.log(`Local storage: Tracked play for "${songData.name}" (count: ${this.listenCounts[songId].playCount})`);
    
    return this.listenCounts[songId].playCount;
  }

  /**
   * Get listener count for a specific song
   * @param {string|number} songId - The song ID to look up
   * @returns {number} The number of times this song has been played
   */
  getPlayCount(songId) {
    return this.listenCounts[songId]?.playCount || 0;
  }

  /**
   * Get all song listener data
   * @returns {Object} Map of song IDs to listen data
   */
  getAllListenerData() {
    return this.listenCounts;
  }

  /**
   * Get most played songs
   * @param {number} limit - Maximum number of songs to return
   * @returns {Array} Array of song objects, sorted by play count
   */
  getMostPlayedSongs(limit = 10) {
    return Object.entries(this.listenCounts)
      .map(([id, data]) => ({
        id,
        ...data
      }))
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, limit);
  }

  /**
   * Get recently played songs
   * @param {number} limit - Maximum number of songs to return
   * @returns {Array} Array of songs, sorted by most recently played
   */
  getRecentlyPlayed(limit = 10) {
    return Object.entries(this.listenCounts)
      .filter(([_, data]) => data.lastPlayed) // Only include songs with a lastPlayed timestamp
      .map(([id, data]) => ({
        id,
        ...data
      }))
      .sort((a, b) => {
        // Sort by last played date (most recent first)
        return new Date(b.lastPlayed) - new Date(a.lastPlayed);
      })
      .slice(0, limit);
  }

  /**
   * Get total number of plays across all songs
   * @returns {number} Total number of plays
   */
  getTotalPlays() {
    return Object.values(this.listenCounts).reduce((sum, song) => 
      sum + (song.playCount || 0), 0
    );
  }

  /**
   * Get total unique songs played
   * @returns {number} Number of unique songs played
   */
  getUniqueSongsPlayed() {
    return Object.keys(this.listenCounts).length;
  }

  /**
   * Clear all listen data from local storage
   */
  clearListenData() {
    this.listenCounts = {};
    this.saveListenData();
    console.log("Local listen data has been cleared");
  }
}

// Create a singleton instance
const songTracker = new SongListenerTracker();
export default songTracker;