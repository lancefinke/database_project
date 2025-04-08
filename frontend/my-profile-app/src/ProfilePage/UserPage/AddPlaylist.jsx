import React, { useState } from 'react';
import './AddPlaylist.css'; // Make sure to create this CSS file

const AddPlaylist = ({ onSubmit, onCancel }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [playlistImage, setPlaylistImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPlaylistImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playlistName.trim()) {
      alert('Please enter a playlist name');
      return;
    }
    
    onSubmit({
      name: playlistName,
      description,
      image: playlistImage
    });
  };

  return (
    <div className="add-playlist-form">
      <h2>Create New Playlist</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="playlistName">Playlist Name*</label>
          <input
            type="text"
            id="playlistName"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="playlistImage">Playlist Cover*</label>
          <input
            type="file"
            id="playlistImage"
            onChange={handleImageChange}
            accept="image/*"
            required
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Playlist cover preview" />
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
          <button type="submit" className="submit-btn">Create Playlist</button>
        </div>
      </form>
    </div>
  );
};

export default AddPlaylist;