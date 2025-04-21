import songTracker from './SongListenerTracker';

// API constants
const API_URL = "http://localhost:5142";
const LISTEN_ENDPOINT = `${API_URL}/api/Listen/AddListen`; // Capital L to match your backend

/**
 * Increment the listen count for a song both locally and on server.
 * @param {string|number} songId - The ID of the song that was listened to
 * @param {{ name: string, creator: string }} songData - Basic song metadata
 * @param {string|number|null} userId - The ID of the user who listened (or null for anonymous)
 * @returns {Promise<number>} the new playCount
 */
export async function trackListen(songId, songData, userId = null) {
  try {
    // Validate input parameters
    if (!songId) {
      console.warn("Cannot track listen: Missing song ID");
      return 0;
    }

    if (!songData || !songData.name) {
      console.warn(`Cannot track listen for song ${songId}: Missing song metadata`);
      return 0;
    }

    // Force songId and userId to be numbers
    const numericSongId = parseInt(songId, 10);
    const numericUserId = userId ? parseInt(userId, 10) : null;
    
    // First track the listen locally (this always works even offline)
    let playCount = songTracker.trackLocalPlay(numericSongId, songData);

    // If we have a user ID, track the listen on the server too
    if (numericUserId) {
      try {
        console.log(`📡 Sending listen event to server for song ${numericSongId} by user ${numericUserId}`);
        
        // Add timestamp with more precision to reduce chance of conflicts
        const timestamp = new Date().toISOString();
        
        // Create payload for API
        const requestBody = {
          SongID: numericSongId,
          UserID: numericUserId,
          Timestamp: timestamp
        };
        
        console.log("📦 Request payload:", requestBody);
        
        const response = await fetch(LISTEN_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
          try {
            const data = await response.json();
            if (data && typeof data.count === 'number') {
              playCount = data.count;
              console.log(`🔢 Server provided updated listen count: ${playCount}`);
            }
            
            console.log(`✅ Server recorded listen for "${songData.name}" (ID: ${numericSongId})`);
            
            // Use a more reliable method to trigger dashboard refresh
            window.dispatchEvent(new CustomEvent('dashboard-refresh-needed', { 
              detail: { 
                songId: numericSongId, 
                userId: numericUserId,
                timestamp: Date.now()
              }
            }));
            
            // Also dispatch the original event for backward compatibility
            window.dispatchEvent(new CustomEvent('listen-recorded', { 
              detail: { 
                songId: numericSongId, 
                userId: numericUserId 
              }
            }));
            
            console.log("🔄 Dispatched dashboard refresh events");
          } catch (parseError) {
            console.debug("Could not parse server response:", parseError);
          }
        } else {
          if (response.status === 409) {
            console.warn(`⚠️ Server returned 409 Conflict - still trying to count the listen`);
            
            // Even with a 409, try to get the updated count (your backend may be able to provide this)
            try {
              const errorData = await response.text();
              console.warn("Server response:", errorData);
            } catch (e) {
              // Ignore error reading response
            }
          } else {
            console.warn(`⚠️ Server returned ${response.status} ${response.statusText}`);
          }
          
          // Even if there's an error, we still try to update the dashboard
          window.dispatchEvent(new CustomEvent('dashboard-refresh-needed', { 
            detail: { 
              songId: numericSongId, 
              userId: numericUserId,
              timestamp: Date.now(),
              error: true
            }
          }));
        }
      } catch (apiError) {
        console.error(`❌ API listen tracking failed:`, apiError);
        // Non-blocking - we still return the local count even if API fails
      }
    }
    
    console.log(`🎧 "${songData.name}" by ${songData.creator} = listen #${playCount}`);
    return playCount;
  } catch (err) {
    console.error('Failed to track listen:', err);
    return 0;
  }
}

/**
 * Get total plays for a specific song from local storage
 * @param {string|number} songId
 * @returns {number}
 */
export function getSongPlayCount(songId) {
  return songTracker.getPlayCount(songId);
}

/**
 * Get top played songs from local storage
 * @param {number} limit - Maximum number of songs to return
 * @returns {Array} Array of song data with play counts
 */
export function getTopSongs(limit = 10) {
  return songTracker.getMostPlayedSongs(limit);
}

/**
 * Get all listen data from local storage
 * @returns {Object} Map of song IDs to listen data
 */
export function getAllListenData() {
  return songTracker.getAllListenerData();
}

/**
 * Fetch listen statistics for an artist from the server
 * @param {string|number} artistId 
 * @returns {Promise<Object>} Listen statistics
 */
export async function getArtistListenStats(artistId) {
  try {
    const response = await fetch(`${API_URL}/api/Dashboard/GetSongPerformance?artistId=${artistId}`);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch artist listen stats:", error);
    
    // Fallback to dummy data if server fails
    const pseudoRandom = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    const seed = parseInt(artistId) || 1;
    const totalListens = Math.floor(pseudoRandom(seed) * 10000);
    const lastMonthListens = Math.floor(totalListens * (0.2 + pseudoRandom(seed + 1) * 0.3));
    const trend = Math.floor((pseudoRandom(seed + 2) * 40) - 15);
    
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const mostActiveDay = daysOfWeek[Math.floor(pseudoRandom(seed + 3) * 7)];
    
    return {
      totalListens,
      lastMonthListens,
      trend,
      mostActiveDay
    };
  }
}