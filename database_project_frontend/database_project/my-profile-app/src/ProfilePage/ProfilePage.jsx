import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import PlaylistSongList from './Components/PlaylistSongList';
import AlbumSongList from './Components/AlbumSongList';
import GenreSongList from './Components/GenreSongList';
import { useUserContext } from '../LoginContext/UserContext';

const API_URL = "http://localhost:5142"; // Replace with your actual API URL

const ProfilePage = ({ onSongSelect }) => {
  const navigate = useNavigate();
  const { username } = useParams(); // Get the username from URL params
  const { user } = useUserContext(); // Get the current logged-in user
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [userProfile, setUserProfile] = useState({
    userId: null,
    artistId: null,  // Add artistId to the state
    name: "",
    bio: "",
    profileImage: "",
    followers: 0,
    totalListens: 0
  });

  // Create a default album ID for "Their Songs"
  const defaultAlbumId = 0;
  
  // State for artist content
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [genreSongs, setGenreSongs] = useState({});
  
  // Define isOwnProfile variable to use throughout the component - MOVED UP HERE
  const isOwnProfile = username === user?.UserName;
  
  // Now define all the handler functions that depend on isOwnProfile
  const handleDeleteSong = isOwnProfile ? undefined : () => console.log("Delete operation not allowed on other profiles");
  const handleAddToPlaylist = isOwnProfile ? undefined : () => console.log("Add to playlist operation not allowed on other profiles");
  const handleAddToAlbum = isOwnProfile ? undefined : () => console.log("Add to album operation not allowed on other profiles");
  const handleRemoveFromPlaylist = isOwnProfile ? undefined : () => console.log("Remove from playlist operation not allowed on other profiles");

  // Check if viewing own profile and redirect if needed
  useEffect(() => {
    if (user && username && user.Username === username) {
      console.log("Viewing own profile, redirecting to editable profile");
      navigate('/profile');
    }
  }, [user, username, navigate]);

  // Update the formatDuration function
const formatDuration = (input) => {
  // Handle undefined or null
  if (input === undefined || input === null) {
    return "0:00";
  }
  
  // If input is already in MM:SS format (string), return it
  if (typeof input === 'string' && input.includes(':')) {
    return input;
  }
  
  // If input is a string that doesn't contain ":", try to parse it as a number
  let seconds;
  if (typeof input === 'string') {
    seconds = parseFloat(input);
  } else if (typeof input === 'number') {
    seconds = input;
  } else {
    return "0:00"; // Invalid input
  }
  
  // Handle NaN
  if (isNaN(seconds)) {
    return "0:00";
  }
  
  // Handle numeric input (seconds)
  if (seconds > 0) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
  
  // Default fallback
  return "0:00";
};

  // Helper function for consistent song object formatting
  const formatSongObject = (song, defaultArtistName) => {
    // Genre mapping
    const genreMap = {
      1: "Pop", 2: "Rock", 3: "HipHop", 4: "R&B", 5: "Electronic",
      6: "Country", 7: "Jazz", 8: "Blues", 9: "Metal", 10: "Classical",
      11: "Alternative", 12: "Indie"
    };
    
    // Extract genre with fallbacks
    let genre = "Unknown";
    if (song.Genre) {
      genre = song.Genre;
    } else if (song.genre) {
      genre = song.genre;
    } else if (song.SongGenre) {
      genre = song.SongGenre;
    } else if (song.GenreCode && genreMap[song.GenreCode]) {
      genre = genreMap[song.GenreCode];
    }
    
    // Process duration
let duration = "0:00";
if (typeof song.Duration === 'string' && song.Duration.includes(':')) {
  duration = song.Duration; // Already formatted as MM:SS
} else if (song.Duration !== undefined) {
  duration = formatDuration(song.Duration);
} else if (song.duration !== undefined) {
  // Check if it's already formatted
  if (typeof song.duration === 'string' && song.duration.includes(':')) {
    duration = song.duration;
  } else {
    duration = formatDuration(song.duration);
  }
} else if (song.SongDuration !== undefined) {
  duration = formatDuration(song.SongDuration);
}
    // Create and return the formatted song object
    return {
      id: song.SongID || song.Id || song.songId || song.id,
      title: song.SongName || song.Title || song.title || "Untitled",
      artist: song.Username || song.ArtistName || song.artist || defaultArtistName,
      genre: genre,
      duration: duration,
      image: song.CoverArtFileName || song.CoverArt || song.image || "https://placehold.co/40x40/101010/white?text=Song",
      album: song.AlbumTitle || song.AlbumName || song.album || "Their Songs",
      songSrc: song.SongFileName || song.AudioFile || song.url || song.songSrc
    };
  };

  // Fetch artist data once component mounts and username is available
  useEffect(() => {
    if (username) {
      loadArtistData(username);
    }
  }, [username]);

  // Main function to load all artist data
  const loadArtistData = async (artistUsername) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Try to get the user directly
      let artistId;
      let userId;
      let artistName;
      
      try {
        // Use GetUserByName endpoint
        const userResponse = await fetch(`${API_URL}/api/Users/GetUserByName?name=${encodeURIComponent(artistUsername)}`);
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          userId = userData.UserID;
          artistId = userData.ArtistID;  // Store the ArtistID separately
          artistName = userData.Username;
        } else {
          // Fall back to GetUsers and filter
          // ...existing fallback code...
        }
      } catch (error) {
        console.error("Error finding user:", error);
        throw new Error(`Could not find user "${artistUsername}"`);
      }
      
      if (!userId) {
        throw new Error("Invalid user ID returned");
      }
      
      // 2. Load user profile data with both IDs
      await loadUserProfile(userId, artistId, artistName);
      
      // 3. Load user's songs, albums, and playlists
      await Promise.all([
        loadArtistSongs(userId),
        loadArtistPlaylists(userId),
        loadArtistAlbums(userId)
      ]);
      
      // 4. Check if current user is following this artist (using artistId)
      if (user && user.UserID && artistId) {
        checkFollowStatus(user.UserID, artistId);
      }
    } catch (err) {
      console.error("Error loading artist data:", err);
      setError(`Failed to load artist profile: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user profile data - updated with correct endpoint
  const loadUserProfile = async (userId, artistId, artistUsername) => {
    try {
      // Since GetUserProfile endpoints aren't available, try to use the information from GetUserByName
      // which we already have from loadArtistData
      
      // Get follow stats to get follower count if possible
      let followerCount = 0;
      try {
        const followStatsResponse = await fetch(`${API_URL}/api/Follow/GetArtistFollowStats?artistId=${artistId}`);
        if (followStatsResponse.ok) {
          const followStats = await followStatsResponse.json();
          followerCount = followStats.FollowerCount || 0;
        }
      } catch (error) {
        console.warn("Could not get artist follow stats");
      }
      
      setUserProfile({
        userId: userId,
        artistId: artistId,  // Store the artistId
        name: artistUsername || "Artist",
        bio: "Artist on Music App",
        profileImage: "https://placehold.co/150x150/101010/white?text=Artist",
        followers: followerCount,
        totalListens: 0
      });
    } catch (err) {
      console.error("Error loading user profile:", err);
      // Provide fallback so the page can still render
      setUserProfile({
        userId: userId,
        artistId: artistId,  // Store the artistId in fallback too
        name: artistUsername || "Artist",
        bio: "Artist on Music App",
        profileImage: "https://placehold.co/150x150/101010/white?text=Artist",
        followers: 0,
        totalListens: 0
      });
    }
  };
  // Updated loadArtistSongs function
  const loadArtistSongs = async (artistId) => {
    try {
      console.log("Fetching songs for artist ID:", artistId);
      
      const songsResponse = await fetch(`${API_URL}/api/database/GetSongs?UserID=${artistId}`);
      if (!songsResponse.ok) {
        const errorText = await songsResponse.text();
        throw new Error(`Failed to fetch songs: ${songsResponse.status} - ${errorText}`);
      }
      
      const songsData = await songsResponse.json();
      console.log("Raw song data from API:", songsData); 
      
      // Use the helper function for consistent formatting
      const formattedSongs = songsData.map(song => formatSongObject(song, username));
      
      console.log("Formatted songs:", formattedSongs);
      
      // Create "Their Songs" album with all songs
      const theirSongsAlbum = {
        id: defaultAlbumId,
        name: "Their Songs",
        image: formattedSongs.length > 0 && formattedSongs[0].image ? 
               formattedSongs[0].image : 
               "https://placehold.co/100x100/101010/white?text=Songs",
        songs: formattedSongs
      };
      
      setAlbums(prev => [theirSongsAlbum]);
      
      // If we have songs, select the "Their Songs" album by default
      if (formattedSongs.length > 0) {
        setSelectedAlbum(theirSongsAlbum);
      }
      
      // Organize songs by genre
      const songsByGenre = {};
formattedSongs.forEach(song => {
  if (!song.genre || song.genre === "Unknown") return;
  
  if (!songsByGenre[song.genre]) {
    songsByGenre[song.genre] = {
      name: song.genre,
      image: formattedSongs.find(s => s.genre === song.genre && s.image)?.image || 
             `https://placehold.co/100x100/101010/white?text=${encodeURIComponent(song.genre)}`,
      songs: []
    };
  }
  
  // Add debug logging to check duration before adding to genreSongs
  console.log(`Adding song "${song.title}" to genre ${song.genre} with duration: ${song.duration}`);
  
  // Make sure the song has valid duration
  const songWithValidDuration = {
    ...song,
    duration: song.duration || "0:00" // Ensure duration exists
  };
  
  songsByGenre[song.genre].songs.push(songWithValidDuration);
});
console.log("Final genre songs structure:", songsByGenre);
setGenreSongs(songsByGenre);
      
      setGenreSongs(songsByGenre);
    } catch (err) {
      console.error("Error loading artist songs:", err);
      // Set empty default album if songs can't be loaded
      setAlbums([{
        id: defaultAlbumId,
        name: "Their Songs",
        image: "https://placehold.co/100x100/101010/white?text=Songs",
        songs: []
      }]);
      setSelectedAlbum({
        id: defaultAlbumId,
        name: "Their Songs",
        image: "https://placehold.co/100x100/101010/white?text=Songs",
        songs: []
      });
    }
  };

  // Load artist's playlists
  const loadArtistPlaylists = async (artistId) => {
    try {
      const playlistsResponse = await fetch(`${API_URL}/api/database/GetUserPlaylists?UserID=${artistId}`);
      if (!playlistsResponse.ok) throw new Error("Failed to fetch playlists");
      
      const playlistsData = await playlistsResponse.json();
      
      // Transform playlists data
      const formattedPlaylists = playlistsData.map(playlist => ({
        id: playlist.PlaylistID,
        name: playlist.Title || "Untitled Playlist",
        image: playlist.PlaylistPicture || "https://placehold.co/100x100/101010/white?text=Playlist",
        songs: []  // Will load songs when playlist is clicked
      }));
      
      setPlaylists(formattedPlaylists);
      
    } catch (err) {
      console.error("Error loading playlists:", err);
      setPlaylists([]);
    }
  };

  // Load artist's albums
  const loadArtistAlbums = async (artistId) => {
    try {
      const albumsResponse = await fetch(`${API_URL}/api/database/GetUserAlbums?UserID=${artistId}`);
      if (!albumsResponse.ok) throw new Error("Failed to fetch albums");
      
      const albumsData = await albumsResponse.json();
      
      // Transform albums data
      const formattedAlbums = albumsData.map(album => ({
        id: album.AlbumID,
        name: album.Title || "Untitled Album",
        image: album.AlbumCoverArtFileName || "https://placehold.co/100x100/101010/white?text=Album",
        songs: [] // Will load songs when album is selected
      }));
      
      // Load songs for each album immediately
      for (const album of formattedAlbums) {
        try {
          const albumSongsResponse = await fetch(`${API_URL}/api/database/GetAlbumSongs?AlbumID=${album.id}`);
          if (albumSongsResponse.ok) {
            const albumSongsData = await albumSongsResponse.json();
            album.songs = albumSongsData.map(song => formatSongObject(song, username));
          }
        } catch (err) {
          console.error(`Error loading songs for album ${album.id}:`, err);
        }
      }
      
      // Keep "Their Songs" album at the beginning
      setAlbums(prev => {
        const theirSongsAlbum = prev.find(a => a.id === defaultAlbumId);
        return theirSongsAlbum ? [theirSongsAlbum, ...formattedAlbums] : [...prev, ...formattedAlbums];
      });
      
    } catch (err) {
      console.error("Error loading albums:", err);
      // Keep existing albums state
    }
  };

  // Check if current user is following the artist
  const checkFollowStatus = async (currentUserId, artistId) => {
    try {
      console.log(`Checking if user ${currentUserId} follows artist ${artistId}`);
      
      // Use the GetUserFollowStats endpoint to get all artists the user is following
      const response = await fetch(`${API_URL}/api/Follow/GetUserFollowStats?userId=${currentUserId}`);
      
      if (!response.ok) {
        console.warn("Failed to get user follow stats");
        setIsFollowing(false);
        return;
      }
      
      const data = await response.json();
      console.log("Follow stats data:", data);
      
      // Check if the current artist is in the list of followed artists
      if (data && data.FollowingArtists && Array.isArray(data.FollowingArtists)) {
        // Check for match by ArtistID or Id
        const isFollowed = data.FollowingArtists.some(
          artist => 
            (artist.ArtistID === artistId || artist.Id === artistId) ||
            (artist.ArtistName && artist.ArtistName.toLowerCase() === username.toLowerCase())
        );
        
        setIsFollowing(isFollowed);
        console.log(`User ${currentUserId} is${isFollowed ? '' : ' not'} following artist ${artistId}`);
      } else {
        console.warn("Invalid follow stats data format");
        setIsFollowing(false);
      }
    } catch (err) {
      console.error("Error checking follow status:", err);
      setIsFollowing(false);
    }
  };

  // Update handleFollowToggle to use artistId
  const handleFollowToggle = async () => {
    if (!user || !user.UserID || !userProfile.artistId) {
      console.error("Cannot follow/unfollow: missing user ID or artist ID", {
        currentUserID: user?.UserID,
        artistID: userProfile?.artistId  // Changed to artistId
      });
      return;
    }
  
    // 🔍 DEBUG: log exactly which IDs we're sending
    console.log("▶️ FollowToggle – currentUserID:", user.UserID, "targetArtistID:", userProfile.artistId);
  
    try {
      // Choose endpoint based on current follow state
      const endpoint = isFollowing
        ? `${API_URL}/api/Follow/Unfollow`
        : `${API_URL}/api/Follow/AddFollow`;
  
      // Build the request payload
      const requestBody = {
        UserID: user.UserID,            // your account ID
        ArtistID: userProfile.artistId  // Changed to use artistId instead of userId
      };
  
      console.log(`🔄 ${isFollowing ? 'Unfollow' : 'Follow'} payload:`, requestBody);
  
      // Send the request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      console.log(`API Response Status: ${response.status} ${response.statusText}`);
  
      if (response.ok) {
        // Optionally parse JSON
        try {
          const data = await response.json().catch(() => ({}));
          console.log("✅ Follow/Unfollow API JSON response:", data);
        } catch { /* no JSON */ }
  
        console.log(`✅ ${isFollowing ? 'Unfollow' : 'Follow'} successful`);
  
        // Update local state
        setIsFollowing(!isFollowing);
        setUserProfile(prev => {
          const newCount = isFollowing
            ? Math.max(0, prev.followers - 1)
            : prev.followers + 1;
          console.log(`📊 Updated follower count: ${prev.followers} → ${newCount}`);
          return { ...prev, followers: newCount };
        });
  
        // Notify other components/tabs
        const ts = Date.now().toString();
        localStorage.setItem('followingUpdated', ts);
        console.log("🔔 Set followingUpdated:", ts);
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('followStatusChanged', {
          detail: {
            artistId: userProfile.artistId,  // Changed from userId to artistId
            artistName: userProfile.name,
            isNowFollowing: !isFollowing
          }
        }));
      } else {
        const errorText = await response.text().catch(() => "Could not read error response");
        console.error(`❌ Failed to ${isFollowing ? 'unfollow' : 'follow'}: Status ${response.status}`, errorText);
      }
    } catch (err) {
      console.error("❌ Exception during follow/unfollow:", err);
    }
  };
  

  // Load songs for a selected playlist
  const loadPlaylistSongs = async (playlistId) => {
    try {
      const response = await fetch(`${API_URL}/api/database/GetPlaylistSongs?PlaylistID=${playlistId}`);
      if (!response.ok) throw new Error("Failed to fetch playlist songs");
      
      const songsData = await response.json();
      console.log("Raw playlist song data:", songsData);
      
      // Use helper function for consistent formatting
      const formattedSongs = songsData.map(song => formatSongObject(song, "Unknown Artist"));
      
      // Update playlists with the loaded songs
      setPlaylists(prev => 
        prev.map(p => p.id === playlistId ? { ...p, songs: formattedSongs } : p)
      );
      
      // Update selected playlist if it's the one we just loaded
      if (selectedPlaylist && selectedPlaylist.id === playlistId) {
        setSelectedPlaylist(prev => ({ ...prev, songs: formattedSongs }));
      }
      
    } catch (err) {
      console.error("Error loading playlist songs:", err);
    }
  };
  
  // Load songs for a selected album
  const loadAlbumSongs = async (albumId) => {
    try {
      const response = await fetch(`${API_URL}/api/database/GetAlbumSongs?AlbumID=${albumId}`);
      if (!response.ok) throw new Error("Failed to fetch album songs");
      
      const songsData = await response.json();
      console.log("Raw album song data:", songsData);
      
      // Use helper function for consistent formatting
      const formattedSongs = songsData.map(song => formatSongObject(song, "Unknown Artist"));
      
      // Update albums with the loaded songs
      setAlbums(prev => 
        prev.map(a => a.id === albumId ? { ...a, songs: formattedSongs } : a)
      );
      
      // Update selected album if it's the one we just loaded
      if (selectedAlbum && selectedAlbum.id === albumId) {
        setSelectedAlbum(prev => ({ ...prev, songs: formattedSongs }));
      }
      
    } catch (err) {
      console.error("Error loading album songs:", err);
    }
  };

  // Handle playlist click
  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
    setSelectedAlbum(null);
    setSelectedGenre(null);
    
    // Load songs for this playlist if not already loaded
    if (playlist.id && (!playlist.songs || playlist.songs.length === 0)) {
      loadPlaylistSongs(playlist.id);
    }
  };
  
  // Handle album click
  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setSelectedPlaylist(null);
    setSelectedGenre(null);
    
    // Load songs for this album if not already loaded
    if (album.id !== defaultAlbumId && (!album.songs || album.songs.length === 0)) {
      loadAlbumSongs(album.id);
    }
  };
  
  // Handle genre click
  const handleGenreClick = (genreName) => {
    if (genreSongs[genreName]) {
      setSelectedGenre(genreSongs[genreName]);
      setSelectedPlaylist(null);
      setSelectedAlbum(null);
    }
  };

  // Handle back buttons
  const handleBackFromPlaylist = () => {
    setSelectedPlaylist(null);
    setSelectedAlbum(albums.find(album => album.id === defaultAlbumId) || null);
  };
  
  const handleBackFromGenre = () => {
    setSelectedGenre(null);
    setSelectedAlbum(albums.find(album => album.id === defaultAlbumId) || null);
  };
  
  const handleBackFromAlbum = (album) => {
    if (album.id !== defaultAlbumId) {
      setSelectedAlbum(albums.find(album => album.id === defaultAlbumId) || null);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading artist profile...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => loadArtistData(username)}>Retry</button>
      </div>
    );
  }
  
  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={userProfile.profileImage}
          alt={`${userProfile.name}'s profile`}
          className="profile-image"
        />
        <h1 className="profile-name">{userProfile.name}</h1>
        
        <p className="profile-bio">
          {userProfile.bio}
        </p>
        
        <div className="stats-container">
          <p className="follower-count">Followers: {userProfile.followers}</p>
        </div>
        
        {user && user.UserID !== userProfile.userId && (
          <button 
            className={`follow-button ${isFollowing ? 'following' : ''}`}
            onClick={handleFollowToggle}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
        
        <div className="music-container">
          {Object.keys(genreSongs).map(genre => (
            <button 
              key={genre}
              className="music-genre" 
              onClick={() => handleGenreClick(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="playlist-container">
          <div className="section-header">
            <h1>Playlists</h1>
          </div>
          
          {playlists.length > 0 ? (
            playlists.map(playlist => (
              <div 
                key={playlist.id} 
                className={`playlist-button ${selectedPlaylist && selectedPlaylist.id === playlist.id ? 'selected' : ''}`}
                onClick={() => handlePlaylistClick(playlist)}
              >
                <img
                  src={playlist.image}
                  alt={`${playlist.name} Cover`}
                  className="playlist-image"
                />
                <span className="playlist-name">{playlist.name}</span>
              </div>
            ))
          ) : (
            <p className="no-content-message">No public playlists available</p>
          )}
        </div>

        <hr style={{backgroundColor:"white", width:"100%"}}></hr>

        <div className="playlist-container">
          <div className="section-header">
            <h1>Albums</h1>
          </div>
          
          {albums.map(album => (
            <div 
              key={album.id} 
              className={`playlist-button ${selectedAlbum && selectedAlbum.id === album.id ? 'selected' : ''}`}
              onClick={() => handleAlbumClick(album)}
            >
              <img
                src={album.image}
                alt={`${album.name} Cover`}
                className="playlist-image"
              />
              <span className="playlist-name">{album.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Playlist Songs Display */}
      {selectedPlaylist && (
        <>
          <div 
            className="styled-back-button"
            onClick={handleBackFromPlaylist}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
            </svg>
            <span>Back to playlists</span>
          </div>
          
          <PlaylistSongList 
  songs={selectedPlaylist.songs} 
  playlistName={selectedPlaylist.name}
  playlistImage={selectedPlaylist.image}
  onDeleteFromPlaylist={handleRemoveFromPlaylist}
  isOwnProfile={isOwnProfile} // Use the variable we defined above
/>
        </>
      )}

      {selectedAlbum && (
        <>
          {/* Only show back button if not the "Their Songs" album */}
          {selectedAlbum.id !== defaultAlbumId && (
            <div 
              className="styled-back-button"
              onClick={() => handleBackFromAlbum(selectedAlbum)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
              </svg>
              <span>Back to albums</span>
            </div>
          )}
          
          <AlbumSongList
  songs={selectedAlbum.songs}
  playlistName={selectedAlbum.name}
  playlistImage={selectedAlbum.image}
  onDeleteSong={handleDeleteSong}
  isMyAlbum={selectedAlbum.id === defaultAlbumId}
  onAddToPlaylist={handleAddToPlaylist}
  onAddToAlbum={handleAddToAlbum}
  isOwnProfile={isOwnProfile} // Use the variable we defined above
/>
        </>
      )}
      
      {/* Genre Songs Display */}
      {selectedGenre && (
        <>
          <div 
            className="styled-back-button"
            onClick={handleBackFromGenre}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
            </svg>
            <span>Back to genres</span>
          </div>
          
          <GenreSongList 
  songs={selectedGenre.songs} 
  playlistName={selectedGenre.name}
  playlistImage={selectedGenre.image}
  onSongSelect={onSongSelect}
  isOwnProfile={isOwnProfile} // Use the variable we defined above
/>
        </>
      )}
    </div>
  );
};

export default ProfilePage;