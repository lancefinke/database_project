import React, { useState, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

const MusicPlayer = ({ song, artist }) => {
  const [isPlaying, setIsPlaying] = useState(false);
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

  return (
    <div className="music-player-container">
      <div className="music-info-section">
        <img
          src="https://via.placeholder.com/150"
          alt="music"
          className="music-image"
        />
        <div className="music-info">
          <p className="music-name">{song}</p>
          <p className="music-artist">{artist}</p>
        </div>
      </div>

      <div className="player-main-section">
        <div className="progress-container">
          <span className="current-time">0:00</span>
          <input
            type="range"
            className="progress-bar"
            min="0"
            max="100"
            value="0"
            onChange={() => {}}
          />
          <span className="total-duration">3:45</span>
        </div>

        <div className="controls-container">
          <button onClick={() => {}} className="control-button">
            <SkipBack size={20} color="white" />
          </button>
          <button onClick={togglePlayPause} className="control-button play-button">
            {isPlaying ? <Pause size={24} color="white" /> : <Play size={24} color="white" />}
          </button>
          <button onClick={() => {}} className="control-button">
            <SkipForward size={20} color="white" />
          </button>
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  );
};

export default MusicPlayer;