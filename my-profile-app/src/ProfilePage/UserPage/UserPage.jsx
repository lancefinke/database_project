import React, { useState } from 'react';
import AddAlbum from '../Components/AddAlbum';
import './../ProfilePage.css';
import './UserPage.css';
import MusicPlayer from "./../Components/MusicPlayer";
import Editable from './../Components/Editable';
import AddPlaylist from '../Components/AddPlaylist';
import PlaylistSongList from '../Components/PlaylistSongList';
import UserLink from '../../UserLink/UserLink';

const UserPage = () => {
  const [availableGenres, setAvailableGenres] = useState(['Rnb', 'Rap', 'Country', 'HipHop', 'Pop', 'Rock']);
  const [userGenres, setUserGenres] = useState([]);
  const [showGenreOptions, setGenreOptions] = useState(false);
  const [showAPwindow, setShowAPwindow] = useState(false);
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [role, setRole] = useState('artist');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null); // Track selected playlist
  
  // Playlist drag and drop state
  const [playlists, setPlaylists] = useState([
    { 
      id: 1, 
      name: "Chill Vibes", 
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 1, title: "Summer Breeze", artist: "Haitham Yousif", genre: "RnB", duration: 213, image: "https://via.placeholder.com/40" },
        { id: 2, title: "Ocean Waves", artist: "Haitham Yousif", genre: "Pop", duration: 184, image: "https://via.placeholder.com/40" },
        { id: 3, title: "Sunset Melody", artist: "Haitham Yousif", genre: "RnB", duration: 245, image: "https://via.placeholder.com/40" }
      ]
    },
    { 
      id: 2, 
      name: "Workout Hits", 
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 4, title: "Power Up", artist: "Haitham Yousif", genre: "HipHop", duration: 192, image: "https://via.placeholder.com/40" },
        { id: 5, title: "Run Fast", artist: "Haitham Yousif", genre: "Rap", duration: 176, image: "https://via.placeholder.com/40" },
        { id: 6, title: "Lift Heavy", artist: "Haitham Yousif", genre: "Rock", duration: 230, image: "https://via.placeholder.com/40" },
        { id: 7, title: "Beast Mode", artist: "Haitham Yousif", genre: "HipHop", duration: 205, image: "https://via.placeholder.com/40" }
      ]
    },
    { 
      id: 3, 
      name: "Late Night", 
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 8, title: "Midnight Blues", artist: "Haitham Yousif", genre: "RnB", duration: 267, image: "https://via.placeholder.com/40" },
        { id: 9, title: "Starry Sky", artist: "Haitham Yousif", genre: "Pop", duration: 198, image: "https://via.placeholder.com/40" }
      ]
    },
    { 
      id: 4, 
      name: "Vibe", 
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 10, title: "Good Mood", artist: "Haitham Yousif", genre: "Pop", duration: 210, image: "https://via.placeholder.com/40" },
        { id: 11, title: "Feeling Good", artist: "Haitham Yousif", genre: "RnB", duration: 223, image: "https://via.placeholder.com/40" },
        { id: 12, title: "Positive Energy", artist: "Haitham Yousif", genre: "Pop", duration: 195, image: "https://via.placeholder.com/40" }
      ]
    },
    { 
      id: 5, 
      name: "Rap", 
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 13, title: "Flow Master", artist: "Haitham Yousif", genre: "Rap", duration: 187, image: "https://via.placeholder.com/40" },
        { id: 14, title: "Street Life", artist: "Haitham Yousif", genre: "Rap", duration: 234, image: "https://via.placeholder.com/40" },
        { id: 15, title: "Rhythm & Poetry", artist: "Haitham Yousif", genre: "Rap", duration: 256, image: "https://via.placeholder.com/40" }
      ]
    }
  ]);
  
  // Album drag and drop state
  const [albums, setAlbums] = useState([
    { id: 1, name: "First Album" },
    { id: 2, name: "Auston 2020 Tour" },
    { id: 3, name: "Break Up" },
    { id: 4, name: "Graduation" },
    { id: 5, name: "Ballin'" }
  ]);
  
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
          <hr style={{backgroundColor:"white", width:"100%"}}></hr>
          {availableGenres.length!==0 && <button className='add-genre-btn music-genre' onClick={handleGenres}>ADD GENRE</button>}
          {userGenres.length!==0 && <p>Click on Genre Icons to remove them</p>}
          {showGenreOptions && <select onChange={handleGenres} className='genre-drop-down' name='Genres'>
              <option value="">Select Genre</option>
              {availableGenres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
              <option className="close-option" style={{backgroundColor:"#EF9393",color:"black"}} value="close">Close</option>
          </select>}
          {userGenres.map(genre => <button key={genre} title='Remove Genre' className="music-genre" value={genre} onClick={removeGenre}>{genre}</button>)}
        </div>
       
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
                className="playlist-button"
                draggable
                onDragStart={(e) => handleAlbumDragStart(e, album)}
                onDragOver={(e) => handleAlbumDragOver(e, album)}
                onDragEnd={handleAlbumDragEnd}
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
      
      {selectedPlaylist && (
        <>
          {/* Single working back button styled to look like the original */}
          <div 
            className="styled-back-button"
            onClick={() => {
              console.log("Back button clicked");
              setSelectedPlaylist(null);
            }}
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
          />
        </>
      )}
    </div>
  );
};

export default UserPage;