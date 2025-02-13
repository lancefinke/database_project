import React, { useState, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Shuffle, Plus, Check, Volume2 } from "lucide-react";

const MusicPlayer = ({ song, artist }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [songAdded, setSongAdded] = useState(false);
  const [skipPressed, setSkipPressed] = useState(false);
  const audioRef = useRef(null);

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

  const handleAddToPlaylist = () => {
    setSongAdded(true);
    setTimeout(() => setSongAdded(false), 2000); // Reset after 2 seconds
  };

  const handleSkip = () => {
    setSkipPressed(true);
    setTimeout(() => setSkipPressed(false), 200);
  };

  return (
    <div className="music-player-container">
      <div className="music-info-section">
        <img src="https://via.placeholder.com/150" alt="music" className="music-image" />
        <div className="music-info">
          <p className="music-name">{song}</p>
          <p className="music-artist">{artist}</p>
        </div>
      </div>

      <div className="player-main-section">
        <div className="progress-container">
          <span className="current-time">0:00</span>
          <input type="range" className="progress-bar" min="0" max="100" value="0" onChange={() => {}} />
          <span className="total-duration">3:45</span>
        </div>

        <div className="controls-container">
          <button onClick={toggleShuffle} className={`control-button ${isShuffling ? "active" : ""}`}>
            <Shuffle size={20} color={isShuffling ? "black" : "white"} />
          </button>
          <button 
            onClick={handleSkip} 
            className={`control-button ${skipPressed ? "pressed" : ""}`}
          >
            <SkipBack size={20} color="white" />
          </button>
          <button onClick={togglePlayPause} className="control-button play-button">
            {isPlaying ? <Pause size={24} color="white" /> : <Play size={24} color="white" />}
          </button>
          <button 
            onClick={handleSkip} 
            className={`control-button ${skipPressed ? "pressed" : ""}`}
          >
            <SkipForward size={20} color="white" />
          </button>
          <button onClick={handleAddToPlaylist} className="control-button">
            {songAdded ? <Check size={20} color="black" /> : <Plus size={20} color="white" />}
          </button>
        </div>
      </div>

      <div className="volume-control">
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
      </div>

      <audio ref={audioRef} />
    </div>
  );
};

export default MusicPlayer;
