import { useState, useEffect } from "react";
import "./../../SignupPage/Signuppage.css";



const AddAlbum = () => {
    const [albumName, setAlbumName] = useState('');
    const [albumImage, setAlbumImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [description,setDescription] = useState('');
     const [currentUserId, setCurrentUserId] = useState("");
    
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
    



    const handleChange = (e) => {
        setAlbumName(e.target.value);
    }


    const handleDescriptionChange = (e) =>{
        setDescription(e.target.value);
    }
   
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImagePreview(file ? URL.createObjectURL(file):undefined)
        setAlbumImage(file);
        console.log(albumImage);
    }


    const addAlbum = async () => {
        const formData = new FormData();
       
        // Append the image to formData
        formData.append("AlbumPicture", albumImage);  // albumImage should be a file
     
        // URL parameters
        //const userIdEncoded = encodeURIComponent(user.UserID);
        const titleEncoded = encodeURIComponent(albumName);
        const descriptionEncoded = encodeURIComponent(description);
       
        // Construct the URL with query parameters
        const url = `https://localhost:7152/api/database/UploadAlbum?albumName=${titleEncoded}&artistID=${currentUserId}&AlbumDescription=${descriptionEncoded}`;
     
        try {
          const response = await fetch(url, {
            method: "POST",
            body: formData,  // The formData that includes the image
          });
         
        if(response.ok){
            console.log('Album added successfully');
        }
        } catch (error) {
          console.log("Error adding album:", error.message);
        }
      };
   
    const handleSubmit = () => {
        if (!albumName || !albumImage) {
            alert("Please provide both an album name and image.");
            return;
        }
        // Add your submission logic here
        addAlbum();
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


                <label className="playlist-label" style={{marginLeft:'0px'}}>
                    ALBUM DESCRIPTION
                    <input
                        required
                        type='text'
                        className='playlist-text'
                        style={{width:'90%',height:'25px'}}
                        onChange={handleDescriptionChange}
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
                            style={{display:"none"}}
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
