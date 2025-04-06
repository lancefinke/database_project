import React, { useState, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Shuffle, Plus, Check, Volume2, Flag } from "lucide-react";
import Editable from "./Editable"; // Import Editable component
import "./MusicPlayer.css";

// Create FlagReport component for the reporting feature
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

const MusicPlayer = ({ song, artist, pageName, playlist }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [songAdded, setSongAdded] = useState(false);
  const [prevPressed, setPrevPressed] = useState(false);
  const [nextPressed, setNextPressed] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const audioRef = useRef(null);

  // Apply page-specific class if provided - this will handle the styling
  const playerClassName = `music-player-container ${pageName ? `music-player-${pageName}` : ""}`;

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
    // Toggle the songAdded state without a timeout
    setSongAdded(!songAdded);
  };

  const toggleReporting = () => {
    setIsReporting(!isReporting);
    setShowReportForm(true);
  };

  const handleCloseReport = () => {
    setShowReportForm(false);
    setIsReporting(false);
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
      
      <div className={playerClassName}>
        {/* Left section with image and song info */}
        <div className="music-info-section">
          <img 
            src="https://via.placeholder.com/150" 
            alt="music cover" 
            className="music-image" 
          />
          <div className="music-info">
            <p className="music-name">{song || "Song Title"}</p>
            <p className="music-artist">{artist || "Artist Name"}</p>
          </div>
        </div>

        <div className="player-main-section">
          <div className="progress-container">
            <span className="current-time">0:00</span>
            <input type="range" className="progress-bar" min="0" max="100" value="0" onChange={() => {}} />
            <span className="total-duration">3:45</span>
          </div>

          <div className="controls-container">
            <div className="tooltip-container">
              <button 
                onClick={toggleShuffle} 
                className={`control-button ${isShuffling ? "active" : ""}`}
              >
                <Shuffle size={20} color={isShuffling ? "black" : "white"} />
              </button>
              <span className="tooltip">Shuffle</span>
            </div>
            
            <div className="tooltip-container">
              <button 
                onClick={handlePrevious} 
                className={`control-button ${prevPressed ? "pressed" : ""}`}
              >
                <SkipBack size={20} color="white" />
              </button>
              <span className="tooltip">Previous</span>
            </div>
            
            <div className="tooltip-container">
              <button 
                onClick={togglePlayPause} 
                className="control-button play-button"
              >
                {isPlaying ? 
                  <Pause size={24} color="white" /> : 
                  <Play size={24} color="white" />
                }
              </button>
              <span className="tooltip">{isPlaying ? "Pause" : "Play"}</span>
            </div>
            
            <div className="tooltip-container">
              <button 
                onClick={handleNext} 
                className={`control-button ${nextPressed ? "pressed" : ""}`}
              >
                <SkipForward size={20} color="white" />
              </button>
              <span className="tooltip">Next</span>
            </div>
            
            <div className="tooltip-container">
              <button 
                onClick={toggleAddToPlaylist} 
                className={`control-button ${songAdded ? "added" : ""}`}
              >
                {songAdded ? 
                  <Check size={20} color="black" /> : 
                  <Plus size={20} color="white" />
                }
              </button>
              <span className="tooltip">{songAdded ? "Added to Playlist" : "Add to Playlist"}</span>
            </div>
            
            <div className="tooltip-container">
              <button 
                onClick={toggleReporting} 
                className={`control-button ${isReporting ? "reporting" : ""}`}
              >
                <Flag size={20} color={isReporting ? "black" : "white"} />
              </button>
              <span className="tooltip">Report Song</span>
            </div>
          </div>
        </div>

        <div className="volume-control tooltip-container">
          <Volume2 size={20} color="white" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              setVolume(e.target.value);
              if (audioRef.current) {
                audioRef.current.volume = e.target.value;
              }
            }}
          />
          <span className="tooltip tooltip-volume">Volume</span>
        </div>

        <audio ref={audioRef} />
      </div>
    </>
  );
};

export default MusicPlayer;