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
import { useUserContext } from '../../LoginContext/UserContext';
import { Pencil } from "lucide-react";

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

const UserPage = ({ onSongSelect }) => {
  const [availableGenres, setAvailableGenres] = useState(['R&B', 'Rap', 'Country', 'HipHop', 'Pop', 'Rock','Electronic','Blues','Jazz','Classical','Alternative','Classical','Indie','Metal']);
  const [userGenres, setUserGenres] = useState([]);
  const [showGenreOptions, setGenreOptions] = useState(false);
  const [showAPwindow, setShowAPwindow] = useState(false);
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [role, setRole] = useState('artist');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // To handle the loading state
  const [error, setError] = useState(null); // To handle any errors
  const [retry, setRetry] = useState(false); // Retry logic state
  // Create a default album ID for "My Songs"
  const defaultAlbumId = 0;

  const {user,setUser} = useUserContext();
  const [followers,setFollowers] = useState(0);
  const [bio,setBio] = useState(user.Bio);
  const [albums, setAlbums] = useState([]);
  const [playlists,setPlaylists] = useState([]);
  const [uID,setuID] = useState(user.UserID);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    const fetchFollowerCount = async () => {
      try {
        const response = await fetch(`https://localhost:7152/api/Users/GetFollowers?userID=${user.UserID}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // If the API returns an array of followers, use length
        setFollowers(data.length);

        // If the API returns just a number, use it directly
        // setFollowers(data);
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    fetchFollowerCount();
  }, []);

 // Fetch albums when the component mounts
 const fetchAlbums = async () => {
  try {
    const response = await fetch(`https://localhost:7152/api/Users/GetUserAlbum?userID=${user.UserID}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    setAlbums(data.Value); // Update the state with the fetched data
  } catch (error) {
    setError('Failed to fetch albums. Please try again later.');
    console.error(error);
  } finally {
    setLoading(false); // Set loading to false after fetching
  }
};

useEffect(() => {
  fetchAlbums(); // Call fetch function to load data when component mounts
}, [retry,albums]); // If retry state changes, re-run the fetch



// Fetch albums when the component mounts
const fetchPlaylists = async () => {
  try {
    const response = await fetch(`https://localhost:7152/api/Users/GetUserPlaylist?userID=${user.UserID}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    setPlaylists(data.Value); // Update the state with the fetched data
  } catch (error) {
    setError('Failed to fetch albums. Please try again later.');
    console.error(error);
  } finally {
    setLoading(false); // Set loading to false after fetching
  }
};

useEffect(() => {
  fetchPlaylists(); // Call fetch function to load data when component mounts
}, [retry,playlists]); // If retry state changes, re-run the fetch

const handleRetry = () => {
  setRetry((prevState) => !prevState); // Toggle retry state to trigger useEffect re-fetch
  setLoading(true); // Set loading back to true when retrying
};
  

const updateBio = async()=>{
  const table = "USERS"; 
  const column = "Bio"; 
  const newValue =  bio;
  const tableKey = "USERID"; 
  const id = user.UserID;

  // URL-encoded values to safely pass them in the URL
  const tableEncoded = encodeURIComponent(table);
  const columnEncoded = encodeURIComponent(column);
  const newValueEncoded = encodeURIComponent(newValue);
  const tableKeyEncoded = encodeURIComponent(tableKey);
  const idEncoded = encodeURIComponent(id);

  const url = `https://localhost:7152/api/Update/UpdateText?Table=${tableEncoded}&Column=${columnEncoded}&NewValue=${newValueEncoded}&TableKey=${tableKeyEncoded}&ID=${idEncoded}`;

  try {
    const response = await fetch(url, {
      method: "PATCH", // Use PATCH method to update data
    });

    if (response.ok) {
      console.log('Data updated successfully');
    } else {
      const errorText = await response.text();
      console.error('Failed to update:', errorText);
    }
  } catch (err) {
    console.error("Error updating data:", err);
  }
}
  
  // Set the default album as initially selected
  const [selectedAlbum, setSelectedAlbum] = useState(albums[0]);
  const [selectedGenre, setSelectedGenre] = useState('');
  
  
  // Genre song mapping - songs by genre
  const [genreSongs, setGenreSongs] = useState([]);
    
  
  // Drag state
  const [draggedPlaylist, setDraggedPlaylist] = useState(null);
  const [draggedAlbum, setDraggedAlbum] = useState(null);

  const handleGenres = (e) => {
    if (e.target.value !== 'close' && e.target.value !== '') {
      setUserGenres([...userGenres, e.target.value]);
      setAvailableGenres(availableGenres.filter((genre) => genre !== e.target.value));
    }
    setGenreOptions(!showGenreOptions);
  }

  const removeGenre = (e) => {
    setAvailableGenres([...availableGenres, e.target.value]);
    setUserGenres(userGenres.filter((genre) => genre !== e.target.value));
  }
  
  // Handle playlist drag start
  const handlePlaylistDragStart = (e, playlist) => {
    setDraggedPlaylist(playlist);
    // Set transparent drag image
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
    e.currentTarget.classList.add('dragging');
  };
  
  // Handle playlist drag over
  const handlePlaylistDragOver = (e, playlistOver) => {
    e.preventDefault();
    if (draggedPlaylist && draggedPlaylist.PlaylistID !== playlistOver.PlaylistID) {
      const playlistsCopy = [...playlists];
      const draggedIndex = playlistsCopy.findIndex(p => p.PlaylistID === draggedPlaylist.PlaylistID);
      const targetIndex = playlistsCopy.findIndex(p => p.Playlist === playlistOver.PlaylistID);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Reorder the playlists
        const [draggedItem] = playlistsCopy.splice(draggedIndex, 1);
        playlistsCopy.splice(targetIndex, 0, draggedItem);
        setPlaylists(playlistsCopy);
      }
    }
  };
  
  // Handle playlist drag end
  const handlePlaylistDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    setDraggedPlaylist(null);
  };
  
  // Handle album drag start
  const handleAlbumDragStart = (e, album) => {
    setDraggedAlbum(album);
    // Set transparent drag image
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
    e.currentTarget.classList.add('dragging');
  };
  
  // Handle album drag over
  const handleAlbumDragOver = (e, albumOver) => {
    e.preventDefault();
    if (draggedAlbum && draggedAlbum.AlbumID !== albumOver.AlbumID) {
      const albumsCopy = [...albums];
      const draggedIndex = albumsCopy.findIndex(a => a.AlbumID === draggedAlbum.AlbumID);
      const targetIndex = albumsCopy.findIndex(a => a.AlbumId === albumOver.AlbumID);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Reorder the albums
        const [draggedItem] = albumsCopy.splice(draggedIndex, 1);
        albumsCopy.splice(targetIndex, 0, draggedItem);
        setAlbums(albumsCopy);
      }
    }
  };
  
  // Handle album drag end
  const handleAlbumDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    setDraggedAlbum(null);
  };

  // Handle playlist click
  const handlePlaylistClick = (playlist) => {
    console.log("Playlist clicked:", playlist.Title);
    setSelectedPlaylist(playlist);
    setSelectedAlbum(null); // Clear selected album when opening a playlist
    setSelectedGenre(null); // Clear selected genre when opening a playlist
  };
  
  const handleAlbumClick = (album) => {
    console.log("Album clicked:", album.Title);
    setSelectedAlbum(album);
    setSelectedPlaylist(null); // Clear selected playlist when opening an album
    setSelectedGenre(null); // Clear selected genre when opening an album
  };
  
  const handleGenreClick = (genreName) => {
    console.log("Genre clicked:", genreName);
    if (genreSongs[genreName]) {
      setSelectedGenre(genreName);
      setSelectedPlaylist(null); // Clear selected playlist when opening a genre
      setSelectedAlbum(null); // Clear selected album when opening a genre
    } else {
      alert("Don't have any songs saved in this genre")
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
    if (album.AlbumID !== defaultAlbumId) {
      setSelectedAlbum(albums[0]); // Set back to "My Songs" album
    }
  };

  // Add Song function
  const handleAddSong = (songData) => {
    console.log('Adding new song:', songData);
    // Here you would typically make an API call to save the song
    // and then update your albums state with the new song
    
    // For now, let's add it to the selected album as an example
    const newSong = {
      id: Date.now(), // temporary ID
      title: songData.name,
      artist: "Haitham Yousif", // Hardcoded for example
      genre: songData.genre || "Unknown", // You might want to add genre to your form
      duration: 180, // Default duration
      image: songData.image ? URL.createObjectURL(songData.image) : "https://via.placeholder.com/40",
      album: "My Songs"
    };
    
    // Update albums state with the new song
    const updatedAlbums = albums.map(album => {
      if (album.AlbumID === parseInt(songData.albumId)) {
        return {
          ...album,
          songs: [...album.songs, newSong]
        };
      }
      return album;
    });
    
    setAlbums(updatedAlbums);
  };

  // Handle song deletion
  const handleDeleteSong = (song, isFromMyAlbum) => {
    console.log("Deleting song:", song.title, "From My Album:", isFromMyAlbum);
    
    if (isFromMyAlbum) {
      // Delete from all playlists and albums
      // 1. Remove from albums
      const updatedAlbums = albums.map(album => ({
        ...album,
        songs: album.songs.filter(s => s.SongID !== song.SongID)
      }));
      setAlbums(updatedAlbums);
      
      // 2. Remove from playlists
      const updatedPlaylists = playlists.map(playlist => ({
        ...playlist,
        songs: playlist.songs.filter(s => s.SongID !== song.SongID)
      }));
      setPlaylists(updatedPlaylists);
      
      // 3. Remove from genre songs
      const updatedGenreSongs = { ...genreSongs };
      Object.keys(updatedGenreSongs).forEach(genre => {
        updatedGenreSongs[genre] = {
          ...updatedGenreSongs[genre],
          songs: updatedGenreSongs[genre].songs.filter(s => s.SongID !== song.SongID)
        };
      });
      setGenreSongs(updatedGenreSongs);
      
      // Show confirmation notification (optional)
      console.log(`"${song.title}" removed from your library`);
    } else {
      // Only remove from current context (album, playlist, or genre)
      if (selectedPlaylist) {
        // Remove from current playlist
        const updatedPlaylists = playlists.map(playlist => {
          if (playlist.PlaylistID === selectedPlaylist.PlaylistID) {
            return {
              ...playlist,
              songs: playlist.songs.filter(s => s.SongID !== song.SongID)
            };
          }
          return playlist;
        });
        
        setPlaylists(updatedPlaylists);
        setSelectedPlaylist(updatedPlaylists.find(p => p.PlaylistID === selectedPlaylist.PlaylistID));
      } else if (selectedAlbum && selectedAlbum.AlbumID !== defaultAlbumId) {
        // Remove from current album
        const updatedAlbums = albums.map(album => {
          if (album.AlbumID === selectedAlbum.AlbumID) {
            return {
              ...album,
              songs: album.songs.filter(s => s.SongID !== song.SongID)
            };
          }
          return album;
        });
        
        setAlbums(updatedAlbums);
        setSelectedAlbum(updatedAlbums.find(a => a.AlbumID === selectedAlbum.AlbumID));
      } else if (selectedGenre) {
        // Remove from current genre
        const updatedGenreSongs = { ...genreSongs };
        if (updatedGenreSongs[selectedGenre.name]) {
          updatedGenreSongs[selectedGenre.name] = {
            ...updatedGenreSongs[selectedGenre.name],
            songs: updatedGenreSongs[selectedGenre.name].songs.filter(s => s.SongID !== song.SongID)
          };
          setGenreSongs(updatedGenreSongs);
          setSelectedGenre(updatedGenreSongs[selectedGenre.name]);
        }
      }
      
      // Show confirmation notification (optional)
      console.log(`"${song.title}" removed from ${selectedPlaylist ? 'playlist' : selectedAlbum ? 'album' : 'genre'}`);
    }
  };

  // Handle playlist deletion
  const handleDeletePlaylist = (e, playlistId) => {
    e.stopPropagation(); // Prevent triggering the click event on the playlist button
    
    // Find the playlist to be deleted
    const playlistToDelete = playlists.find(p => p.PlaylistID === playlistId);
    
    // Don't allow deletion of "Liked Songs" playlist
    if (playlistToDelete.name === "Liked Songs") {
      console.log("Cannot delete the Liked Songs playlist");
      return;
    }
    
    setConfirmModal({
      isOpen: true,
      message: `Are you sure you want to delete "${playlistToDelete.name}" playlist? This action cannot be undone.`,
      onConfirm: () => {
        // Remove the playlist from the playlists array
        const updatedPlaylists = playlists.filter(playlist => playlist.PlaylistID!== playlistId);
        setPlaylists(updatedPlaylists);
        
        // If the deleted playlist was selected, set selected to null
        if (selectedPlaylist && selectedPlaylist.PlaylistID === playlistId) {
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
    const albumToDelete = albums.find(a => a.AlbumID === albumId);
    
    setConfirmModal({
      isOpen: true,
      message: `Are you sure you want to delete "${albumToDelete.name}" album? This action cannot be undone.`,
      onConfirm: () => {
        // Remove the album from the albums array
        const updatedAlbums = albums.filter(album => album.AlbumID !== albumId);
        setAlbums(updatedAlbums);
        
        // If the deleted album was selected, set selected to My Songs
        if (selectedAlbum && selectedAlbum.AlbumID === albumId) {
          setSelectedAlbum(albums[0]); // Go back to "My Songs" album
        }
        
        console.log(`Album "${albumToDelete.name}" deleted`);
        setConfirmModal({ isOpen: false, message: '', onConfirm: null });
      }
    });
  };
  
  // Close confirmation modal
  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, message: '', onConfirm: null });
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={user.ProfilePicture}
          alt="Profile"
          className="profile-image"
        />
        <h1 className="profile-name">{user.Username}</h1>{/* Profile Name  */}
        {/*  Optional Pronouns */}
        <h3 style={{textAlign:"left",margin:"30px 0px -10px 0px"}}>Profile Description</h3>
        <textarea className='user-bio-editable'
        style={{
          width:"300px",
          height:"300px",
          marginTop:"20px",
          marginLeft:"-20px",
          background:"none",
          resize:"none",
          color:"white"
        }}
        placeholder='Enter you Profile Bio here...' value={bio} onChange={(e)=>{setBio(e.target.value)}}
        >
        </textarea>
        <button className='edit-btn' title="Save Bio" onClick={updateBio} style={{color:"white",height:"40px",border:"2px solid white",borderRadius:"5px",position:"relative",bottom:"150px",left:"20px"}}><Pencil className='edit-icon'/></button>
        <div className="stats-container">
          <p className="follower-count">Followers: {followers}</p>
          {/*<p className="total-listens">Total Listens: 1.5M</p>*/}
        </div>
        
        <div className="music-container">
          <button className="music-genre" onClick={() => handleGenreClick('R&B')}>R&B</button>
          <button className="music-genre" onClick={() => handleGenreClick('Rap')}>Rap</button>
          <button className="music-genre" onClick={() => handleGenreClick('Country')}>Country</button>
          <button className="music-genre" onClick={() => handleGenreClick('HipHop')}>HipHop</button>
          <button className="music-genre" onClick={() => handleGenreClick('Pop')}>Pop</button>
          <button className="music-genre" onClick={() => handleGenreClick('Rock')}>Rock</button>
          <button className="music-genre" onClick={() => handleGenreClick('Electronic')}>Electronic</button>
          <button className="music-genre" onClick={() => handleGenreClick('Jazz')}>Jazz</button>
          <button className="music-genre" onClick={() => handleGenreClick('Blues')}>Blues</button>
          <button className="music-genre" onClick={() => handleGenreClick('Metal')}>Metal</button>
          <button className="music-genre" onClick={() => handleGenreClick('Classical')}>Classical</button>
          <button className="music-genre" onClick={() => handleGenreClick('Alternative')}>Alternative</button>
          <button className="music-genre" onClick={() => handleGenreClick('Indie')}>Indie</button>
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
          
          {role === 'artist' && (
            <button className="playlist-button add-btn" onClick={() => {setShowAPwindow(true)}}>
              <img
                src="https://via.placeholder.com/100"
                alt="Playlist Cover"
                className="playlist-image"
              />
              <span className="playlist-name"><strong>+ Add Playlist</strong></span>
            </button>
          )}
          
          {showAPwindow && (
            <>
              <AddPlaylist/>
              <button 
                className="add-playlist-btn" 
                style={{marginTop:"-20px",marginLeft:"30px"}} 
                onClick={() => {setShowAPwindow(false)}}
              >
                CLOSE
              </button>
            </>
          )}
          
          {playlists.map(playlist => (
            <div 
              key={playlist.PlaylistID} 
              className={`playlist-button ${selectedPlaylist && selectedPlaylist.PlaylistID === playlist.PlaylistID ? 'selected' : ''}`}
              draggable
              onDragStart={(e) => handlePlaylistDragStart(e, playlist)}
              onDragOver={(e) => handlePlaylistDragOver(e, playlist)}
              onDragEnd={handlePlaylistDragEnd}
              onClick={() => handlePlaylistClick(playlist)}
            >
              <div className="drag-handle">
                <span className="drag-dots">⋮⋮</span>
              </div>
              <img
                src={playlist.PlaylistPicture}
                alt={`${playlist.name} Cover`}
                className="playlist-image"
              />
              <span className="playlist-name">{playlist.Title}</span>
              
              {/* Only show delete button if not "Liked Songs" playlist */}
              {playlist.Title !== "Liked Songs" && (
                <button 
                  className="delete-button"
                  onClick={(e) => handleDeletePlaylist(e, playlist.PlaylistID)}
                  title="Delete playlist"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                  </svg>
                </button>
              )}
            </div>
          ))}
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
            
            <button className="playlist-button add-btn" onClick={() => {setShowAddAlbum(true)}}>
              <span className="playlist-name"><strong>+ Add Album</strong></span>
            </button>
            
            {showAddAlbum && (
              <>
                <AddAlbum/>
                <button 
                  className="add-playlist-btn" 
                  style={{marginTop:"-20px",marginLeft:"30px"}} 
                  onClick={() => {setShowAddAlbum(false)}}
                >
                  CLOSE
                </button>
              </>
            )}
            
            {albums.map(album => (
              <div 
                key={album.AlbumID} 
                className={`playlist-button ${selectedAlbum && selectedAlbum.AlbumID === album.AlbumID ? 'selected' : ''}`}
                draggable
                onDragStart={(e) => handleAlbumDragStart(e, album)}
                onDragOver={(e) => handleAlbumDragOver(e, album)}
                onDragEnd={handleAlbumDragEnd}
                onClick={() => handleAlbumClick(album)}
              >
                <div className="drag-handle">
                  <span className="drag-dots">⋮⋮</span>
                </div>
                <span className="playlist-name">{album.Title}</span>
                
                {/* Only show delete button if not "My Songs" album */}
                {album.AlbumID !== defaultAlbumId && (
                  <button 
                    className="delete-button"
                    onClick={(e) => handleDeleteAlbum(e, album.AlbumID)}
                    title="Delete album"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d={album.AlbumCoverArtFile}></path>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
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
            ID={selectedPlaylist.PlaylistID} 
            selectedPlaylist={selectedPlaylist}
            onSongSelect={onSongSelect}
            onDeleteSong={handleDeleteSong}
          />
        </>
      )}

      {selectedAlbum && (
        <>
          {/* Only show back button if not the "My Songs" album */}
          {selectedAlbum.AlbumID !== defaultAlbumId && (
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
            ID={selectedAlbum.AlbumID}
            selectedAlbum={selectedAlbum}
            onSongSelect={onSongSelect}
            onDeleteSong={handleDeleteSong}
            isMyAlbum={selectedAlbum.AlbumID === defaultAlbumId}
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
            Genre={selectedGenre} 
            onSongSelect={onSongSelect}
          />
        </>
      )}
      
      {/* Add Song Modal */}
      <AddSongModal 
        ID={uID}
        albums={albums}
        isOpen={isAddSongModalOpen}
        onClose={() => setIsAddSongModalOpen(false)}
        onSubmit={handleAddSong}
      />
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        message={confirmModal.message}
        onCancel={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
      />
    </div>
  );
};

export default UserPage;