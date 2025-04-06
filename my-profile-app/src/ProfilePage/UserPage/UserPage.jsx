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

const UserPage = ({ onSongSelect }) => {
  const [availableGenres, setAvailableGenres] = useState(['R&B', 'Rap', 'Country', 'HipHop', 'Pop', 'Rock','Electronic','Blues','Jazz','Classical','Alternative','Classical','Indie','Metal']);
  const [userGenres, setUserGenres] = useState([]);
  const [showGenreOptions, setGenreOptions] = useState(false);
  const [showAPwindow, setShowAPwindow] = useState(false);
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [role, setRole] = useState('artist');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  
  // Create a default album ID for "My Songs"
  const defaultAlbumId = 0;
  
  // Album drag and drop state - with "My Songs" as the first album
  const [albums, setAlbums] = useState([
    { 
      id: defaultAlbumId, 
      name: "My Songs",
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 1001, title: "My First Song", artist: "Haitham Yousif", genre: "Pop", duration: 180, image: "https://via.placeholder.com/40", album: "My Songs" },
        { id: 1002, title: "Late Night Vibes", artist: "Haitham Yousif", genre: "RnB", duration: 210, image: "https://via.placeholder.com/40", album: "My Songs" },
        { id: 1003, title: "Weekend Mood", artist: "Haitham Yousif", genre: "Pop", duration: 195, image: "https://via.placeholder.com/40", album: "My Songs" },
        { id: 1004, title: "Studio Session", artist: "Haitham Yousif", genre: "Rap", duration: 225, image: "https://via.placeholder.com/40", album: "My Songs" },
      ]
    },
    { 
      id: 1, 
      name: "First Album",
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 101, title: "Album Intro", artist: "Haitham Yousif", genre: "RnB", duration: 120, image: "https://via.placeholder.com/40", album: "First Album" },
        { id: 102, title: "First Hit", artist: "Haitham Yousif", genre: "Pop", duration: 195, image: "https://via.placeholder.com/40", album: "First Album" },
        { id: 103, title: "New Sound", artist: "Haitham Yousif", genre: "RnB", duration: 210, image: "https://via.placeholder.com/40", album: "First Album" }
      ]
    },
    { 
      id: 2, 
      name: "Auston 2020 Tour",
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 104, title: "Tour Opening", artist: "Haitham Yousif", genre: "Pop", duration: 180, image: "https://via.placeholder.com/40", album: "Auston 2020 Tour" },
        { id: 105, title: "Auston Nights", artist: "Haitham Yousif", genre: "RnB", duration: 225, image: "https://via.placeholder.com/40", album: "Auston 2020 Tour" },
        { id: 106, title: "City Lights", artist: "Haitham Yousif", genre: "Pop", duration: 198, image: "https://via.placeholder.com/40", album: "Auston 2020 Tour" }
      ]
    },
    { 
      id: 3, 
      name: "Break Up",
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 107, title: "The End", artist: "Haitham Yousif", genre: "RnB", duration: 240, image: "https://via.placeholder.com/40", album: "Break Up" },
        { id: 108, title: "Missing You", artist: "Haitham Yousif", genre: "Pop", duration: 205, image: "https://via.placeholder.com/40", album: "Break Up" },
        { id: 109, title: "Better Days", artist: "Haitham Yousif", genre: "RnB", duration: 215, image: "https://via.placeholder.com/40", album: "Break Up" }
      ]
    },
    { 
      id: 4, 
      name: "Graduation",
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 110, title: "New Beginnings", artist: "Haitham Yousif", genre: "Pop", duration: 190, image: "https://via.placeholder.com/40", album: "Graduation" },
        { id: 111, title: "The Future", artist: "Haitham Yousif", genre: "Rap", duration: 210, image: "https://via.placeholder.com/40", album: "Graduation" },
        { id: 112, title: "Dreams", artist: "Haitham Yousif", genre: "Pop", duration: 185, image: "https://via.placeholder.com/40", album: "Graduation" }
      ]
    },
    { 
      id: 5, 
      name: "Ballin'",
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 113, title: "Money Talk", artist: "Haitham Yousif", genre: "Rap", duration: 200, image: "https://via.placeholder.com/40", album: "Ballin'" },
        { id: 114, title: "Hustle", artist: "Haitham Yousif", genre: "HipHop", duration: 230, image: "https://via.placeholder.com/40", album: "Ballin'" },
        { id: 115, title: "Big Dreams", artist: "Haitham Yousif", genre: "Rap", duration: 195, image: "https://via.placeholder.com/40", album: "Ballin'" }
      ]
    }
  ]);
  
  // Set the default album as initially selected
  const [selectedAlbum, setSelectedAlbum] = useState(albums[0]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  
  // Playlist drag and drop state
  const [playlists, setPlaylists] = useState([
    { 
      id: 1, 
      name: "Chill Vibes", 
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 1, title: "Summer Breeze", artist: "Haitham Yousif", genre: "RnB", duration: 213, image: "https://via.placeholder.com/40", album: "Summer Hits" },
        { id: 2, title: "Ocean Waves", artist: "Haitham Yousif", genre: "Pop", duration: 184, image: "https://via.placeholder.com/40", album: "Summer Hits" },
        { id: 3, title: "Sunset Melody", artist: "Haitham Yousif", genre: "RnB", duration: 245, image: "https://via.placeholder.com/40", album: "Summer Hits" }
      ]
    },
    { 
      id: 2, 
      name: "Workout Hits", 
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 4, title: "Power Up", artist: "Haitham Yousif", genre: "HipHop", duration: 192, image: "https://via.placeholder.com/40", album: "Workout Collection" },
        { id: 5, title: "Run Fast", artist: "Haitham Yousif", genre: "Rap", duration: 176, image: "https://via.placeholder.com/40", album: "Workout Collection" },
        { id: 6, title: "Lift Heavy", artist: "Haitham Yousif", genre: "Rock", duration: 230, image: "https://via.placeholder.com/40", album: "Workout Collection" },
        { id: 7, title: "Beast Mode", artist: "Haitham Yousif", genre: "HipHop", duration: 205, image: "https://via.placeholder.com/40", album: "Workout Collection" }
      ]
    },
    { 
      id: 3, 
      name: "Late Night", 
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 8, title: "Midnight Blues", artist: "Haitham Yousif", genre: "RnB", duration: 267, image: "https://via.placeholder.com/40", album: "Midnight Moods" },
        { id: 9, title: "Starry Sky", artist: "Haitham Yousif", genre: "Pop", duration: 198, image: "https://via.placeholder.com/40", album: "Midnight Moods" }
      ]
    },
    { 
      id: 4, 
      name: "Vibe", 
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 10, title: "Good Mood", artist: "Haitham Yousif", genre: "Pop", duration: 210, image: "https://via.placeholder.com/40", album: "Positive Vibes" },
        { id: 11, title: "Feeling Good", artist: "Haitham Yousif", genre: "RnB", duration: 223, image: "https://via.placeholder.com/40", album: "Positive Vibes" },
        { id: 12, title: "Positive Energy", artist: "Haitham Yousif", genre: "Pop", duration: 195, image: "https://via.placeholder.com/40", album: "Positive Vibes" }
      ]
    },
    { 
      id: 5, 
      name: "Rap", 
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 13, title: "Flow Master", artist: "Haitham Yousif", genre: "Rap", duration: 187, image: "https://via.placeholder.com/40", album: "Street Flow" },
        { id: 14, title: "Street Life", artist: "Haitham Yousif", genre: "Rap", duration: 234, image: "https://via.placeholder.com/40", album: "Street Flow" },
        { id: 15, title: "Rhythm & Poetry", artist: "Haitham Yousif", genre: "Rap", duration: 256, image: "https://via.placeholder.com/40", album: "Street Flow" }
      ]
    }
  ]);
  
  // Genre song mapping - songs by genre
  const [genreSongs, setGenreSongs] = useState({
    'Rnb': {
      name: 'RnB',
      image: 'https://via.placeholder.com/100',
      songs: [
        { id: 1, title: "Summer Breeze", artist: "Haitham Yousif", genre: "RnB", duration: 213, image: "https://via.placeholder.com/40", album: "Summer Hits" },
        { id: 3, title: "Sunset Melody", artist: "Haitham Yousif", genre: "RnB", duration: 245, image: "https://via.placeholder.com/40", album: "Summer Hits" },
        { id: 8, title: "Midnight Blues", artist: "Haitham Yousif", genre: "RnB", duration: 267, image: "https://via.placeholder.com/40", album: "Midnight Moods" },
        { id: 11, title: "Feeling Good", artist: "Haitham Yousif", genre: "RnB", duration: 223, image: "https://via.placeholder.com/40", album: "Positive Vibes" },
        { id: 101, title: "Album Intro", artist: "Haitham Yousif", genre: "RnB", duration: 120, image: "https://via.placeholder.com/40", album: "First Album" },
        { id: 103, title: "New Sound", artist: "Haitham Yousif", genre: "RnB", duration: 210, image: "https://via.placeholder.com/40", album: "First Album" },
        { id: 105, title: "Auston Nights", artist: "Haitham Yousif", genre: "RnB", duration: 225, image: "https://via.placeholder.com/40", album: "Auston 2020 Tour" },
        { id: 107, title: "The End", artist: "Haitham Yousif", genre: "RnB", duration: 240, image: "https://via.placeholder.com/40", album: "Break Up" },
        { id: 109, title: "Better Days", artist: "Haitham Yousif", genre: "RnB", duration: 215, image: "https://via.placeholder.com/40", album: "Break Up" }
      ]
    },
    'Rap': {
      name: 'Rap',
      image: 'https://via.placeholder.com/100',
      songs: [
        { id: 5, title: "Run Fast", artist: "Haitham Yousif", genre: "Rap", duration: 176, image: "https://via.placeholder.com/40", album: "Workout Collection" },
        { id: 13, title: "Flow Master", artist: "Haitham Yousif", genre: "Rap", duration: 187, image: "https://via.placeholder.com/40", album: "Street Flow" },
        { id: 14, title: "Street Life", artist: "Haitham Yousif", genre: "Rap", duration: 234, image: "https://via.placeholder.com/40", album: "Street Flow" },
        { id: 15, title: "Rhythm & Poetry", artist: "Haitham Yousif", genre: "Rap", duration: 256, image: "https://via.placeholder.com/40", album: "Street Flow" },
        { id: 111, title: "The Future", artist: "Haitham Yousif", genre: "Rap", duration: 210, image: "https://via.placeholder.com/40", album: "Graduation" },
        { id: 113, title: "Money Talk", artist: "Haitham Yousif", genre: "Rap", duration: 200, image: "https://via.placeholder.com/40", album: "Ballin'" },
        { id: 115, title: "Big Dreams", artist: "Haitham Yousif", genre: "Rap", duration: 195, image: "https://via.placeholder.com/40", album: "Ballin'" }
      ]
    },
    'Country': {
      name: 'Country',
      image: 'https://via.placeholder.com/100',
      songs: [
        { id: 201, title: "Country Roads", artist: "Haitham Yousif", genre: "Country", duration: 215, image: "https://via.placeholder.com/40", album: "Country Collection" },
        { id: 202, title: "Homeland", artist: "Haitham Yousif", genre: "Country", duration: 195, image: "https://via.placeholder.com/40", album: "Country Collection" }
      ]
    },
    'HipHop': {
      name: 'HipHop',
      image: 'https://via.placeholder.com/100',
      songs: [
        { id: 4, title: "Power Up", artist: "Haitham Yousif", genre: "HipHop", duration: 192, image: "https://via.placeholder.com/40", album: "Workout Collection" },
        { id: 7, title: "Beast Mode", artist: "Haitham Yousif", genre: "HipHop", duration: 205, image: "https://via.placeholder.com/40", album: "Workout Collection" },
        { id: 114, title: "Hustle", artist: "Haitham Yousif", genre: "HipHop", duration: 230, image: "https://via.placeholder.com/40", album: "Ballin'" }
      ]
    },
    'Pop': {
      name: 'Pop',
      image: 'https://via.placeholder.com/100',
      songs: [
        { id: 2, title: "Ocean Waves", artist: "Haitham Yousif", genre: "Pop", duration: 184, image: "https://via.placeholder.com/40", album: "Summer Hits" },
        { id: 9, title: "Starry Sky", artist: "Haitham Yousif", genre: "Pop", duration: 198, image: "https://via.placeholder.com/40", album: "Midnight Moods" },
        { id: 10, title: "Good Mood", artist: "Haitham Yousif", genre: "Pop", duration: 210, image: "https://via.placeholder.com/40", album: "Positive Vibes" },
        { id: 12, title: "Positive Energy", artist: "Haitham Yousif", genre: "Pop", duration: 195, image: "https://via.placeholder.com/40", album: "Positive Vibes" },
        { id: 102, title: "First Hit", artist: "Haitham Yousif", genre: "Pop", duration: 195, image: "https://via.placeholder.com/40", album: "First Album" },
        { id: 104, title: "Tour Opening", artist: "Haitham Yousif", genre: "Pop", duration: 180, image: "https://via.placeholder.com/40", album: "Auston 2020 Tour" },
        { id: 106, title: "City Lights", artist: "Haitham Yousif", genre: "Pop", duration: 198, image: "https://via.placeholder.com/40", album: "Auston 2020 Tour" },
        { id: 108, title: "Missing You", artist: "Haitham Yousif", genre: "Pop", duration: 205, image: "https://via.placeholder.com/40", album: "Break Up" },
        { id: 110, title: "New Beginnings", artist: "Haitham Yousif", genre: "Pop", duration: 190, image: "https://via.placeholder.com/40", album: "Graduation" },
        { id: 112, title: "Dreams", artist: "Haitham Yousif", genre: "Pop", duration: 185, image: "https://via.placeholder.com/40", album: "Graduation" }
      ]
    },
    'Rock': {
      name: 'Rock',
      image: 'https://via.placeholder.com/100',
      songs: [
        { id: 6, title: "Lift Heavy", artist: "Haitham Yousif", genre: "Rock", duration: 230, image: "https://via.placeholder.com/40", album: "Workout Collection" }
      ]
    }
  });
  
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
    if (draggedPlaylist && draggedPlaylist.id !== playlistOver.id) {
      const playlistsCopy = [...playlists];
      const draggedIndex = playlistsCopy.findIndex(p => p.id === draggedPlaylist.id);
      const targetIndex = playlistsCopy.findIndex(p => p.id === playlistOver.id);
      
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
    if (draggedAlbum && draggedAlbum.id !== albumOver.id) {
      const albumsCopy = [...albums];
      const draggedIndex = albumsCopy.findIndex(a => a.id === draggedAlbum.id);
      const targetIndex = albumsCopy.findIndex(a => a.id === albumOver.id);
      
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
    console.log("Playlist clicked:", playlist.name);
    setSelectedPlaylist(playlist);
    setSelectedAlbum(null); // Clear selected album when opening a playlist
    setSelectedGenre(null); // Clear selected genre when opening a playlist
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
  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="profile-image"
        />
        <h1 className="profile-name">Haitham yousif</h1>{/* Profile Name  */}
        {/*  Optional Pronouns */}
        <h3 style={{textAlign:"left",margin:"30px 0px -10px 0px"}}>Profile Description</h3>
        <Editable
            title="Edit Bio"
            value="Small Creator that focuses on Rnb and Rap style of music. "
            div_width="100%"
            div_height="200px"
            backgroundColor="none"
            textColor="white"
            placeholder="Add a Description for your profile..."/>
        
        <div className="stats-container">
          <p className="follower-count">Followers: 10.2K</p>
          <p className="total-listens">Total Listens: 1.5M</p>
        </div>
        
        <div className="music-container">
          <button className="music-genre" onClick={() => handleGenreClick('Rnb')}>Rnb</button>
          <button className="music-genre" onClick={() => handleGenreClick('Rap')}>Rap</button>
          <button className="music-genre" onClick={() => handleGenreClick('Country')}>Country</button>
          <button className="music-genre" onClick={() => handleGenreClick('HipHop')}>HipHop</button>
          <button className="music-genre" onClick={() => handleGenreClick('Pop')}>Pop</button>
          <button className="music-genre" onClick={() => handleGenreClick('Rock')}>Rock</button>
        </div>
       

        {role === 'artist' && (
  <div className="add-song-container">
    <button className="add-song-btn" onClick={() => {/* Add your song upload function here */}}>
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
              key={playlist.id} 
              className={`playlist-button ${selectedPlaylist && selectedPlaylist.id === playlist.id ? 'selected' : ''}`}
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
                src={playlist.image}
                alt={`${playlist.name} Cover`}
                className="playlist-image"
              />
              <span className="playlist-name">{playlist.name}</span>
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
                key={album.id} 
                className={`playlist-button ${selectedAlbum && selectedAlbum.id === album.id ? 'selected' : ''}`}
                draggable
                onDragStart={(e) => handleAlbumDragStart(e, album)}
                onDragOver={(e) => handleAlbumDragOver(e, album)}
                onDragEnd={handleAlbumDragEnd}
                onClick={() => handleAlbumClick(album)}
              >
                <div className="drag-handle">
                  <span className="drag-dots">⋮⋮</span>
                </div>
                <span className="playlist-name">{album.name}</span>
              </div>
            ))}
          </div>
        )}

        {/*<MusicPlayer song="Why Cant You" artist="Bryant Barnes" />*/}
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
      onSongSelect={onSongSelect}
    />
  </>
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
        <span>Back to albums</span>
      </div>
    )}
    
    <AlbumSongList 
      songs={selectedAlbum.songs} 
      playlistName={selectedAlbum.name}
      playlistImage={selectedAlbum.image}
      onSongSelect={onSongSelect}
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
    />
  </>
)}
    </div>
  );
};

export default UserPage;