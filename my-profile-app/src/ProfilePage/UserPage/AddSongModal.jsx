import React, { useState } from 'react';
import './AddSongModal.css';

const AddSongModal = ({ isOpen, onClose, onSubmit }) => {
  const [songName, setSongName] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [songFile, setSongFile] = useState(null);
  const [songImage, setSongImage] = useState(null);
  const [songImagePreview, setSongImagePreview] = useState(null);

  // Reset form when closing
  const handleClose = () => {
    setSongName('');
    setAlbumId('');
    setSongFile(null);
    setSongImage(null);
    setSongImagePreview(null);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: songName,
      albumId,
      file: songFile,
      image: songImage
    });
    handleClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSongImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSongImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    setSongFile(e.target.files[0]);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Song</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="songName">Song Name</label>
            <input
              type="text"
              id="songName"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="albumId">Album</label>
            <select
              id="albumId"
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              required
            >
              <option value="" disabled>Select an album</option>
              <option value="0">My Songs</option>
              <option value="1">First Album</option>
              <option value="2">Auston 2020 Tour</option>
              <option value="3">Break Up</option>
              <option value="4">Graduation</option>
              <option value="5">Ballin'</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="songFile">Song File</label>
            <input
              type="file"
              id="songFile"
              onChange={handleFileChange}
              accept="audio/*"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="songImage">Song Image</label>
            <input
              type="file"
              id="songImage"
              onChange={handleImageChange}
              accept="image/*"
              required
            />
            {songImagePreview && (
              <div className="image-preview">
                <img src={songImagePreview} alt="Song cover preview" />
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>Cancel</button>
            <button type="submit" className="submit-btn">Add Song</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSongModal;