import React, { useState, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Shuffle, Plus, Check, Volume2 } from "lucide-react";
import "./MusicPlayer.css"; // Keep the CSS import

const MusicPlayer = ({ song, artist, pageName, playlist }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [songAdded, setSongAdded] = useState(false);
  const [prevPressed, setPrevPressed] = useState(false);
  const [nextPressed, setNextPressed] = useState(false);
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

  const handlePrevious = () => {
    setPrevPressed(true);
    setTimeout(() => setPrevPressed(false), 200);
  };

  const handleNext = () => {
    setNextPressed(true);
    setTimeout(() => setNextPressed(false), 200);
  };

  return (
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
  );
};

export default MusicPlayer;