import React, { useState, useContext } from 'react';
import { ImageUp, ListPlus, X } from 'lucide-react';
import './AddSongModal.css';
import { useUserContext } from "../../LoginContext/UserContext"; 

// Update the function signature to include defaultAlbumId
const AddSongModal = ({ isOpen, onClose, onSubmit, albums, defaultAlbumId }) => {
  if (!isOpen) return null;


  const { user } = useUserContext(); 
  const currentUserId = user?.UserID;
  
  console.log("ALL USER RETRIEVED DATA:", user);

  const [songName, setSongName] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState('0');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=');
  const [isUploading, setIsUploading] = useState(false);

  const genres = [
    'pop', 'rock', 'hip-hop', 'rnb', 'electronic',
    'country', 'jazz', 'blues', 'metal', 'classical',
    'alternative', 'indie'
  ];

  const handleAudioChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioFileName(file.name);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    if (!genre) return;
    
    if (!selectedGenres.includes(genre)) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const removeGenre = (genreToRemove) => {
    setSelectedGenres(selectedGenres.filter(genre => genre !== genreToRemove));
  };

  // Update handleSubmit function to use URL parameters where possible
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (selectedGenres.length === 0) {
      alert('Please select at least one genre');
      return;
    }
    if (!audioFile) {
      alert('Please select an audio file');
      return;
    }
    if (!imageFile) {
      alert('Please select an image for the song');
      return;
    }
    if (!currentUserId) {
      alert('User ID not found. Please log in again.');
      return;
    }

    // Encode parameters for URL
    const songNameEncoded = encodeURIComponent(songName);
    const albumID = selectedAlbumId || 0;
    const genreToCodeMap = {
      'pop': 1, 'rock': 2, 'hiphop': 3, 'hip-hop': 3,
      'r&b': 4, 'rnb': 4, 'electronic': 5, 'country': 6, 
      'jazz': 7, 'blues': 8, 'metal': 9, 'classical': 10,
      'alternative': 11, 'indie': 12
    };
    
    // Get genre code
    const genreCode = selectedGenres.length > 0 ? 
      genreToCodeMap[selectedGenres[0].toLowerCase()] || 1 : 1;
      
    // Create URL with query parameters for text data
    const url = `https://localhost:7152/api/database/UploadSong?songName=${songNameEncoded}&UserID=${currentUserId}&albumID=${albumID}&genreCode=${genreCode}`;
    
    // Files still need FormData
    const formData = new FormData();
    formData.append('SongMP3', audioFile);
    formData.append('SongPicture', imageFile);
    
    // Show loading indicator
    setIsUploading(true);
    
    // Make API request with URL parameters + form data for files
    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Upload successful:', data);
      alert('Song uploaded successfully!');
      
      // Reset form and notify parent component
      setSongName('');
      setSelectedAlbumId('');
      setSelectedGenres([]);
      setAudioFile(null);
      setAudioFileName('');
      setImageFile(null);
      setImagePreview('https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=');
      
      onSubmit({
        name: songName,
        albumId: selectedAlbumId || null,
        genres: selectedGenres
      });
      
      onClose();
    })
    .catch(error => {
      console.error('Error uploading song:', error);
      alert('Failed to upload song: ' + error.message);
    })
    .finally(() => {
      setIsUploading(false);
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Song</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="song-name">Song Name</label>
            <input
              id="song-name"
              type="text"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Album</label>
            <select 
              value={selectedAlbumId || ''}
              onChange={(e) => setSelectedAlbumId(e.target.value)}
              className="form-control"
            >
              <option value="">No album - add to My Songs collection</option>
              {/* Filter out the My Songs album */}
              {albums
                .filter(album => album.id !== defaultAlbumId) // Remove My Songs from options
                .map(album => (
                  <option key={album.id} value={album.id}>{album.name}</option>
                ))
              }
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="genre">Genres (select multiple)</label>
            <select 
              id="genre"
              value=""
              onChange={handleGenreChange}
              required={selectedGenres.length === 0}
            >
              <option value="">Add a genre</option>
              {genres.map((genre) => (
                <option 
                  key={genre} 
                  value={genre}
                  disabled={selectedGenres.includes(genre)}
                >
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
            
            <div className="selected-genres">
              {selectedGenres.length > 0 && (
                <div className="genre-tags">
                  {selectedGenres.map(genre => (
                    <span key={genre} className="genre-tag">
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                      <button 
                        type="button" 
                        className="remove-genre" 
                        onClick={() => removeGenre(genre)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {selectedGenres.length === 0 && (
                <p className="genre-hint">Please select at least one genre</p>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="audio-file">Song File</label>
            <input 
              id="audio-file"
              type="file" 
              accept="audio/*"
              onChange={handleAudioChange}
              required
            />
            {audioFileName && <p>Selected: {audioFileName}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="image-file">Song Image</label>
            <input 
              id="image-file"
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            <div className="image-preview">
              <img src={imagePreview} alt="Song cover preview" />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isUploading}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Song'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSongModal;