import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import "./AddPlaylist.css";

const AddPlaylist = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;
    
    const [privacyStatus, setPrivacyStatus] = useState('public');
    const [playlistName, setPlaylistName] = useState('');
    const [playlistImage, setPlaylistImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=");
    const [currentUserId, setCurrentUserId] = useState("");

    const changeStatus = (e) => {
        setPrivacyStatus(e.target.value);
    }
    
    const handleChange = (e) => {
        setPlaylistName(e.target.value);
    }
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPlaylistImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            if (userId) {
              setCurrentUserId(userId);
              console.log("User ID extracted:", userId);
            } else {
              console.error("Could not find userID in token");
            }
          } catch (error) {
            console.error("Error parsing JWT token:", error);
          }
        } else {
          console.log("No token found in localStorage");
        }
      }, []);
    const addPlaylist = async()=>{
        const formData = new FormData();

        formData.append("PlaylistPicture", playlistImage);

        // URL-encoded values

        const titleEncoded = encodeURIComponent(playlistName);


        const url = `http://localhost:5142/api/database/AddPlaylist?UserID=${currentUserId}&Title=${titleEncoded}&Description=${"null"}`;

        try {
          const response = await fetch(url, {
            method: "POST",
            body: formData,
          });

          if(response.ok){
            console.log('Playlist added successfully');
          }

        } catch (err) {
          console.error("Error registering user:", err);
        }
    }
    const handleSubmit = () => {
        if (!playlistName || !playlistImage) {
            alert("Please provide both a playlist name and image.");
            return;
        }
        // Add your submission logic here
        addPlaylist();
        // Reset form
        setPlaylistName('');
        setPlaylistImage(null);
        setImagePreview("https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=");
        setPrivacyStatus('public');
        onClose && onClose();
    }
    
    // Create the modal markup to be rendered with portal
    const modalContent = (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>New Playlist</h2>
                    <button className="close-button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="playlist-name">Playlist Name</label>
                        <input 
                            id="playlist-name"
                            type="text" 
                            value={playlistName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Privacy Setting</label>
                        <div className="privacy-options">
                            <label className={`privacy-option ${privacyStatus === 'private' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="privacy" 
                                    value="private" 
                                    checked={privacyStatus === "private"} 
                                    onChange={changeStatus}
                                />
                                Private
                            </label>
                            <label className={`privacy-option ${privacyStatus === 'public' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="privacy" 
                                    value="public" 
                                    checked={privacyStatus === "public"} 
                                    onChange={changeStatus}
                                />
                                Public
                            </label>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="playlist-image">Playlist Image</label>
                        <input 
                            id="playlist-image"
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            required={!playlistImage}
                        />
                        <div className="image-preview">
                            <img src={imagePreview} alt="Playlist cover" />
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={!playlistName || !playlistImage}
                        >
                            Create Playlist
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    // Use React Portal to render outside the normal DOM hierarchy
    return ReactDOM.createPortal(modalContent, document.body);
}
export default AddPlaylist;