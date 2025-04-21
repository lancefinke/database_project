// import React, { useState } from 'react';
// import { ImageUp, ListPlus, X } from 'lucide-react';
// import './AddSongModal.css';

// const AddSongModal = ({ isOpen, onClose, onSubmit }) => {
//   if (!isOpen) return null;

//   const [songName, setSongName] = useState('');
//   const [selectedAlbum, setSelectedAlbum] = useState('');
//   const [selectedGenres, setSelectedGenres] = useState([]);
//   const [audioFile, setAudioFile] = useState(null);
//   const [audioFileName, setAudioFileName] = useState('');
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState('https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=');

//   const genres = [
//     'pop', 'rock', 'hip-hop', 'rnb', 'electronic',
//     'country', 'jazz', 'blues', 'metal', 'classical',
//     'alternative', 'indie'
//   ];

//   const handleAudioChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setAudioFile(file);
//       setAudioFileName(file.name);
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleGenreChange = (e) => {
//     const genre = e.target.value;
//     if (!genre) return;
    
//     if (!selectedGenres.includes(genre)) {
//       setSelectedGenres([...selectedGenres, genre]);
//     }
//   };

//   const removeGenre = (genreToRemove) => {
//     setSelectedGenres(selectedGenres.filter(genre => genre !== genreToRemove));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (selectedGenres.length === 0) {
//       alert('Please select at least one genre');
//       return;
//     }
//     if (!audioFile) {
//       alert('Please select an audio file');
//       return;
//     }
//     if (!imageFile) {
//       alert('Please select an image for the song');
//       return;
//     }

//     onSubmit({
//       name: songName,
//       albumId: selectedAlbum || '0', // Default to "My Songs" if no album selected
//       genres: selectedGenres,
//       audioFile,
//       image: imageFile
//     });

//     // Reset form and close modal
//     setSongName('');
//     setSelectedAlbum('');
//     setSelectedGenres([]);
//     setAudioFile(null);
//     setAudioFileName('');
//     setImageFile(null);
//     setImagePreview('https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=');
//     onClose();
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2>Add New Song</h2>
//           <button className="close-button" onClick={onClose}>
//             <X size={20} />
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="song-name">Song Name</label>
//             <input
//               id="song-name"
//               type="text"
//               value={songName}
//               onChange={(e) => setSongName(e.target.value)}
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="album">Album</label>
//             <select 
//               id="album"
//               value={selectedAlbum}
//               onChange={(e) => setSelectedAlbum(e.target.value)}
//             >
//               <option value="0">My Songs</option>
//               <option value="1">First Album</option>
//               <option value="2">Auston 2020 Tour</option>
//               <option value="3">Break Up</option>
//               <option value="4">Graduation</option>
//               <option value="5">Ballin'</option>
//             </select>
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="genre">Genres (select multiple)</label>
//             <select 
//               id="genre"
//               value=""
//               onChange={handleGenreChange}
//               required={selectedGenres.length === 0}
//             >
//               <option value="">Add a genre</option>
//               {genres.map((genre) => (
//                 <option 
//                   key={genre} 
//                   value={genre}
//                   disabled={selectedGenres.includes(genre)}
//                 >
//                   {genre.charAt(0).toUpperCase() + genre.slice(1)}
//                 </option>
//               ))}
//             </select>
            
//             <div className="selected-genres">
//               {selectedGenres.length > 0 && (
//                 <div className="genre-tags">
//                   {selectedGenres.map(genre => (
//                     <span key={genre} className="genre-tag">
//                       {genre.charAt(0).toUpperCase() + genre.slice(1)}
//                       <button 
//                         type="button" 
//                         className="remove-genre" 
//                         onClick={() => removeGenre(genre)}
//                       >
//                         ×
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               )}
//               {selectedGenres.length === 0 && (
//                 <p className="genre-hint">Please select at least one genre</p>
//               )}
//             </div>
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="audio-file">Song File</label>
//             <input 
//               id="audio-file"
//               type="file" 
//               accept="audio/*"
//               onChange={handleAudioChange}
//               required
//             />
//             {audioFileName && <p>Selected: {audioFileName}</p>}
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="image-file">Song Image</label>
//             <input 
//               id="image-file"
//               type="file" 
//               accept="image/*"
//               onChange={handleImageChange}
//               required
//             />
//             <div className="image-preview">
//               <img src={imagePreview} alt="Song cover preview" />
//             </div>
//           </div>
          
//           <div className="form-actions">
//             <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
//             <button type="submit" className="submit-btn">Upload Song</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddSongModal;
import React, { useState, useEffect } from 'react';
import { ImageUp, ListPlus, X } from 'lucide-react';
import './AddSongModal.css';

const AddSongModal = ({ isOpen, onClose, onSubmit }) => {
  const [songName, setSongName] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [selectedGenres, setSelectedGenres] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=');
  const [currentUserId, setCurrentUserId] = useState('');
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        if (userId) {
          setCurrentUserId(userId);
          console.log("User ID extracted:", userId);
          fetchUserAlbums(userId); // Fetch albums when user ID is available
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

  const fetchUserAlbums = async (userId) => {
    try {
      const response = await fetch(`https://localhost:7152/api/database/GetUserAlbums?userID=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch albums");
      const data = await response.json();
      const formattedAlbums = data.map(album => ({
        id: album.AlbumID,
        name: album.Title
      }));
      setAlbums(formattedAlbums);
    } catch (err) {
      console.error("Error fetching albums:", err.message);
      setAlbums([]);
    }
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    uploadSong();
  };

  const uploadSong = async () => {
    if (!songName || !selectedGenres || !audioFile || !imageFile || !currentUserId) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("SongPicture", imageFile);
    formData.append("SongMP3", audioFile);

    const encodedSongName = encodeURIComponent(songName);
    const url = `https://localhost:7152/api/database/UploadSong?songName=${encodedSongName}&userID=${currentUserId}&albumID=${selectedAlbum}&genreCode=${selectedGenres}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      onSubmit?.({
        name: songName,
        albumId: selectedAlbum || '0',
        genres: selectedGenres,
        audioFile,
        image: imageFile
      });

      // Reset form state
      setSongName('');
      setSelectedAlbum('');
      setSelectedGenres('');
      setAudioFile(null);
      setAudioFileName('');
      setImageFile(null);
      setImagePreview('https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=');
      onClose();
    } catch (err) {
      console.error("Error uploading song:", err);
      alert("Error uploading song: " + err.message);
    }
  };

  if (!isOpen) return null;

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
              <option value="">Select an album</option>
              {albums.length > 0 ? albums.map(album => (
                <option key={album.id} value={album.id}>
                  {album.name}
                </option>
              )) : (
                <option disabled>No albums available</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre</label>
            <select
              id="genre"
              value={selectedGenres}
              onChange={(e) => setSelectedGenres(e.target.value)}
              required
            >
              <option value="">Pick a genre</option>
              <option value="1">Pop</option>
              <option value="2">Rock</option>
              <option value="3">Hip-Hop</option>
              <option value="4">R&B</option>
              <option value="5">Electronic</option>
              <option value="6">Country</option>
              <option value="7">Jazz</option>
              <option value="8">Blues</option>
              <option value="9">Metal</option>
              <option value="10">Classical</option>
              <option value="11">Alternative</option>
              <option value="12">Indie</option>
            </select>
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