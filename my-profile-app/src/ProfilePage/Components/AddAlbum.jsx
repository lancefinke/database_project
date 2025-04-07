import { useState } from "react";
import "./../../SignupPage/Signuppage.css";

const AddAlbum = () => {
    const [albumName, setAlbumName] = useState('');
    const [albumImage, setAlbumImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        setAlbumName(e.target.value);
    }
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAlbumImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
    
    const handleSubmit = () => {
        if (!albumName || !albumImage) {
            alert("Please provide both an album name and image.");
            return;
        }
        // Add your submission logic here
    }

    return (
        <div className="add-playlist-window" style={{width:'80%',marginLeft:'-40%'}}>
            <div className="form-section">
                <h1>New Album</h1>
                <label className="playlist-label" style={{marginLeft:'0px'}}>
                    ALBUM NAME
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
                        {imagePreview ? 'CHANGE IMAGE' : 'SELECT ALBUM COVER'}
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
                                alt="Album cover" 
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
                
                <button 
                    style={{marginTop: "10px"}} 
                    onClick={handleSubmit} 
                    className="add-playlist-btn"
                    disabled={!albumName || !albumImage}
                >
                    ADD ALBUM
                </button>
            </div>
        </div>
    );
}

export default AddAlbum;