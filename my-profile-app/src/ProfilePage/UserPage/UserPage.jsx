import React, { useState, useEffect } from 'react';
import AddAlbum from '../Components/AddAlbum';
import './../ProfilePage.css';
import './UserPage.css';
import MusicPlayer from "./../Components/MusicPlayer";
import Editable from './../Components/Editable';
import AddPlaylist from '../Components/AddPlaylist';
import PlaylistSongList from '../Components/PlaylistSongList';
import UserLink from '../../UserLink/UserLink';
import AlbumSongList from '../Components/AlbumSongList';
import GenreSongList from '../Components/GenreSongList';
import AddSongModal from './AddSongModal';
import PlaylistSelectionPopup from '../Components/PlaylistSelectionPopup';
import AlbumSelectionPopup from '../Components/AlbumSelectionPopup';
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

const SongContextMenu = ({ song, onClose, onAddToPlaylist, onRemoveFromPlaylist, onAddToAlbum, onRemoveFromAlbum }) => {
  // Get current context from song properties
  const inPlaylist = song.inPlaylist || false;
  const inAlbum = song.inAlbum || false;
  const isInMyAlbum = song.isInMyAlbum || false;
  
  return (
    <div className="context-menu">
      {/* Always show Add to playlist option */}
      <div className="menu-item" onClick={() => {
        onAddToPlaylist(song);
        onClose();
      }}>
        <span className="icon">📝</span>
        <span>Add to playlist</span>
      </div>
      
      {/* Show Remove from playlist only if in a playlist */}
      {inPlaylist && (
        <div className="menu-item" onClick={() => {
          onRemoveFromPlaylist(song, song.playlistId);
          onClose();
        }}>
          <span className="icon">🗑️</span>
          <span>Remove from playlist</span>
        </div>
      )}
      
      {/* Show Add to album option if not in My Songs album */}
      {!isInMyAlbum && (
        <div className="menu-item" onClick={() => {
          onAddToAlbum(song);
          onClose();
        }}>
          <span className="icon">💿</span>
          <span>Add to album</span>
        </div>
      )}
      
      {/* Show Remove from album only if in an album (not My Songs) */}
      {inAlbum && (
        <div className="menu-item" onClick={() => {
          onRemoveFromAlbum(song, song.albumId);
          onClose();
        }}>
          <span className="icon">🗑️</span>
          <span>Remove from album</span>
        </div>
      )}
    </div>
  );
};

