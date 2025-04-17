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
  // Create a default album ID for "My Songs"
  const defaultAlbumId = 0;
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: '',
    onConfirm: null
  });
  
  // Album drag and drop state - with "My Songs" as the first album
  const [albums, setAlbums] = useState([
    { 
      id: defaultAlbumId, 
      name: "My Songs",
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 1001, title: "My First Song", artist: "Haitham Yousif", genre: "Pop", duration: 180, image: "https://via.placeholder.com/40", album: "My Songs" },
        { id: 1002, title: "Late Night Vibes", artist: "Haitham Yousif", genre: "R&B", duration: 210, image: "https://via.placeholder.com/40", album: "My Songs" },
        { id: 1003, title: "Weekend Mood", artist: "Haitham Yousif", genre: "Pop", duration: 195, image: "https://via.placeholder.com/40", album: "My Songs" },
        { id: 1004, title: "Studio Session", artist: "Haitham Yousif", genre: "Rap", duration: 225, image: "https://via.placeholder.com/40", album: "My Songs" },
      ]
    },
    { 
      id: 1, 
      name: "First Album",
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 101, title: "Album Intro", artist: "Haitham Yousif", genre: "R&B", duration: 120, image: "https://via.placeholder.com/40", album: "First Album" },
        { id: 102, title: "First Hit", artist: "Haitham Yousif", genre: "Pop", duration: 195, image: "https://via.placeholder.com/40", album: "First Album" },
        { id: 103, title: "New Sound", artist: "Haitham Yousif", genre: "R&B", duration: 210, image: "https://via.placeholder.com/40", album: "First Album" }
      ]
    },
    { 
      id: 2, 
      name: "Auston 2020 Tour",
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 104, title: "Tour Opening", artist: "Haitham Yousif", genre: "Pop", duration: 180, image: "https://via.placeholder.com/40", album: "Auston 2020 Tour" },
        { id: 105, title: "Auston Nights", artist: "Haitham Yousif", genre: "R&B", duration: 225, image: "https://via.placeholder.com/40", album: "Auston 2020 Tour" },
        { id: 106, title: "City Lights", artist: "Haitham Yousif", genre: "Pop", duration: 198, image: "https://via.placeholder.com/40", album: "Auston 2020 Tour" }
      ]
    },
    { 
      id: 3, 
      name: "Break Up",
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 107, title: "The End", artist: "Haitham Yousif", genre: "R&B", duration: 240, image: "https://via.placeholder.com/40", album: "Break Up" },
        { id: 108, title: "Missing You", artist: "Haitham Yousif", genre: "Pop", duration: 205, image: "https://via.placeholder.com/40", album: "Break Up" },
        { id: 109, title: "Better Days", artist: "Haitham Yousif", genre: "R&B", duration: 215, image: "https://via.placeholder.com/40", album: "Break Up" }
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
      name: "Liked Songs", 
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 1, title: "Summer Breeze", artist: "Haitham Yousif", genre: "R&B", duration: 213, image: "https://via.placeholder.com/40", album: "Summer Hits" },
        { id: 2, title: "Ocean Waves", artist: "Haitham Yousif", genre: "Pop", duration: 184, image: "https://via.placeholder.com/40", album: "Summer Hits" },
        { id: 3, title: "Sunset Melody", artist: "Haitham Yousif", genre: "R&B", duration: 245, image: "https://via.placeholder.com/40", album: "Summer Hits" }
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
        { id: 8, title: "Midnight Blues", artist: "Haitham Yousif", genre: "R&B", duration: 267, image: "https://via.placeholder.com/40", album: "Midnight Moods" },
        { id: 9, title: "Starry Sky", artist: "Haitham Yousif", genre: "Pop", duration: 198, image: "https://via.placeholder.com/40", album: "Midnight Moods" }
      ]
    },
    { 
      id: 4, 
      name: "Vibe", 
      image: "https://via.placeholder.com/100",
      songs: [
        { id: 10, title: "Good Mood", artist: "Haitham Yousif", genre: "Pop", duration: 210, image: "https://via.placeholder.com/40", album: "Positive Vibes" },
        { id: 11, title: "Feeling Good", artist: "Haitham Yousif", genre: "R&B", duration: 223, image: "https://via.placeholder.com/40", album: "Positive Vibes" },
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
    'R&B': {
      name: 'R&B',
      image: 'https://via.placeholder.com/100',
      songs: [
        { id: 1, title: "Summer Breeze", artist: "Haitham Yousif", genre: "R&B", duration: 213, image: "https://via.placeholder.com/40", album: "Summer Hits" },
        { id: 3, title: "Sunset Melody", artist: "Haitham Yousif", genre: "R&B", duration: 245, image: "https://via.placeholder.com/40", album: "Summer Hits" },
        { id: 8, title: "Midnight Blues", artist: "Haitham Yousif", genre: "R&B", duration: 267, image: "https://via.placeholder.com/40", album: "Midnight Moods" },
        { id: 11, title: "Feeling Good", artist: "Haitham Yousif", genre: "R&B", duration: 223, image: "https://via.placeholder.com/40", album: "Positive Vibes" },
        { id: 101, title: "Album Intro", artist: "Haitham Yousif", genre: "R&B", duration: 120, image: "https://via.placeholder.com/40", album: "First Album" },
        { id: 103, title: "New Sound", artist: "Haitham Yousif", genre: "R&B", duration: 210, image: "https://via.placeholder.com/40", album: "First Album" },
        { id: 105, title: "Auston Nights", artist: "Haitham Yousif", genre: "R&B", duration: 225, image: "https://via.placeholder.com/40", album: "Auston 2020 Tour" },
        { id: 107, title: "The End", artist: "Haitham Yousif", genre: "R&B", duration: 240, image: "https://via.placeholder.com/40", album: "Break Up" },
        { id: 109, title: "Better Days", artist: "Haitham Yousif", genre: "R&B", duration: 215, image: "https://via.placeholder.com/40", album: "Break Up" }
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
      if (album.id === parseInt(songData.albumId)) {
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
      
      // Show confirmation notification (optional)
      console.log(`"${song.title}" removed from your library`);
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
      
      // Show confirmation notification (optional)
      console.log(`"${song.title}" removed from ${selectedPlaylist ? 'playlist' : selectedAlbum ? 'album' : 'genre'}`);
    }
  };

  // Handle playlist deletion
  const handleDeletePlaylist = (e, playlistId) => {
    e.stopPropagation(); // Prevent triggering the click event on the playlist button
    
    // Find the playlist to be deleted
    const playlistToDelete = playlists.find(p => p.id === playlistId);
    
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
  
  // Close confirmation modal
  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, message: '', onConfirm: null });
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
            value="Small Creator that focuses on R&B and Rap style of music. "
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
          
          {role === 'artist' && (
            <button className="playlist-button add-btn" onClick={() => setShowAPwindow(true)}>
              <img
                src="https://via.placeholder.com/100"
                alt="Playlist Cover"
                className="playlist-image"
              />
              <span className="playlist-name"><strong>+ Add Playlist</strong></span>
            </button>
          )}

          {/* Playlist Modal */}
          <AddPlaylist
            isOpen={showAPwindow}
            onClose={() => setShowAPwindow(false)}
            onSubmit={(playlistData) => {
              // Handle new playlist creation
              console.log("Creating new playlist:", playlistData);
              
              // Create a new playlist object
              const newPlaylist = {
                id: Date.now(), // Generate a unique ID
                name: playlistData.name,
                image: playlistData.image ? URL.createObjectURL(playlistData.image) : "https://via.placeholder.com/100",
                songs: []
              };
              
              // Add the new playlist to the playlists array
              setPlaylists([...playlists, newPlaylist]);
              
              // Close the modal
              setShowAPwindow(false);
            }}
          />
          
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
              
              {/* Only show delete button if not "Liked Songs" playlist */}
              {playlist.name !== "Liked Songs" && (
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
            
            <button className="playlist-button add-btn" onClick={() => setShowAddAlbum(true)}>
              <img
                src="https://via.placeholder.com/100"
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
                <img
                  src={album.image}
                  alt={`${album.name} Cover`}
                  className="playlist-image"
                />
                <span className="playlist-name">{album.name}</span>
                
                {/* Only show delete button if not "My Songs" album */}
                {album.id !== defaultAlbumId && (
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
            ))}
          </div>
        )}
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
              <span>Back to My Songs</span>
            </div>
            
            <PlaylistSongList 
              songs={selectedPlaylist.songs} 
              playlistName={selectedPlaylist.name}
              playlistImage={selectedPlaylist.image}
              onSongSelect={onSongSelect}
              onDeleteSong={handleDeleteSong}
            />
          </div>
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
              <span>Back to My Songs</span>
            </div>
          )}
          
          <AlbumSongList 
            songs={selectedAlbum.songs} 
            playlistName={selectedAlbum.name}
            playlistImage={selectedAlbum.image}
            onSongSelect={onSongSelect}
            onDeleteSong={handleDeleteSong}
            isMyAlbum={selectedAlbum.id === defaultAlbumId}
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
            onSongSelect={onSongSelect}
          />
        </div>
        </>
      )}
      
      {/* Add Song Modal */}
      <AddSongModal 
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