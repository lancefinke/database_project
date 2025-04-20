import React, { useState } from 'react';
import { ImageUp, ListPlus, X } from 'lucide-react';
import './AddSongModal.css';

const AddSongModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const [songName, setSongName] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=');

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

  const handleSubmit = (e) => {
    e.preventDefault();
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

    onSubmit({
      name: songName,
      albumId: selectedAlbum || '0', // Default to "My Songs" if no album selected
      genres: selectedGenres,
      audioFile,
      image: imageFile
    });

    // Reset form and close modal
    setSongName('');
    setSelectedAlbum('');
    setSelectedGenres([]);
    setAudioFile(null);
    setAudioFileName('');
    setImageFile(null);
    setImagePreview('https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=');
    onClose();
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
            <label htmlFor="album">Album</label>
            <select 
              id="album"
              value={selectedAlbum}
              onChange={(e) => setSelectedAlbum(e.target.value)}
            >
              <option value="0">My Songs</option>
              <option value="1">First Album</option>
              <option value="2">Auston 2020 Tour</option>
              <option value="3">Break Up</option>
              <option value="4">Graduation</option>
              <option value="5">Ballin'</option>
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
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Upload Song</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSongModal;