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

    // First track the listen locally (this always works even offline)
    let playCount = songTracker.trackLocalPlay(songId, songData);

    // If we have a user ID, track the listen on the server too
    if (userId) {
      try {
        console.log(`Sending listen event to server for song ${songId} by user ${userId}`);
        
        const response = await fetch(LISTEN_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            SongID: songId,
            UserID: userId,
            Timestamp: new Date().toISOString()
          })
        });
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status} ${response.statusText}`);
        }
        
        // If the server responds with a count, use that instead
        try {
          const data = await response.json();
          if (data && typeof data.count === 'number') {
            playCount = data.count;
            console.log(`Server provided updated listen count: ${playCount}`);
          }
        } catch (parseError) {
          // If JSON parsing fails, just keep using our local count
          console.debug("Could not parse listen count from server response");
        }
        
        console.log(`✅ Server recorded listen for "${songData.name}" (ID: ${songId})`);
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
 * Note: Currently returns dummy data since the endpoint doesn't exist
 * @param {string|number} artistId 
 * @returns {Promise<Object>} Listen statistics
 */
export async function getArtistListenStats(artistId) {
  // This would normally fetch from an API, but since the endpoint doesn't exist,
  // we'll generate consistent mock data based on the artist ID
  
  // This is a deterministic random number generator based on artistId
  const pseudoRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  // Generate statistics based on artistId to ensure consistent values
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