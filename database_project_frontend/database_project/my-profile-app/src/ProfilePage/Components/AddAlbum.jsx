// import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
// import { X } from "lucide-react";
// import "./AddPlaylist.css"; // Reusing the same CSS file

// const AddAlbum = ({ isOpen, onClose, onSubmit }) => {
//     if (!isOpen) return null;
    
//     const [albumName, setAlbumName] = useState('');
//     const [albumImage, setAlbumImage] = useState(null);
//     const [imagePreview, setImagePreview] = useState("https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=");

//     const handleChange = (e) => {
//         setAlbumName(e.target.value);
//     }
    
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setAlbumImage(file);
//             setImagePreview(URL.createObjectURL(file));
//         }
//     }
    
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!albumName || !albumImage) {
//             alert("Please provide both an album name and image.");
//             return;
//         }
        
//         onSubmit && onSubmit({
//             name: albumName,
//             image: albumImage
//         });
        
//         // Reset form
//         setAlbumName('');
//         setAlbumImage(null);
//         setImagePreview("https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=");
//         onClose && onClose();
//     }

//     // Use React Portal to render the modal outside the normal DOM hierarchy
//     return ReactDOM.createPortal(
//         <div className="modal-overlay">
//             <div className="modal-content">
//                 <div className="modal-header">
//                     <h2>New Album</h2>
//                     <button className="close-button" onClick={onClose}>
//                         <X size={20} />
//                     </button>
//                 </div>
                
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label htmlFor="album-name">Album Name</label>
//                         <input 
//                             id="album-name"
//                             type="text" 
//                             value={albumName}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
                    
//                     <div className="form-group">
//                         <label htmlFor="album-image">Album Cover</label>
//                         <input 
//                             id="album-image"
//                             type="file" 
//                             accept="image/*" 
//                             onChange={handleImageChange}
//                             required={!albumImage}
//                         />
//                         <div className="image-preview">
//                             <img src={imagePreview} alt="Album cover" />
//                         </div>
//                     </div>
                    
//                     <div className="form-actions">
//                         <button type="button" className="cancel-btn" onClick={onClose}>
//                             Cancel
//                         </button>
//                         <button 
//                             type="submit" 
//                             className="submit-btn"
//                             disabled={!albumName || !albumImage}
//                         >
//                             Create Album
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>,
//         document.body // This renders the modal directly in the body element
//     );
// }

// export default AddAlbum;


// //import { useState, useEffect } from "react";


// import "./../../SignupPage/Signuppage.css";



// const AddAlbum = () => {
//     const [albumName, setAlbumName] = useState('');
//     const [albumImage, setAlbumImage] = useState(null);
//     const [imagePreview, setImagePreview] = useState(null);
//     const [description,setDescription] = useState('');
//      const [currentUserId, setCurrentUserId] = useState("");
    
//       useEffect(() => {
//         const token = localStorage.getItem('userToken');
//         if (token) {
//           try {
//             const payload = JSON.parse(atob(token.split('.')[1]));
//             const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
//             if (userId) {
//               setCurrentUserId(userId);
//               console.log("User ID extracted:", userId);
//             } else {
//               console.error("Could not find userID in token");
//             }
//           } catch (error) {
//             console.error("Error parsing JWT token:", error);
//           }
//         } else {
//           console.log("No token found in localStorage");
//         }
//       }, []);
    



//     const handleChange = (e) => {
//         setAlbumName(e.target.value);
//     }


//     const handleDescriptionChange = (e) =>{
//         setDescription(e.target.value);
//     }
   
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         setImagePreview(file ? URL.createObjectURL(file):undefined)
//         setAlbumImage(file);
//         console.log(albumImage);
//     }


//     const addAlbum = async () => {
//         const formData = new FormData();
       
//         // Append the image to formData
//         formData.append("AlbumPicture", albumImage);  // albumImage should be a file
     
//         // URL parameters
//         //const userIdEncoded = encodeURIComponent(user.UserID);
//         const titleEncoded = encodeURIComponent(albumName);
//         const descriptionEncoded = encodeURIComponent(description);
       
//         // Construct the URL with query parameters
//         const url = `https://localhost:7152/api/database/UploadAlbum?albumName=${titleEncoded}&userID=${currentUserId}&AlbumDescription=${descriptionEncoded}`;

     
//         try {
//           const response = await fetch(url, {
//             method: "POST",
//             body: formData,  // The formData that includes the image
//           });
         
//         if(response.ok){
//             console.log('Album added successfully');
//         }
//         } catch (error) {
//           console.log("Error adding album:", error.message);
//         }
//       };
   
//     const handleSubmit = () => {
//         if (!albumName || !albumImage) {
//             alert("Please provide both an album name and image.");
//             return;
//         }
//         // Add your submission logic here
//         addAlbum();
//     }


//     return (
//         <div className="add-playlist-window" style={{width:'80%',marginLeft:'-40%'}}>
//             <div className="form-section">
//                 <h1>New Album</h1>
//                 <label className="playlist-label" style={{marginLeft:'0px'}}>
//                     ALBUM NAME
//                     <input
//                         required
//                         type='text'
//                         className='playlist-text'
//                         style={{width:'90%',height:'25px'}}
//                         onChange={handleChange}
//                     />
//                 </label>


//                 <label className="playlist-label" style={{marginLeft:'0px'}}>
//                     ALBUM DESCRIPTION
//                     <input
//                         required
//                         type='text'
//                         className='playlist-text'
//                         style={{width:'90%',height:'25px'}}
//                         onChange={handleDescriptionChange}
//                     />
//                 </label>
               
//                 <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '15px'}}>
//                     <label className="image-btn">
//                         {imagePreview ? 'CHANGE IMAGE' : 'SELECT ALBUM COVER'}
//                         <input
//                             type="file"
//                             accept="image/*"
//                             className="signup-pfp"
//                             onChange={handleImageChange}
//                             required
//                             style={{display:"none"}}
//                         />
//                     </label>
                   
//                     {imagePreview && (
//                         <div style={{marginTop: '15px'}}>
//                             <img
//                                 src={imagePreview}
//                                 alt="Album cover"
//                                 style={{
//                                     width: '150px',
//                                     height: '150px',
//                                     objectFit: 'cover',
//                                     borderRadius: '8px',
//                                     border: '2px solid white'
//                                 }}
//                             />
//                         </div>
//                     )}
//                 </div>
               
//                 <button
//                     style={{marginTop: "10px"}}
//                     onClick={handleSubmit}
//                     className="add-playlist-btn"
//                     disabled={!albumName || !albumImage}
//                 >
//                     ADD ALBUM
//                 </button>
//             </div>
//         </div>
//     );
// }


// export default AddAlbum;
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

        const url = `https://localhost:7152/api/database/UploadAlbum?albumName=${titleEncoded}&userID=${currentUserId}&AlbumDescription=${descriptionEncoded}`;

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