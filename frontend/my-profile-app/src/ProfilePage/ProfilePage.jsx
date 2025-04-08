import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import PlaylistSongList from './Components/PlaylistSongList';
import AlbumSongList from './Components/AlbumSongList';
import GenreSongList from './Components/GenreSongList';

const ProfilePage = ({ onSongSelect }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  
  // Create a default album ID for "Their Songs"
  const defaultAlbumId = 0;
  
  // Album state - with "Their Songs" as the first album
  const [albums, setAlbums] = useState([
    { 
      id: defaultAlbumId, 
      name: "Their Songs",
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 1001, title: "My First Song", artist: "Haitham Yousif", genre: "Pop", duration: 180, image: "https://via.placeholder.com/40", album: "Their Songs" },
        { id: 1002, title: "Late Night Vibes", artist: "Haitham Yousif", genre: "RnB", duration: 210, image: "https://via.placeholder.com/40", album: "Their Songs" },
        { id: 1003, title: "Weekend Mood", artist: "Haitham Yousif", genre: "Pop", duration: 195, image: "https://via.placeholder.com/40", album: "Their Songs" },
        { id: 1004, title: "Studio Session", artist: "Haitham Yousif", genre: "Rap", duration: 225, image: "https://via.placeholder.com/40", album: "Their Songs" },
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
    }
  ]);
  
  // Set the default album as initially selected
  const [selectedAlbum, setSelectedAlbum] = useState(albums[0]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  
  // Playlist state
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
        { id: 6, title: "Lift Heavy", artist: "Haitham Yousif", genre: "Rock", duration: 230, image: "https://via.placeholder.com/40", album: "Workout Collection" }
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
        { id: 8, title: "Midnight Blues", artist: "Haitham Yousif", genre: "RnB", duration: 267, image: "https://via.placeholder.com/40", album: "Midnight Moods" }
      ]
    },
    'Rap': {
      name: 'Rap',
      image: 'https://via.placeholder.com/100',
      songs: [
        { id: 5, title: "Run Fast", artist: "Haitham Yousif", genre: "Rap", duration: 176, image: "https://via.placeholder.com/40", album: "Workout Collection" }
      ]
    },
    'Pop': {
      name: 'Pop',
      image: 'https://via.placeholder.com/100',
      songs: [
        { id: 2, title: "Ocean Waves", artist: "Haitham Yousif", genre: "Pop", duration: 184, image: "https://via.placeholder.com/40", album: "Summer Hits" },
        { id: 9, title: "Starry Sky", artist: "Haitham Yousif", genre: "Pop", duration: 198, image: "https://via.placeholder.com/40", album: "Midnight Moods" }
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

  // Handle playlist click
  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
    setSelectedAlbum(null); 
    setSelectedGenre(null);
  };
  
  // Handle album click
  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setSelectedPlaylist(null);
    setSelectedGenre(null);
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
    setSelectedAlbum(albums[0]);
  };
  
  const handleBackFromGenre = () => {
    setSelectedGenre(null);
    setSelectedAlbum(albums[0]);
  };
  
  const handleBackFromAlbum = (album) => {
    if (album.id !== defaultAlbumId) {
      setSelectedAlbum(albums[0]);
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
        <h1 className="profile-name">Haitham yousif</h1>
        
        <p className="profile-bio">
          Small Creator that focuses on Rnb and Rap style of music.
        </p>
        
        <div className="stats-container">
          <p className="follower-count">Followers: 10.2K</p>
          <p className="total-listens">Total Listens: 1.5M</p>
        </div>
        
        <button 
          className={`follow-button ${isFollowing ? 'following' : ''}`}
          onClick={() => setIsFollowing(!isFollowing)}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
        
        <div className="music-container">
          <button className="music-genre" onClick={() => handleGenreClick('Rnb')}>Rnb</button>
          <button className="music-genre" onClick={() => handleGenreClick('Rap')}>Rap</button>
          <button className="music-genre" onClick={() => handleGenreClick('Pop')}>Pop</button>
          <button className="music-genre" onClick={() => handleGenreClick('Rock')}>Rock</button>
        </div>

        <div className="playlist-container">
          <div className="section-header">
            <h1>Playlists</h1>
          </div>
          
          {playlists.map(playlist => (
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
          ))}
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
            onSongSelect={onSongSelect}
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

export default ProfilePage;