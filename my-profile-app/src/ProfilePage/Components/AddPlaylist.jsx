import { useState } from "react";
import "./../../SignupPage/Signuppage.css";

const AddPlaylist = () => {
    const [privacyStatus, setPrivacyStatus] = useState('public');
    const [playlistName, setPlaylistName] = useState('');
    const [playlistImage, setPlaylistImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

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
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
    
    const handleSubmit = () => {
        if (!playlistName || !playlistImage) {
            alert("Please provide both a playlist name and image.");
            return;
        }
        // Add your submission logic here
    }

    return (
        <div className="add-playlist-window" style={{width:'80%',marginLeft:'-40%'}}>
            <div className="form-section">
                <h1>New Playlist</h1>
                <label className="playlist-label" style={{marginLeft:'0px'}}>
                    PLAYLIST NAME
                    <input 
                        required 
                        type='text' 
                        className='playlist-text' 
                        style={{width:'90%',height:'25px'}} 
                        onChange={handleChange}
                    />
                </label>
                
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '15px'}}>
                    <label className="image-btn">
                        {imagePreview ? 'CHANGE IMAGE' : 'SELECT COVER IMAGE'}
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="signup-pfp" 
                            onChange={handleImageChange} 
                            required
                        />
                    </label>
                    
                    {imagePreview && (
                        <div style={{marginTop: '15px'}}>
                            <img 
                                src={imagePreview} 
                                alt="Playlist cover" 
                                style={{
                                    width: '150px', 
                                    height: '150px', 
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '2px solid white'
                                }} 
                            />
                        </div>
                    )}
                </div>
                
                <div className='roles'>
                    <label className='artist-btn'>
                        PRIVATE
                        <input 
                            type='radio' 
                            id='private' 
                            name='privacy' 
                            value='private' 
                            checked={privacyStatus === "private"} 
                            onChange={changeStatus}
                        />
                    </label>
                    <label className='listener-btn'>
                        PUBLIC
                        <input 
                            type='radio' 
                            id='public' 
                            name='privacy' 
                            value='public' 
                            checked={privacyStatus === "public"} 
                            onChange={changeStatus}
                        />
                    </label>
                </div>
                
                <button 
                    style={{marginTop: "10px"}} 
                    onClick={handleSubmit} 
                    className="add-playlist-btn"
                    disabled={!playlistName || !playlistImage}
                >
                    ADD PLAYLIST
                </button>
            </div>
        </div>
    );
}

export default AddPlaylist;