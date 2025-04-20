import React, { useState, useEffect } from 'react';
import AddPlaylist from '../Components/AddPlaylist';
import './../ProfilePage.css';
import './UserPage.css';
import MusicPlayer from "./../Components/MusicPlayer";
import Editable from './../Components/Editable';
import PlaylistSongList from '../Components/PlaylistSongList';
import UserLink from '../../UserLink/UserLink';
import GenreSongList from '../Components/GenreSongList';
import PlaylistSelectionPopup from '../Components/PlaylistSelectionPopup';
import albumAddIcon from './playlist.png';

const ConfirmationModal = ({ isOpen, message, onCancel, onConfirm }) => {
  if (!isOpen) return null;
  
  return (
    <>
      <div className="confirmation-overlay" onClick={onCancel}></div>
      <div className="confirmation-modal">
        <div className="confirmation-header">
          <h3>Confirm Action</h3>
          <button className="confirmation-close-btn" onClick={onCancel}>×</button>
        </div>
        
        <div className="confirmation-content">
          <p>{message}</p>
        </div>
        
        <div className="confirmation-actions">
          <button className="confirmation-cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="confirmation-confirm-btn" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </>
  );
};

const ListenerPage = ({ onSongSelect }) => {
  const [availableGenres, setAvailableGenres] = useState(['R&B', 'Rap', 'Country', 'HipHop', 'Pop', 'Rock','Electronic','Blues','Jazz','Classical','Alternative','Classical','Indie','Metal']);
  const [userGenres, setUserGenres] = useState([]);
  const [showGenreOptions, setGenreOptions] = useState(false);
  const [showAPwindow, setShowAPwindow] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showPlaylistSelection, setShowPlaylistSelection] = useState(false);
  const [currentSongForAction, setCurrentSongForAction] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: "Listener",
    bio: "No bio available",
    profileImage: "https://via.placeholder.com/150",
    followers: 0,
    totalListens: 0
  });
  
  // Create a default album ID for "Saved Songs"
  const defaultAlbumId = 0;
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: '',
    onConfirm: null
  });

  // API constants and user data
  const API_URL = "https://localhost:7152";
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  // Genre mapping
  const genreMap = {
    1: "Pop",
    2: "Rock",
    3: "HipHop",
    4: "R&B",
    5: "Electronic",
    6: "Country",
    7: "Jazz",
    8: "Blues",
    9: "Metal",
    10: "Classical",
    11: "Alternative",
    12: "Indie"
  };

  // Album state - with "Saved Songs" as the first album
  const [albums, setAlbums] = useState([
    { 
      id: defaultAlbumId, 
      name: "Saved Songs",
      image: "https://preview.redd.it/heres-some-playlist-icons-in-the-style-of-liked-songs-you-v0-cahrrr1is8ee1.png?width=320&crop=smart&auto=webp&s=159a0b02328aa4238f0d928549e776146a27cae7",
      songs: []
    }
  ]);
  
  // Set the default album as initially selected
  const [selectedAlbum, setSelectedAlbum] = useState(albums[0]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  
  // Playlist state
  const [playlists, setPlaylists] = useState([]);
  
  // Genre song mapping - songs by genre
  const [genreSongs, setGenreSongs] = useState({
    'R&B': { name: 'R&B', image: 'https://via.placeholder.com/100', songs: [] },
    'Rap': { name: 'Rap', image: 'https://via.placeholder.com/100', songs: [] },
    'Country': { name: 'Country', image: 'https://via.placeholder.com/100', songs: [] },
    'HipHop': { name: 'HipHop', image: 'https://via.placeholder.com/100', songs: [] },
    'Pop': { name: 'Pop', image: 'https://via.placeholder.com/100', songs: [] },
    'Rock': { name: 'Rock', image: 'https://via.placeholder.com/100', songs: [] }
  });
  
  const handleAddToPlaylist = (songToAdd) => {
    setCurrentSongForAction(songToAdd);
    setShowPlaylistSelection(true);
  };
  
  const handleAddSongToPlaylist = (playlistId) => {
    console.log(`Adding song "${currentSongForAction.title}" to playlist ID: ${playlistId}`);
    
    // Here you would make an API call to add the song to the playlist
    
    // For now, just update the state locally
    setPlaylists(prevPlaylists => {
      return prevPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          // Check if the song already exists in the playlist
          const songExists = playlist.songs.some(song => song.id === currentSongForAction.id);
          if (!songExists) {
            return {
              ...playlist,
              songs: [...playlist.songs, currentSongForAction]
            };
          }
        }
        return playlist;
      });
    });
    
    setShowPlaylistSelection(false);
    setCurrentSongForAction(null);
  };

  // Drag state
  const [draggedPlaylist, setDraggedPlaylist] = useState(null);

  // Handler for playlist drag start
  const handlePlaylistDragStart = (e, playlist) => {
    // Don't allow dragging the "Liked Songs" or "Saved Songs" playlist
    if (playlist.name === "Liked Songs" || playlist.name === "Saved Songs") {
      e.preventDefault();
      return;
    }
  
    setDraggedPlaylist(playlist);
    // Set transparent drag image
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
    e.currentTarget.classList.add('dragging');
  };
  
  // Handler for playlist drag over
  const handlePlaylistDragOver = (e, playlistOver) => {
    e.preventDefault();
    if (draggedPlaylist && draggedPlaylist.id !== playlistOver.id) {
      // Don't allow dropping near protected playlists
      if (playlistOver.name === "Liked Songs" || playlistOver.name === "Saved Songs") {
        return;
      }
      
      const playlistsCopy = [...playlists];
      const draggedIndex = playlistsCopy.findIndex(p => p.id === draggedPlaylist.id);
      const targetIndex = playlistsCopy.findIndex(p => p.id === playlistOver.id);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Remove the dragged item
        const [draggedItem] = playlistsCopy.splice(draggedIndex, 1);
        
        // Insert at new position
        playlistsCopy.splice(targetIndex, 0, draggedItem);
        
        // Ensure protected playlists stay at the top
        const likedSongsPlaylist = playlistsCopy.find(p => p.name === "Liked Songs");
        const savedSongsPlaylist = playlistsCopy.find(p => p.name === "Saved Songs");
        const protectedPlaylists = [likedSongsPlaylist, savedSongsPlaylist].filter(Boolean);
        const otherPlaylists = playlistsCopy.filter(p => 
          p.name !== "Liked Songs" && p.name !== "Saved Songs"
        );
        
        setPlaylists([...protectedPlaylists, ...otherPlaylists]);
      }
    }
  };
  
  // Handler for playlist drag end
  const handlePlaylistDragEnd = () => {
    if (draggedPlaylist) {
      document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
      setDraggedPlaylist(null);
    }
  };

  // API Integration - Get User Data
  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        // Extract user ID using the correct claim identifier
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        
        if (userId) {
          setCurrentUserId(userId);
          console.log("User ID extracted:", userId);
          
          GetUserProfile(userId);
          GetSavedSongs(userId);
          GetUserPlaylists(userId);
        } else {
          console.error("Could not find userID in token");
        }
        
        // Username
        const username = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        if (username) {
          setCurrentUsername(username);
        }
        
      } catch (error) {
        console.error("Error parsing JWT token:", error);
      }
    } else {
      console.log("No token found in localStorage");
    }
  }, []);

  useEffect(() => {
    // If songs are loaded and "Saved Songs" is selected, refresh the view
    if (albums[0]?.songs?.length > 0 && selectedAlbum?.id === defaultAlbumId) {
      setSelectedAlbum(albums[0]);
    }
  }, [albums]);

  // API Functions
  const GetUserProfile = (userId) => {
    console.log("Fetching profile data for user ID:", userId);
    
    fetch(`${API_URL}/api/database/GetUserProfile?UserID=${userId}`, {
      method: "GET",
    })
    .then(res => res.json())
    .then(result => {
      console.log("API returned profile data:", result);
      if (result && result.length > 0) {
        const userData = result[0];
        setUserProfile({
          name: userData.Username || "Listener",
          bio: userData.Bio || "No bio available",
          profileImage: userData.ProfilePicture || "https://via.placeholder.com/150",
          followers: result.FollowerCount || 0,
          totalListens: result.TotalListens || 0
        });
      }
    })
    .catch(error => console.error("Error fetching user profile:", error));
  };

  const GetSavedSongs = (userId) => {
    console.log("Getting saved songs for user ID:", userId);
    
    fetch(`${API_URL}/api/database/GetSavedSongs?UserID=${userId}`, {
      method: "GET",
    })
    .then(res => res.json())
    .then(result => {
      console.log("API returned saved songs:", result);
      
      if (result && result.length > 0) {
        const formattedSongs = result.map(song => ({
          id: song.SongID,
          title: song.SongName || "Untitled",
          artist: song.Username || "Unknown Artist",
          genre: genreMap[song.GenreCode] || "Unknown Genre",
          duration: song.Duration || 0,
          image: song.CoverArtFileName || "/likedsongs.jpg",
          album: "Saved Songs",
          songFile: song.SongFileName
        }));
        console.log("Formatted saved songs:", formattedSongs);
        
        setAlbums(prevAlbums => {
          const updatedAlbums = prevAlbums.map(album => {
            if (album.id === defaultAlbumId) {
              console.log("Updating Saved Songs album with", formattedSongs.length, "songs");
              return {
                ...album,
                songs: formattedSongs
              };
            }
            return album;
          });
          
          return updatedAlbums;
        });
        
        // Update genre songs
        updateGenreSongsFromMyLibrary(formattedSongs);
      } else {
        console.log("No saved songs returned from API");
      }
    })
    .catch(error => console.error("Error fetching saved songs:", error));
  };

  const GetUserPlaylists = (UserID) => {
    console.log("Fetching playlists for user ID:", UserID);
  
    fetch(`${API_URL}/api/database/GetUserPlaylists?UserID=${UserID}`, {
      method: "GET",
    })
    .then(res => res.json())
    .then(result => {
      console.log("API returned playlists:", result);
      
      if (result && result.length > 0) {
        const formattedPlaylists = result.map(playlist => ({
          id: playlist.PlaylistID,
          name: playlist.Title || "Untitled",
          image: playlist.PlaylistPicture || "/likedsongs.jpg",
          songs: playlist.Songs || []
        }));
        
        console.log("Formatted playlists:", formattedPlaylists);
        setPlaylists(formattedPlaylists);

        // Get songs for first playlist
        if (formattedPlaylists[0]?.id) {
          GetPlaylistSongs(formattedPlaylists[0].id);
        }
      } else {
        console.log("No playlists returned from API");
      }
    })
    .catch(error => console.error("Error fetching user playlists:", error));
  };

  const GetPlaylistSongs = (playlistId) => {
    console.log("Getting songs for playlist ID:", playlistId);
    
    fetch(`${API_URL}/api/database/GetPlaylistSongs?PlaylistID=${playlistId}`, {
      method: "GET",
    })
    .then(res => res.json())
    .then(result => {
      console.log("API returned playlist songs:", result);
      
      if (result && result.length > 0) {
        const formattedSongs = result.map(song => ({
          id: song.SongID,
          title: song.SongName || "Untitled",
          artist: song.Username || "Unknown Artist",
          genre: genreMap[song.GenreCode] || "Unknown Genre",
          duration: song.Duration || 0,
          image: song.CoverArtFileName || "/likedsongs.jpg",
          album: song.AlbumTitle || "Saved Songs",
          songFile: song.SongFileName
        }));
        
        console.log("Formatted playlist songs:", formattedSongs);
        
        setPlaylists(prevPlaylists => {
          const updatedPlaylists = prevPlaylists.map(playlist => {
            if (playlist.id === playlistId) {
              console.log("Updating playlist with", formattedSongs.length, "songs");
              return {
                ...playlist,
                songs: formattedSongs
              };
            }
            return playlist;
          });
          
          return updatedPlaylists;
        });
      } else {
        console.log("No songs returned for playlist");
      }
    })
    .catch(error => console.error("Error fetching playlist songs:", error));
  };
  
  // Helper function to update genre songs from user library
  const updateGenreSongsFromMyLibrary = (songs) => {
    const newGenreSongs = { ...genreSongs };
    
    // Reset all genre song lists
    Object.keys(newGenreSongs).forEach(genre => {
      newGenreSongs[genre].songs = [];
    });
    
    // Add each song to its genre
    songs.forEach(song => {
      if (song.genre && newGenreSongs[song.genre]) {
        newGenreSongs[song.genre].songs.push(song);
      }
    });
    
    setGenreSongs(newGenreSongs);
  };
  
  // UI Event Handlers
  const handleGenres = (e) => {
    if (e.target.value !== 'close' && e.target.value !== '') {
      setUserGenres([...userGenres, e.target.value]);
      setAvailableGenres(availableGenres.filter((genre) => genre !== e.target.value));
    }
    setGenreOptions(!showGenreOptions);
  };

  const removeGenre = (e) => {
    setAvailableGenres([...availableGenres, e.target.value]);
    setUserGenres(userGenres.filter((genre) => genre !== e.target.value));
  };
  
  // Handle playlist click
  const handlePlaylistClick = (playlist) => {
    console.log("Playlist clicked:", playlist.name);
    setSelectedPlaylist(playlist);
    setSelectedAlbum(null); // Clear selected album when opening a playlist
    setSelectedGenre(null); // Clear selected genre when opening a playlist
    
    // Load songs for the playlist if needed
    GetPlaylistSongs(playlist.id);
  };
  
  const handleAlbumClick = (album) => {
    console.log("Album clicked:", album.name);
    setSelectedAlbum(album);
    setSelectedPlaylist(null); // Clear selected playlist when opening an album
    setSelectedGenre(null); // Clear selected genre when opening an album
  };
  
  const handleGenreClick = (genreName) => {
    console.log("Genre clicked:", genreName);
    if (genreSongs[genreName]) {
      setSelectedGenre(genreSongs[genreName]);
      setSelectedPlaylist(null); // Clear selected playlist when opening a genre
      setSelectedAlbum(null); // Clear selected album when opening a genre
    } else {
      console.log("No songs found for genre:", genreName);
    }
  };

  const handleBackFromPlaylist = () => {
    console.log("Back button clicked from playlist");
    setSelectedPlaylist(null);
    setSelectedAlbum(albums[0]); // Set back to "Saved Songs" album
  };
  
  const handleBackFromGenre = () => {
    console.log("Back button clicked from genre");
    setSelectedGenre(null);
    setSelectedAlbum(albums[0]); // Set back to "Saved Songs" album
  };

  // Handle song deletion from playlist
  const handleDeleteSong = (song, isFromSavedSongs) => {
    console.log("Deleting song:", song.title, "From Saved Songs:", isFromSavedSongs);
    
    setConfirmModal({
      isOpen: true,
      message: `Are you sure you want to remove "${song.title}"? ${isFromSavedSongs ? 'This will remove it from all playlists.' : ''}`,
      onConfirm: () => {
        // Here you would add API call to delete the song
        
        if (isFromSavedSongs) {
          // Delete from all playlists
          // 1. Remove from saved songs
          const updatedAlbums = albums.map(album => ({
            ...album,
            songs: album.songs.filter(s => s.id !== song.id)
          }));
          setAlbums(updatedAlbums);
          
          // 2. Remove from playlists
          const updatedPlaylists = playlists.map(playlist => ({
            ...playlist,
            songs: playlist.songs.filter(s => s.id !== song.id)
          }));
          setPlaylists(updatedPlaylists);
          
          // 3. Remove from genre songs
          const updatedGenreSongs = { ...genreSongs };
          Object.keys(updatedGenreSongs).forEach(genre => {
            updatedGenreSongs[genre] = {
              ...updatedGenreSongs[genre],
              songs: updatedGenreSongs[genre].songs.filter(s => s.id !== song.id)
            };
          });
          setGenreSongs(updatedGenreSongs);
          
        } else {
          // Only remove from current context (playlist or genre)
          if (selectedPlaylist) {
            // Remove from current playlist
            const updatedPlaylists = playlists.map(playlist => {
              if (playlist.id === selectedPlaylist.id) {
                return {
                  ...playlist,
                  songs: playlist.songs.filter(s => s.id !== song.id)
                };
              }
              return playlist;
            });
            
            setPlaylists(updatedPlaylists);
            setSelectedPlaylist(updatedPlaylists.find(p => p.id === selectedPlaylist.id));
          } else if (selectedGenre) {
            // Remove from current genre
            const updatedGenreSongs = { ...genreSongs };
            if (updatedGenreSongs[selectedGenre.name]) {
              updatedGenreSongs[selectedGenre.name] = {
                ...updatedGenreSongs[selectedGenre.name],
                songs: updatedGenreSongs[selectedGenre.name].songs.filter(s => s.id !== song.id)
              };
              setGenreSongs(updatedGenreSongs);
              setSelectedGenre(updatedGenreSongs[selectedGenre.name]);
            }
          }
        }
        
        // Close the confirmation modal
        setConfirmModal({ isOpen: false, message: '', onConfirm: null });
      }
    });
  };

  // Handle playlist deletion
  const handleDeletePlaylist = (e, playlistId) => {
    e.stopPropagation(); // Prevent triggering the click event on the playlist button
    
    // Find the playlist to be deleted
    const playlistToDelete = playlists.find(p => p.id === playlistId);
    
    // Don't allow deletion of first playlist (assuming it's a special one like "Liked Songs")
    if (playlistId === playlists[0]?.id) {
      console.log("Cannot delete the default playlist");
      return;
    }
    
    setConfirmModal({
      isOpen: true,
      message: `Are you sure you want to delete "${playlistToDelete.name}" playlist? This action cannot be undone.`,
      onConfirm: () => {
        // Here you would add API call to delete the playlist
        
        // Remove the playlist from the playlists array
        const updatedPlaylists = playlists.filter(playlist => playlist.id !== playlistId);
        setPlaylists(updatedPlaylists);
        
        // If the deleted playlist was selected, set selected to null
        if (selectedPlaylist && selectedPlaylist.id === playlistId) {
          setSelectedPlaylist(null);
          setSelectedAlbum(albums[0]); // Go back to "Saved Songs" album
        }
        
        console.log(`Playlist "${playlistToDelete.name}" deleted`);
        setConfirmModal({ isOpen: false, message: '', onConfirm: null });
      }
    });
  };

  // Add playlist function  
  const AddPlaylistComponent = (playlistData) => {
    console.log("Making a new playlist: ", playlistData);
    const formData = new FormData();
    formData.append('PlaylistName', playlistData.name);
    formData.append('UserID', currentUserId);
    
    if (playlistData.image) {
      formData.append('PlaylistPicture', playlistData.image);
    } else {
      alert("Please select a picture for the playlist");
      return;
    }
    
    fetch(`${API_URL}/api/database/AddPlaylist`, {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Playlist created successfully:", data);
      // Refresh playlists
      GetUserPlaylists(currentUserId);
    })
    .catch(error => {
      console.error("Error creating playlist:", error);
    });
  };
  
  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, message: '', onConfirm: null });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={userProfile.profileImage}
          alt="Profile"
          className="profile-image"
        />
        <h1 className="profile-name">{userProfile.name}</h1>{/* Profile Name  */}
        {/*  Optional Pronouns */}
        <h3 style={{textAlign:"left",margin:"30px 0px -10px 0px"}}>Profile Description</h3>
        <Editable
            title="Edit Bio"
            value={userProfile.bio}
            div_width="100%"
            div_height="200px"
            backgroundColor="none"
            textColor="white"
            placeholder="Add a Description for your profile..."/>
        
        <div className="stats-container">
          <p className="follower-count">Followers: {userProfile.followers}</p>
          <p className="total-listens">Total Listens: {userProfile.totalListens}</p>
        </div>
        
        <div className="music-container">
          <button className="music-genre" onClick={() => handleGenreClick('R&B')}>R&B</button>
          <button className="music-genre" onClick={() => handleGenreClick('Rap')}>Rap</button>
          <button className="music-genre" onClick={() => handleGenreClick('Country')}>Country</button>
          <button className="music-genre" onClick={() => handleGenreClick('HipHop')}>HipHop</button>
          <button className="music-genre" onClick={() => handleGenreClick('Pop')}>Pop</button>
          <button className="music-genre" onClick={() => handleGenreClick('Rock')}>Rock</button>
        </div>
        
        <div className="playlist-container">
          <div className="section-header">
            <h1>Playlists</h1>
            <div className="drag-instructions">
              <span className="drag-icon">↕</span>
              <span className="drag-text">Drag to reorder</span>
            </div>
          </div>
          
           
            <button className="playlist-button add-btn" onClick={() => setShowAPwindow(true)}>
              <img
                src={albumAddIcon}
                alt="Playlist Cover"
                className="playlist-image"
              />
              <span className="playlist-name"><strong>+ Add Playlist</strong></span>
            </button>
          
          {/* Playlist Modal */}
          <AddPlaylist
            isOpen={showAPwindow}
            onClose={() => setShowAPwindow(false)}
            onSubmit={AddPlaylistComponent}
          />
          
          {playlists.map(playlist => {
            const isProtectedPlaylist = playlist.name === "Liked Songs" || playlist.name === "Saved Songs";
            
            return (
              <div 
                key={playlist.id} 
                className={`playlist-button ${selectedPlaylist && selectedPlaylist.id === playlist.id ? 'selected' : ''} ${isProtectedPlaylist ? 'protected-item' : ''}`}
                draggable={!isProtectedPlaylist}
                onDragStart={(e) => handlePlaylistDragStart(e, playlist)}
                onDragOver={(e) => handlePlaylistDragOver(e, playlist)}
                onDragEnd={handlePlaylistDragEnd}
                onClick={() => handlePlaylistClick(playlist)}
              >
                {!isProtectedPlaylist && (
                  <div className="drag-handle">
                    <span className="drag-dots">⋮⋮</span>
                  </div>
                )}
                <img
                  src={playlist.image}
                  alt={`${playlist.name} Cover`}
                  className="playlist-image"
                />
                <span className="playlist-name">{playlist.name}</span>
                
                {/* Only show delete button if not "Liked Songs" playlist */}
                {!isProtectedPlaylist && (
                  <button 
                    className="delete-button"
                    onClick={(e) => handleDeletePlaylist(e, playlist.id)}
                    title="Delete playlist"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Playlist Songs Display */}
      {selectedPlaylist && (
        <>
          {/* Place the back button inside the PlaylistSongList or right before it */}
          <div className="playlist-content-area">
            <div className="styled-back-button" onClick={handleBackFromPlaylist}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
              </svg>
              <span>Back to Saved Songs</span>
            </div>
            
            <PlaylistSongList 
              songs={selectedPlaylist.songs} 
              playlistName={selectedPlaylist.name}
              playlistImage={selectedPlaylist.image}
              onSongSelect={onSongSelect}
              onDeleteSong={handleDeleteSong}
              onAddToPlaylist={handleAddToPlaylist}
            />
          </div>
        </>
      )}

      {selectedAlbum && (
        <>
          <PlaylistSongList 
            songs={selectedAlbum.songs} 
            playlistName={selectedAlbum.name}
            playlistImage={selectedAlbum.image}
            onSongSelect={onSongSelect}
            onDeleteSong={handleDeleteSong}
            isSavedSongs={selectedAlbum.id === defaultAlbumId}
            onAddToPlaylist={handleAddToPlaylist}
          />
        </>
      )}
        
      {/* Genre Songs Display */}
      {selectedGenre && (
        <>
        {/* Place the back button inside the PlaylistSongList or right before it */}
        <div className="playlist-content-area">
          <div className="styled-back-button" onClick={handleBackFromGenre}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
            </svg>
            <span>Back to Saved Songs</span>
          </div>
          <GenreSongList 
            songs={selectedGenre.songs} 
            playlistName={selectedGenre.name}
            playlistImage={selectedGenre.image}
            onSongSelect={onSongSelect}
          />
        </div>
        </>
      )}
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        onCancel={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
      />
      
      {showPlaylistSelection && (
        <PlaylistSelectionPopup 
          onClose={() => setShowPlaylistSelection(false)}
          playlists={playlists}
          onAddToPlaylist={handleAddSongToPlaylist}
          currentSong={currentSongForAction}
        />
      )}
    </div>
  );
};

export default ListenerPage;