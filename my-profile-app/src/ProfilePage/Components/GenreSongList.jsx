import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Shuffle, Plus, Check, Volume2, Flag, Star } from "lucide-react";
import Editable from "./Editable";
import PlaylistSelectionPopup from "./PlaylistSelectionPopup";
import ReactHowler from 'react-howler';
import "./MusicPlayer.css";

// Report form component with cleaner design
const FlagReport = ({ onClose }) => {
  return (
    <>
      <div className="music-player-overlay"></div>
      <div className="music-player-flag-wrapper">
        <h3 className="report-title">REPORT SONG</h3>
        <div className="editable-div-flag">
          <Editable
            className="flag-editable"
            title="Enter the reason for the report"
            value=""
            div_width="100%"
            div_height="100%"
            backgroundColor="#111"
            textColor="white"
            placeholder="Example: Racism, hate speech promotes violence, etc."
          />
        </div>
        <div className="report-buttons">
          <button className="submit-report-btn">SUBMIT</button>
          <button onClick={onClose} className="cancel-report-btn">CANCEL</button>
        </div>
      </div>
    </>
  );
};

const MusicPlayer = ({ songSrc, songImage, song, artist, pageName, playlist, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [songAdded, setSongAdded] = useState(false);
  const [prevPressed, setPrevPressed] = useState(false);
  const [nextPressed, setNextPressed] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showPlaylistSelection, setShowPlaylistSelection] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const playerRef = useRef(null);

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
    image: songImage || "https://via.placeholder.com/150"
  };

  // Apply page-specific class if provided
  const playerClassName = `music-player-container ${pageName ? `music-player-${pageName}` : ""}`;

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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

  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, [songSrc]);

  useEffect(() => {
    let interval;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        const current = playerRef.current.seek();
        if (typeof current === 'number') {
          setCurrentTime(current);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

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
        {/* Song info section */}
        <div className="music-info-section">
          <img
            src={songImage || "https://via.placeholder.com/150"}
            alt="Album cover"
            className="music-image"
          />
          <div className="music-info">
            <p className="music-name">{song || "Song Title"}</p>
            <p className="music-artist">{artist || "Artist Name"}</p>
          </div>
        </div>
        
        {/* Main player section with progress bar and controls */}
        <div className="player-main-section">
          {/* Progress bar */}
          <div className="progress-container">
            <span className="current-time">{formatDuration(currentTime)}</span>
            <div className="progress-wrapper">
              <input 
                type="range" 
                className="progress-bar" 
                min="0" 
                max={duration || 100} 
                value={currentTime || 0} 
                onChange={(e) => {
                  const newTime = parseFloat(e.target.value);
                  setCurrentTime(newTime);
                  if (playerRef.current) {
                    playerRef.current.seek(newTime);
                  }
                }}
              />
            </div>
            <span className="total-duration">{formatDuration(duration)}</span>
          </div>
          
          {/* Controls */}
          <div className="controls-container">
            {/* Shuffle button */}
            <button
              onClick={toggleShuffle}
              className={`control-button ${isShuffling ? "active" : ""}`}
              aria-label="Shuffle"
            >
              <Shuffle size={18} />
            </button>
            
            {/* Previous button */}
            <button
              onClick={handlePrevious}
              className={`control-button ${prevPressed ? "pressed" : ""}`}
              aria-label="Previous"
            >
              <SkipBack size={20} />
            </button>
            
            {/* Play/Pause button - using your code exactly */}
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
            
            {/* Next button */}
            <button
              onClick={handleNext}
              className={`control-button ${nextPressed ? "pressed" : ""}`}
              aria-label="Next"
            >
              <SkipForward size={20} />
            </button>
            
            {/* Add to playlist button */}
            <button
              onClick={toggleAddToPlaylist}
              className={`control-button ${songAdded ? "added" : ""}`}
              aria-label="Add to Playlist"
            >
              {songAdded ? <Check size={18} /> : <Plus size={18} />}
            </button>
            
            {/* Rating button */}
            <button
              onClick={toggleRating}
              className={`control-button ${currentRating > 0 ? "rated" : ""}`}
              aria-label="Rate Song"
            >
              <Star 
                size={18} 
                color={currentRating > 0 ? "#FFC107" : "white"} 
                fill={currentRating > 0 ? "#FFC107" : "none"} 
              />
            </button>
            
            {/* Report button */}
            <button
              onClick={toggleReporting}
              className={`control-button ${isReporting ? "reporting" : ""}`}
              aria-label="Report"
            >
              <Flag size={18} />
            </button>
          </div>
        </div>
        
        {/* Volume control */}
        <div className="volume-control">
          <Volume2 size={18} />
          <div className="volume-slider-container">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              className="volume-slider"
              onChange={(e) => {
                const newVolume = e.target.value;
                setVolume(newVolume);
              }}
              aria-label="Volume"
            />
          </div>
        </div>
        
        {/* Audio player */}
        {songSrc && (
          <ReactHowler
            src={songSrc}
            playing={isPlaying}
            volume={volume}
            ref={playerRef}
            onEnd={() => setIsPlaying(false)}
          />
        )}
      </div>
    </>
  );
};

export default MusicPlayer;