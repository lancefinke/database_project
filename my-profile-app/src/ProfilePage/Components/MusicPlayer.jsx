import React, { useState, useRef } from "react";
import { Pause, SkipForward, SkipBack, Shuffle, Plus, Check, Volume2, Flag, Star } from "lucide-react";
import Editable from "./Editable";
import PlaylistSelectionPopup from "./PlaylistSelectionPopup";
import "./MusicPlayer.css";

// FlagReport component
const FlagReport = ({ onClose }) => {
  return (
    <>
      <div className="music-player-overlay"></div>
      <div className="music-player-flag-wrapper">
        <label style={{margin:"0 auto", textAlign:"center"}}>REASON FOR REPORT</label>
        <div className="editable-div-flag" style={{border:"3px solid white", borderRadius:"10px", width:"85%", margin:"auto", height:"60%"}}>
          <Editable 
            className="flag-editable"
            title="Enter the reason for the report"
            value=""
            div_width="90%"
            div_height="90%"
            backgroundColor="#8E1616"
            textColor="white"
            placeholder="Example: Racism, hate speech promotes violence, etc."
          />
        </div>
        <button className="submit-report-btn">REPORT SONG</button>
        <button onClick={onClose} className="cancel-report-btn">CANCEL</button>
      </div>
    </>
  );
};

// RatingDropdown component
const RatingDropdown = ({ rating, onRate, onClose }) => {
  return (
    <>
      <div className="music-player-overlay" onClick={onClose}></div>
      <div className="rating-dropdown">
        <div className="rating-title">RATE THIS SONG</div>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <div 
              key={star} 
              className={`rating-star ${rating >= star ? 'active' : ''}`} 
              onClick={() => onRate(star)}
            >
              <Star 
                size={24} 
                fill={rating >= star ? "#FFC107" : "none"} 
                color={rating >= star ? "#FFC107" : "white"} 
              />
              <span>{star}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="rating-close-btn">CLOSE</button>
      </div>
    </>
  );
};

