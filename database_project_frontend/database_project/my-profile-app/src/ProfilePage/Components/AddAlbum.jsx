
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import "./AddPlaylist.css"; // Your modal styles

const AddAlbum = ({ isOpen, onClose, onSubmit }) => {
    const [albumName, setAlbumName] = useState('');
    const [description, setDescription] = useState('');
    const [albumImage, setAlbumImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=");
    const [currentUserId, setCurrentUserId] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            if (userId) {
            setCurrentUserId(userId);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        setAlbumImage(file);
        setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!albumName || !albumImage) {
        alert("Please provide both an album name and image.");
        return;
        }

        const formData = new FormData();
        formData.append("AlbumPicture", albumImage);

        const titleEncoded = encodeURIComponent(albumName);
        const descriptionEncoded = encodeURIComponent(description);

        const url = `http://localhost:5142/api/database/UploadAlbum?albumName=${titleEncoded}&userID=${currentUserId}&AlbumDescription=${descriptionEncoded}`;

        try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            console.log("Album added successfully");

            onSubmit?.({
            name: albumName,
            image: albumImage,
            description
            });

            // Reset form
            setAlbumName('');
            setDescription('');
            setAlbumImage(null);
            setImagePreview("https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=");
            onClose?.();
        } else {
            const errText = await response.text();
            console.error("Upload failed:", errText);
            alert("Failed to upload album.");
        }
        } catch (error) {
        console.error("Error adding album:", error.message);
        alert("Something went wrong while adding the album.");
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-header">
            <h2>New Album</h2>
            <button className="close-button" onClick={onClose}>
                <X size={20} />
            </button>
            </div>

            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="album-name">Album Name</label>
                <input
                id="album-name"
                type="text"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="album-description">Album Description</label>
                <input
                id="album-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="album-image">Album Cover</label>
                <input
                id="album-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!albumImage}
                />
                <div className="image-preview">
                <img src={imagePreview} alt="Album cover preview" />
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
                </button>
                <button
                type="submit"
                className="submit-btn"
                disabled={!albumName || !albumImage}
                >
                Create Album
                </button>
            </div>
            </form>
        </div>
        </div>,
        document.body
    );
    };

export default AddAlbum;