const UserPage = ({ onSongSelect }) => {
  const [availableGenres, setAvailableGenres] = useState(['R&B', 'Rap', 'Country', 'HipHop', 'Pop', 'Rock','Electronic','Blues','Jazz','Classical','Alternative','Classical','Indie','Metal']);
  const [userGenres, setUserGenres] = useState([]);
  const [showGenreOptions, setGenreOptions] = useState(false);
  const [showAPwindow, setShowAPwindow] = useState(false);
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [role, setRole] = useState('artist');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [showPlaylistSelection, setShowPlaylistSelection] = useState(false);
  const [showAlbumSelection, setShowAlbumSelection] = useState(false);
  const [currentSongForAction, setCurrentSongForAction] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: "User",
    bio: "No bio available",
    profileImage: "https://via.placeholder.com/150",
    followers: 0,
    totalListens: 0
  });
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  
  // Create a default album ID for "My Songs"
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

  // Album state - with "My Songs" as the first album
  const [albums, setAlbums] = useState([
    { 
      id: defaultAlbumId, 
      name: "My Songs",
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
  
  const handleAddToAlbum = (songToAdd) => {
    setCurrentSongForAction(songToAdd);
    setShowAlbumSelection(true);
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

  const handleAddSongToAlbum = (albumId) => {
    console.log(`Adding song "${currentSongForAction.title}" to album ID: ${albumId}`);
    
    // Here you would make an API call to add the song to the album
    
    // For now, just update the state locally
    setAlbums(prevAlbums => {
      return prevAlbums.map(album => {
        if (album.id === albumId) {
          // Check if the song already exists in the album
          const songExists = album.songs.some(song => song.id === currentSongForAction.id);
          if (!songExists) {
            return {
              ...album,
              songs: [...album.songs, currentSongForAction]
            };
          }
        }
        return album;
      });
    });
    
    setShowAlbumSelection(false);
    setCurrentSongForAction(null);
  };
  
  // Drag state
  const [draggedPlaylist, setDraggedPlaylist] = useState(null);
  const [draggedAlbum, setDraggedAlbum] = useState(null);

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
  
  // Handler for album drag start
  const handleAlbumDragStart = (e, album) => {
    // Don't allow "My Songs" album to be dragged
    if (album.id === defaultAlbumId) {
      e.preventDefault();
      return;
    }
  
    setDraggedAlbum(album);
    // Set transparent drag image
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
    e.currentTarget.classList.add('dragging');
  };
  
  // Handler for album drag over
  const handleAlbumDragOver = (e, albumOver) => {
    e.preventDefault();
    if (draggedAlbum && draggedAlbum.id !== albumOver.id) {
      // Don't allow dropping on "My Songs" album
      if (albumOver.id === defaultAlbumId) {
        return;
      }
      
      const albumsCopy = [...albums];
      const draggedIndex = albumsCopy.findIndex(a => a.id === draggedAlbum.id);
      const targetIndex = albumsCopy.findIndex(a => a.id === albumOver.id);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Remove the dragged item
        const [draggedItem] = albumsCopy.splice(draggedIndex, 1);
        
        // Insert at new position
        albumsCopy.splice(targetIndex, 0, draggedItem);
        
        // Ensure "My Songs" album is always first
        const myAlbum = albumsCopy.find(a => a.id === defaultAlbumId);
        const otherAlbums = albumsCopy.filter(a => a.id !== defaultAlbumId);
        
        if (myAlbum) {
          setAlbums([myAlbum, ...otherAlbums]);
        } else {
          setAlbums(albumsCopy);
        }
      }
    }
  };
  
  // Handler for album drag end
  const handleAlbumDragEnd = () => {
    if (draggedAlbum) {
      document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
      setDraggedAlbum(null);
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
          GetSongs(userId);
          GetUserPlaylists(userId);
          GetUserAlbums(userId);
        } else {
          console.error("Could not find userID in token");
        }
        
        // Username
        const username = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        if (username) {
          setCurrentUsername(username);
        }
        
        // Check if user is an artist
        const isArtist = payload.IsArtist === "True";
        setRole(isArtist ? 'artist' : 'user');
        
      } catch (error) {
        console.error("Error parsing JWT token:", error);
      }
    } else {
      console.log("No token found in localStorage");
    }
  }, []);

  useEffect(() => {
    // If songs are loaded and "My Songs" is selected, refresh the view
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
          name: userData.Username || "User",
          bio: userData.Bio || "No bio available",
          profileImage: userData.ProfilePicture || "https://via.placeholder.com/150",
          followers: result.FollowerCount || 0,
          totalListens: result.TotalListens || 0
        });
      }
    })
    .catch(error => console.error("Error fetching user profile:", error));
  };

  const GetSongs = (userId) => {
    console.log("Getting songs for user ID:", userId);
    
    fetch(`${API_URL}/api/database/GetSongs?UserID=${userId}`, {
      method: "GET",
    })
    .then(res => res.json())
    .then(result => {
      console.log("API returned songs:", result);
      
      if (result && result.length > 0) {
        const formattedSongs = result.map(song => ({
          id: song.SongID,
          title: song.SongName || "Untitled",
          artist: song.Username || currentUsername,
          genre: genreMap[song.GenreCode] || "Unknown Genre",
          duration: song.Duration || 0,
          image: song.CoverArtFileName || "/likedsongs.jpg",
          album: "My Songs",
          songFile: song.SongFileName
        }));
        console.log("Formatted songs:", formattedSongs);
        
        setAlbums(prevAlbums => {
          const updatedAlbums = prevAlbums.map(album => {
            if (album.id === defaultAlbumId) {
              console.log("Updating My Songs album with", formattedSongs.length, "songs");
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
        console.log("No songs returned from API");
      }
    })
    .catch(error => console.error("Error fetching user songs:", error));
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

  const GetUserAlbums = (userId) => {
    console.log("Fetching albums for user ID:", userId);
  
    fetch(`${API_URL}/api/database/GetUserAlbums?UserID=${userId}`, {
      method: "GET",
    })
    .then(res => res.json())
    .then(result => {
      console.log("API returned albums:", result);
      
      if (result && result.length > 0) {
        // Create formatted album objects from API response
        const userAlbums = result.map(album => ({
          id: album.AlbumID,
          name: album.Title || "Untitled Album",
          image: album.AlbumCoverArtFileName || "/likedsongs.jpg",
          songs: [] // Initially empty, will load songs when album is clicked
        }));
        
        console.log("Formatted user albums:", userAlbums);
        
        // Add the "My Songs" album at the beginning, followed by user albums
        setAlbums(prevAlbums => {
          // Keep only the first album (My Songs)
          const mySongsAlbum = prevAlbums.find(album => album.id === defaultAlbumId);
          return [mySongsAlbum, ...userAlbums];
        });
      } else {
        console.log("No albums returned from API");
      }
    })
    .catch(error => console.error("Error fetching user albums:", error));
  };

  const GetAlbumSongs = (albumId) => {
    console.log("Fetching songs for album ID:", albumId);
    
    fetch(`${API_URL}/api/database/GetAlbumSongs?AlbumID=${albumId}`, {
      method: "GET",
    })
    .then(res => res.json())
    .then(result => {
      console.log("API returned album songs:", result);
      
      if (result && result.length > 0) {
        const formattedSongs = result.map(song => ({
          id: song.SongID,
          title: song.SongName || "Untitled",
          artist: song.Username || currentUsername,
          genre: genreMap[song.GenreCode] || "Unknown Genre",
          duration: song.Duration || 0,
          image: song.CoverArtFileName || "/likedsongs.jpg",
          album: song.AlbumTitle || "Unknown Album",
          songFile: song.SongFileName
        }));
        
        // Update the albums array
        setAlbums(prevAlbums => {
          const updatedAlbums = prevAlbums.map(album => {
            if (album.id === albumId) {
              return {
                ...album,
                songs: formattedSongs
              };
            }
            return album;
          });
          
          // Find the updated album and set it as selected
          const updatedAlbum = updatedAlbums.find(album => album.id === albumId);
          if (updatedAlbum) {
            setSelectedAlbum(updatedAlbum);
          }
          
          return updatedAlbums;
        });
      } else {
        // Handle empty album
        setAlbums(prevAlbums => {
          const updatedAlbums = prevAlbums.map(album => {
            if (album.id === albumId) {
              return {
                ...album,
                songs: []
              };
            }
            return album;
          });
          
          return updatedAlbums;
        });
      }
    })
    .catch(error => console.error("Error fetching album songs:", error));
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
          artist: song.Username || currentUsername,
          genre: genreMap[song.GenreCode] || "Unknown Genre",
          duration: song.Duration || 0,
          image: song.CoverArtFileName || "/likedsongs.jpg",
          album: song.AlbumTitle || "My Songs",
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
  
  // Handle album drag end
  
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

    if (album.id !== defaultAlbumId) { // Skip for "My Songs" which is loaded differently
      console.log("Fetching songs for album ID:", album.id);
      GetAlbumSongs(album.id);
    }
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
    setSelectedAlbum(albums[0]); // Set back to "My Songs" album
  };
  
  const handleBackFromGenre = () => {
    console.log("Back button clicked from genre");
    setSelectedGenre(null);
    setSelectedAlbum(albums[0]); // Set back to "My Songs" album
  };
  
  const handleBackFromAlbum = (album) => {
    console.log("Back button clicked from album");
    // Only go back to "My Songs" if it's not the "My Songs" album itself
    if (album.id !== defaultAlbumId) {
      setSelectedAlbum(albums[0]); // Set back to "My Songs" album
    }
  };

  // Add Song function
  const handleAddSong = (songData) => {
    console.log('Adding new song:', songData);
    
    if (currentUserId) {
      // After API call succeeds:
      setTimeout(() => {
        // Refresh main songs
        GetSongs(currentUserId);
        
        // Also refresh the specific album if it's not the default one
        if (songData.albumId && songData.albumId !== defaultAlbumId) {
          GetAlbumSongs(songData.albumId);
        }
      }, 1000);
    }
  };

  // Handle song deletion
  const handleDeleteSong = (song, isFromMyAlbum) => {
    console.log("Deleting song:", song.title, "From My Album:", isFromMyAlbum);
    
    setConfirmModal({
      isOpen: true,
      message: `Are you sure you want to delete "${song.title}"? ${isFromMyAlbum ? 'This will remove it from all playlists.' : ''}`,
      onConfirm: () => {
        // Here you would add API call to delete the song
        
        if (isFromMyAlbum) {
          // Delete from all playlists and albums
          // 1. Remove from albums
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
          // Only remove from current context (album, playlist, or genre)
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
          } else if (selectedAlbum && selectedAlbum.id !== defaultAlbumId) {
            // Remove from current album
            const updatedAlbums = albums.map(album => {
              if (album.id === selectedAlbum.id) {
                return {
                  ...album,
                  songs: album.songs.filter(s => s.id !== song.id)
                };
              }
              return album;
            });
            
            setAlbums(updatedAlbums);
            setSelectedAlbum(updatedAlbums.find(a => a.id === selectedAlbum.id));
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
          setSelectedAlbum(albums[0]); // Go back to "My Songs" album
        }
        
        console.log(`Playlist "${playlistToDelete.name}" deleted`);
        setConfirmModal({ isOpen: false, message: '', onConfirm: null });
      }
    });
  };
  
  // Handle album deletion
  const handleDeleteAlbum = (e, albumId) => {
    e.stopPropagation(); // Prevent triggering the click event on the album button
    
    // Don't allow deletion of "My Songs" album
    if (albumId === defaultAlbumId) {
      console.log("Cannot delete the My Songs album");
      return;
    }
    
    // Find the album to be deleted
    const albumToDelete = albums.find(a => a.id === albumId);
    
    setConfirmModal({
      isOpen: true,
      message: `Are you sure you want to delete "${albumToDelete.name}" album? This action cannot be undone.`,
      onConfirm: () => {
        // Here you would add API call to delete the album
        
        // Remove the album from the albums array
        const updatedAlbums = albums.filter(album => album.id !== albumId);
        setAlbums(updatedAlbums);
        
        // If the deleted album was selected, set selected to My Songs
        if (selectedAlbum && selectedAlbum.id === albumId) {
          setSelectedAlbum(albums[0]); // Go back to "My Songs" album
        }
        
        console.log(`Album "${albumToDelete.name}" deleted`);
        setConfirmModal({ isOpen: false, message: '', onConfirm: null });
      }
    });
  };

  // Add playlist function  
  const AddPlaylistComponent = (playlistData) => {
    console.log("Making a new playlist: ", playlistData);
    const formData = new FormData();
    
    const userId = parseInt(currentUserId);
    if (isNaN(userId)) {
      console.error("Invalid UserID:", currentUserId);
      alert("Invalid user ID. Please try again.");
      return;
    }
    
    if (!playlistData.image || !(playlistData.image instanceof File)) {
      alert("Please select a valid image file");
      return;
    }
    
    // IMPORTANT: Only add the image to FormData
    formData.append('PlaylistPicture', playlistData.image);
    
    // Add other parameters to URL
    const url = `${API_URL}/api/database/AddPlaylist?UserID=${userId}&Title=${encodeURIComponent(playlistData.name)}`;
    
    console.log("Sending request to:", url);
    fetch(url, {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      console.log("Response status:", response.status);
      if (!response.ok) {
        return response.text().then(text => {
          console.error("Error details:", text);
          throw new Error(`Upload failed with status ${response.status}: ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Upload successful, image URL:', data);
      setShowAPwindow(false);
      
      // IMPORTANT: Only refresh from server - don't add locally
      // This prevents the duplicate issue
      GetUserPlaylists(userId);
    })
    .catch(error => {
      console.error("Error creating playlist:", error);
      alert("Failed to create playlist: " + error.message);
    });
  };
  
  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, message: '', onConfirm: null });
  };

  const handleSongSelect = (songData) => {
    setSelectedSong(songData);
  };

  const deleteSongFromPlaylist = (songId, playlistId) => {
    console.log(`Removing song ${songId} from playlist ${playlistId}`);
    
    fetch(`https://localhost:7152/api/database/DeleteSongFromPlaylist?SongID=${songId}&PlaylistID=${playlistId}`, {
      method: "DELETE"
    })
    .then(response => {
      if (!response.ok) throw new Error("Failed to remove song from playlist");
      return response.json();
    })
    .then(data => {
      console.log("API response:", data);
      
      // Update the playlists state by removing the song from the specified playlist
      setPlaylists(prevPlaylists => {
        const updatedPlaylists = prevPlaylists.map(playlist => {
          if (playlist.id === playlistId) {
            return {
              ...playlist,
              songs: playlist.songs.filter(song => song.id !== songId)
            };
          }
          return playlist;
        });
        
        // If we're viewing this playlist currently, update the selectedPlaylist as well
        if (selectedPlaylist && selectedPlaylist.id === playlistId) {
          setSelectedPlaylist(updatedPlaylists.find(p => p.id === playlistId));
        }
        
        return updatedPlaylists;
      });
    })
    .catch(error => {
      console.error("Error removing song from playlist:", error);
      alert("Failed to remove song from playlist. Please try again.");
    });
  };

  const deleteSongFromAlbum = (songId, albumId) => {
    console.log(`Removing song ${songId} from album ${albumId}`);
    
    fetch(`https://localhost:7152/api/database/DeleteSongFromAlbum?SongID=${songId}&AlbumID=${albumId}`, {
      method: "DELETE"
    })
    .then(response => {
      if (!response.ok) throw new Error("Failed to remove song from album");
      return response.json();
    })
    .then(data => {
      console.log("API response:", data);
      
      // Update the albums state by removing the song from the specified album
      setAlbums(prevAlbums => {
        const updatedAlbums = prevAlbums.map(album => {
          if (album.id === albumId) {
            return {
              ...album,
              songs: album.songs.filter(song => song.id !== songId)
            };
          }
          return album;
        });
        
        // If we're viewing this album currently, update the selectedAlbum as well
        if (selectedAlbum && selectedAlbum.id === albumId) {
          setSelectedAlbum(updatedAlbums.find(a => a.id === albumId));
        }
        
        return updatedAlbums;
      });
    })
    .catch(error => {
      console.error("Error removing song from album:", error);
      alert("Failed to remove song from album. Please try again.");
    });
  };

  const handleRemoveSongFromPlaylist = (song, playlistId) => {
    setConfirmModal({
      isOpen: true,
      message: `Are you sure you want to remove "${song.title}" from this playlist?`,
      onConfirm: () => {
        deleteSongFromPlaylist(song.id, playlistId);
        setConfirmModal({ isOpen: false, message: '', onConfirm: null });
      }
    });
  };

  const handleRemoveSongFromAlbum = (song, albumId) => {
    // Don't allow removal from "My Songs" default album
    if (albumId === defaultAlbumId) {
      alert("Songs cannot be removed from the 'My Songs' collection directly.");
      return;
    }

    setConfirmModal({
      isOpen: true,
      message: `Are you sure you want to remove "${song.title}" from this album?`,
      onConfirm: () => {
        deleteSongFromAlbum(song.id, albumId);
        setConfirmModal({ isOpen: false, message: '', onConfirm: null });
      }
    });
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
       
        {role === 'artist' && (
          <div className="add-song-container">
            <button className="add-song-btn" onClick={() => setIsAddSongModalOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
              </svg>
              <span>Add Song</span>
            </button>
          </div>
        )}
        
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
            onSubmit={AddPlaylistComponent}  // Use this function directly
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

        <hr style={{backgroundColor:"white", width:"100%"}}></hr>

        {role === 'artist' && (
          <div className="playlist-container">
            <div className="section-header">
              <h1>Albums</h1>
              <div className="drag-instructions">
                <span className="drag-icon">↕</span>
                <span className="drag-text">Drag to reorder</span>
              </div>
            </div>
            
            <button className="playlist-button add-btn" onClick={() => setShowAddAlbum(true)}>
              <img
                src={albumAddIcon}
                alt="Album Cover"
                className="playlist-image"
              />
              <span className="playlist-name"><strong>+ Add Album</strong></span>
            </button>
            
            {/* Album Modal */}
            <AddAlbum
              isOpen={showAddAlbum}
              onClose={() => setShowAddAlbum(false)}
              onSubmit={(albumData) => {
                // Handle new album creation
                console.log("Creating new album:", albumData);
                
                // Create a new album object
                const newAlbum = {
                  id: Date.now(), // Generate a unique ID
                  name: albumData.name,
                  image: albumData.image ? URL.createObjectURL(albumData.image) : "https://via.placeholder.com/100",
                  songs: []
                };
                
                // Add the new album to the albums array
                setAlbums([...albums, newAlbum]);
                
                // Close the modal
                setShowAddAlbum(false);
              }}
            />
            
            {albums.map(album => {
  const isMyAlbum = album.id === defaultAlbumId;
  
  return (
    <div 
      key={album.id} 
      className={`playlist-button ${selectedAlbum && selectedAlbum.id === album.id ? 'selected' : ''} ${isMyAlbum ? 'protected-item' : ''}`}
      draggable={!isMyAlbum}
      onDragStart={(e) => handleAlbumDragStart(e, album)}
      onDragOver={(e) => handleAlbumDragOver(e, album)}
      onDragEnd={handleAlbumDragEnd}
      onClick={() => handleAlbumClick(album)}
    >
      {!isMyAlbum && (
        <div className="drag-handle">
          <span className="drag-dots">⋮⋮</span>
        </div>
      )}
      <img
        src={album.image}
        alt={`${album.name} Cover`}
        className="playlist-image"
      />
      <span className="playlist-name">{album.name}</span>
      
      {/* Only show delete button if not "My Songs" album */}
      {!isMyAlbum && (
        <button 
          className="delete-button"
          onClick={(e) => handleDeleteAlbum(e, album.id)}
          title="Delete album"
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
        )}
      </div>
      
      {/* Playlist Songs Display */}
      {selectedPlaylist && (
        <PlaylistSongList 
          songs={selectedPlaylist.songs} 
          playlistName={selectedPlaylist.name}
          playlistImage={selectedPlaylist.image}
          onSongSelect={handleSongSelect}
          onDeleteSong={(song) => handleRemoveSongFromPlaylist(song, selectedPlaylist.id)}
          onAddToPlaylist={handleAddToPlaylist}
          playlistId={selectedPlaylist.id} // Pass the playlist ID
        />
      )}

      {selectedAlbum && (
        <>
          {/* Only show back button if not the "My Songs" album */}
          {selectedAlbum.id !== defaultAlbumId && (
            <div 
              className="styled-back-button"
              onClick={() => handleBackFromAlbum(selectedAlbum)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
              </svg>
              <span>Back to My Songs</span>
            </div>
          )}
          
          <AlbumSongList 
            songs={selectedAlbum.songs} 
            playlistName={selectedAlbum.name}
            playlistImage={selectedAlbum.image}
            onSongSelect={handleSongSelect}
            onDeleteSong={(song) => handleRemoveSongFromAlbum(song, selectedAlbum.id)}
            isMyAlbum={selectedAlbum.id === defaultAlbumId}
            onAddToPlaylist={handleAddToPlaylist}
            onAddToAlbum={handleAddToAlbum}
            albumId={selectedAlbum.id} // Pass album ID
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
            <span>Back to My Songs</span>
          </div>
          <GenreSongList 
            songs={selectedGenre.songs} 
            playlistName={selectedGenre.name}
            playlistImage={selectedGenre.image}
            onSongSelect={handleSongSelect}
          />
        </div>
        </>
      )}
      
      {/* Add Song Modal */}
      <AddSongModal 
        isOpen={isAddSongModalOpen}
        onClose={() => setIsAddSongModalOpen(false)}
        onSubmit={handleAddSong}
        albums={albums}
        defaultAlbumId={defaultAlbumId} // Add this line to pass the defaultAlbumId
      />
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        onCancel={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
      />
      {showPlaylistSelection && currentSongForAction && (
        <PlaylistSelectionPopup 
          onClose={() => {
            setShowPlaylistSelection(false);
            setCurrentSongForAction(null); // IMPORTANT: Reset song after closing
          }}
          playlists={playlists}
          onAddToPlaylist={(playlistId) => {
            handleAddSongToPlaylist(playlistId);
            setCurrentSongForAction(null); // IMPORTANT: Reset song after action
          }}
          currentSong={currentSongForAction}
          key={currentSongForAction.id} // IMPORTANT: Add key to force re-render with new song
        />
      )}

      {showAlbumSelection && (
        <AlbumSelectionPopup 
          onClose={() => setShowAlbumSelection(false)}
          albums={albums.filter(album => album.id !== defaultAlbumId)}
          onAddToAlbum={handleAddSongToAlbum}
          currentSong={currentSongForAction}
        />
      )}
      
      {/* Wherever you render MusicPlayer */}
      {selectedSong && (
        <MusicPlayer
          songId={selectedSong.songId}
          songSrc={selectedSong.songSrc}
          songImage={selectedSong.songImage}
          song={selectedSong.name}
          artist={selectedSong.creator}
          duration={selectedSong.duration}
          pageName="user-page"
          refreshPlaylists={() => GetUserPlaylists(currentUserId)} // Pass the refresh function
        />
      )}
    </div>

    
  );
};

export default UserPage;