const MusicPlayer = ({ song, artist, pageName, playlist }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [songAdded, setSongAdded] = useState(false);
  const [prevPressed, setPrevPressed] = useState(false);
  const [nextPressed, setNextPressed] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showPlaylistSelection, setShowPlaylistSelection] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const audioRef = useRef(null);
  
  // Mock data for available playlists
  const [availablePlaylists, setAvailablePlaylists] = useState([
    { id: 1, name: "Chill Vibes", image: "https://via.placeholder.com/100" },
    { id: 2, name: "Workout Hits", image: "https://via.placeholder.com/100" },
    { id: 3, name: "Late Night", image: "https://via.placeholder.com/100" },
    { id: 4, name: "Vibe", image: "https://via.placeholder.com/100" },
    { id: 5, name: "Rap", image: "https://via.placeholder.com/100" }
  ]);
  
  // Current song information
  const currentSong = {
    id: 101,
    title: song || "Song Title",
    artist: artist || "Artist Name",
    image: "https://via.placeholder.com/150"
  };

  // Apply page-specific class if provided
  const playerClassName = `music-player-new ${pageName ? `music-player-${pageName}` : ""}`;

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  const toggleAddToPlaylist = () => {
    setShowPlaylistSelection(true);
  };
  
  const handleAddToPlaylist = (playlistId) => {
    console.log(`Adding song to playlist with ID: ${playlistId}`);
    setSongAdded(true);
    setShowPlaylistSelection(false);
    
    setTimeout(() => {
      setSongAdded(false);
    }, 3000);
  };

  const toggleReporting = () => {
    setIsReporting(!isReporting);
    setShowReportForm(true);
  };

  const handleCloseReport = () => {
    setShowReportForm(false);
    setIsReporting(false);
  };

  const toggleRating = () => {
    setShowRatingDropdown(!showRatingDropdown);
  };

  const handleRateSong = (rating) => {
    setCurrentRating(rating);
    console.log(`Rating song as ${rating} stars`);
  };

  const handlePrevious = () => {
    setPrevPressed(true);
    setTimeout(() => setPrevPressed(false), 200);
  };

  const handleNext = () => {
    setNextPressed(true);
    setTimeout(() => setNextPressed(false), 200);
  };

  return (
    <>
      {showReportForm && <FlagReport onClose={handleCloseReport} />}
      
      {showPlaylistSelection && (
        <PlaylistSelectionPopup 
          onClose={() => setShowPlaylistSelection(false)}
          playlists={availablePlaylists}
          onAddToPlaylist={handleAddToPlaylist}
          currentSong={currentSong}
        />
      )}
      
      {showRatingDropdown && (
        <RatingDropdown 
          rating={currentRating}
          onRate={handleRateSong}
          onClose={() => setShowRatingDropdown(false)}
        />
      )}
      
      <div className={playerClassName}>
        {/* Song Info Section */}
        <div className="player-song-info">
          <img 
            src="https://via.placeholder.com/150" 
            alt="Album cover" 
            className="player-album-cover" 
          />
          <div className="player-text-info">
            <p className="player-song-title">{song || "Song Title"}</p>
            <p className="player-artist-name">{artist || "Artist Name"}</p>
          </div>
        </div>
        
        {/* Main Player Controls */}
        <div className="player-controls-section">
          {/* Progress Bar */}
          <div className="player-progress">
            <span className="player-time">0:00</span>
            <div className="player-progress-bar-container">
              <div className="player-progress-bar-bg">
                <div className="player-progress-bar" style={{ width: "0%" }}></div>
              </div>
            </div>
            <span className="player-time">3:45</span>
          </div>
          
          {/* Player Controls */}
          <div className="player-controls">
            <button 
              className={`player-control-btn ${isShuffling ? "active" : ""}`}
              onClick={toggleShuffle}
              title="Shuffle"
            >
              <Shuffle size={18} color={isShuffling ? "#FFC107" : "white"} />
            </button>
            
            <button 
              className={`player-control-btn ${prevPressed ? "pressed" : ""}`}
              onClick={handlePrevious}
              title="Previous"
            >
              <SkipBack size={20} color="white" />
            </button>
            
            <button 
              className="player-play-btn"
              onClick={togglePlayPause}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={22} color="white" />
              ) : (
                "▶"
              )}
            </button>
            
            <button 
              className={`player-control-btn ${nextPressed ? "pressed" : ""}`}
              onClick={handleNext}
              title="Next"
            >
              <SkipForward size={20} color="white" />
            </button>
            
            <button 
              className={`player-control-btn ${songAdded ? "active" : ""}`}
              onClick={toggleAddToPlaylist}
              title={songAdded ? "Added to Playlist" : "Add to Playlist"}
            >
              {songAdded ? 
                <Check size={18} color="#FFC107" /> : 
                <Plus size={18} color="white" />
              }
            </button>
          </div>
        </div>
        
        {/* Right Controls */}
        <div className="player-right-controls">
          <button 
            className={`player-control-btn ${currentRating > 0 ? "active" : ""}`}
            onClick={toggleRating}
            title="Rate Song"
          >
            <Star 
              size={18} 
              color={currentRating > 0 ? "#FFC107" : "white"} 
              fill={currentRating > 0 ? "#FFC107" : "none"} 
            />
          </button>
          
          <button 
            className={`player-control-btn ${isReporting ? "active" : ""}`}
            onClick={toggleReporting}
            title="Report Song"
          >
            <Flag size={18} color={isReporting ? "#FFC107" : "white"} />
          </button>
          
          <div className="player-volume">
            <Volume2 size={18} color="white" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              className="player-volume-slider"
              onChange={(e) => {
                const newVolume = e.target.value;
                setVolume(newVolume);
                if (audioRef.current) {
                  audioRef.current.volume = newVolume;
                }
              }}
            />
          </div>
        </div>
        
        <audio ref={audioRef} />
      </div>
    </>
  );
};

export default MusicPlayer;