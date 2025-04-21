// SongListenerTracker.js
// This module tracks how many times each song is played

const API_URL = "https://localhost:7152";

class SongListenerTracker {
  constructor() {
    this.listenCounts = this.loadListenData() || {};
  }

  // Load existing listen data from localStorage if available
  loadListenData() {
    try {
      const savedData = localStorage.getItem('songListenData');
      return savedData ? JSON.parse(savedData) : {};
    } catch (error) {
      console.error('Error loading listen data:', error);
      return {};
    }
  }

  // Save listen data to localStorage
  saveListenData() {
    try {
      localStorage.setItem('songListenData', JSON.stringify(this.listenCounts));
    } catch (error) {
      console.error('Error saving listen data:', error);
    }
  }

  // Track when a song is played
  async trackPlay(songId, songData, userId = null) {
    // Create song identifier if not exists
    if (!this.listenCounts[songId]) {
      this.listenCounts[songId] = {
        title: songData.name,
        artist: songData.creator,
        playCount: 0,
        lastPlayed: null
      };
    }

    // Update play count and timestamp
    this.listenCounts[songId].playCount += 1;
    this.listenCounts[songId].lastPlayed = new Date().toISOString();
    
    // Save updated data locally
    this.saveListenData();
    
    console.log(`Tracked play for "${songData.name}" by ${songData.creator}`);
    
    // If we have a user ID and API endpoint, send the play data to the server
    if (userId) {
      try {
        const response = await fetch(`${API_URL}/api/listens/trackListen`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            songId: songId,
            userId: userId,
            timestamp: new Date().toISOString()
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to record listen on server');
        }
        
        console.log('Listen recorded on server');
      } catch (error) {
        console.error('Error recording listen on server:', error);
        // Still keep local tracking even if server fails
      }
    }
    
    return this.listenCounts[songId].playCount;
  }

  // Get listener count for a specific song
  getPlayCount(songId) {
    return this.listenCounts[songId]?.playCount || 0;
  }

  // Get all song listener data
  getAllListenerData() {
    return this.listenCounts;
  }

  // Get most played songs (with optional limit)
  getMostPlayedSongs(limit = 10) {
    return Object.entries(this.listenCounts)
      .map(([id, data]) => ({
        id,
        ...data
      }))
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, limit);
  }
}

// Create a singleton instance
const songTracker = new SongListenerTracker();
export default songTracker;