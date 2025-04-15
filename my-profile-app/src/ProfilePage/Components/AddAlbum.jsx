import React, { useState } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import "./AddPlaylist.css"; // Reusing the same CSS file

const AddAlbum = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;
    
    const [albumName, setAlbumName] = useState('');
    const [albumImage, setAlbumImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=");

    const handleChange = (e) => {
        setAlbumName(e.target.value);
    }
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAlbumImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!albumName || !albumImage) {
            alert("Please provide both an album name and image.");
            return;
        }
        
        onSubmit && onSubmit({
            name: albumName,
            image: albumImage
        });
        
        // Reset form
        setAlbumName('');
        setAlbumImage(null);
        setImagePreview("https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=");
        onClose && onClose();
    }

    // Use React Portal to render the modal outside the normal DOM hierarchy
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
                            onChange={handleChange}
                            required
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
                            <img src={imagePreview} alt="Album cover" />
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
        document.body // This renders the modal directly in the body element
    );
}

export default AddAlbum;