import React from 'react';
import './PlaylistSongList.css';

const AlbumSongList = ({ songs, playlistName, playlistImage, onSongSelect }) => {
  // Function to format seconds to mm:ss
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };


  const addAlbum = async () => {
    const formData = new FormData();
   
    // Append the image to formData
    formData.append("AlbumPicture", albumImage);  // albumImage should be a file
 
    // URL parameters
    const userIdEncoded = encodeURIComponent(user.UserID);
    const titleEncoded = encodeURIComponent(albumName);
    const descriptionEncoded = encodeURIComponent(description);
   
    // Construct the URL with query parameters
    const url = `https://localhost:7152/api/database/UploadAlbum?albumName=${titleEncoded}&artistID=${userIdEncoded}&AlbumDescription=${descriptionEncoded}`;
 
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


  const handleSongClick = (song) => {
    if (onSongSelect) {
      onSongSelect({
        name: song.title,
        creator: song.artist,
        songSrc: song.songSrc || song.SongFileName
      });
    }
  };

  return (
    <div className="playlist-song-list-container">
      {/* No back button here - it's now in the parent component */}
      
      <div className="playlist-header">
        <div className="playlist-info">
          <img 
            src={playlistImage || "https://via.placeholder.com/100"} 
            alt={playlistName} 
            className="playlist-header-image" 
          />
          <div className="playlist-header-text">
            <h2 className="playlist-title">{playlistName || "Album"}</h2>
            <p className="song-count">{songs.length} songs</p>
          </div>
        </div>
      </div>
      
      <div className="songs-table">
        <div className="songs-table-header">
          <div className="song-number-header">#</div>
          <div className="song-info-header">TITLE</div>
          <div className="song-genre-header">GENRE</div>
          <div className="song-duration-header">DURATION</div>
        </div>
        
        <div className="songs-list">
          {songs.map((song, index) => (
            <div key={song.id} className="song-row" onClick={() => handleSongClick(song)}>
              <div className="song-number-cell">
                <span className="song-number">{index + 1}</span>
                <button className="play-button" onClick={(e) => {
                  e.stopPropagation();
                  handleSongClick(song);
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"></path>
                  </svg>
                </button>
              </div>
              <div className="song-info">
                <img 
                  src={song.image || "https://via.placeholder.com/40"} 
                  alt={song.title} 
                  className="song-image" 
                />
                <div className="song-text">
                  <div className="song-title">{song.title}</div>
                  <div className="song-artist">{song.artist}</div>
                </div>
              </div>
              <div className="song-genre">{song.genre}</div>
              <div className="song-duration">{formatDuration(song.duration)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumSongList;