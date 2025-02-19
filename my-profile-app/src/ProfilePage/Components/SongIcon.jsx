import { useState } from "react";
import { Play, Plus, Forward, Pause } from "lucide-react";
import "./SongIcon.css";

const SongPost = ({ name, creator, duration, flags, iconImage }) => {
  const [isPlaying, togglePlaying] = useState(false);

  const handlePlaying = () => {
    togglePlaying(!isPlaying);
  };

  return (
    <div className="song-post-wrapper">
      <div className="song-icon">
        <img src="/img/testimage.jpg" alt="Song Icon" />
      </div>

      <div className="content-container">
        <div className="song-info">
          <div className="text-content">
            <h3 className="song-title">{name}</h3>
            <h4 className="song-creator">{creator}</h4>
            <h5 className="song-duration">{duration}</h5>
            <div className="flags">
              {flags.map((flagName, index) => (
                <div key={index} className="flag-item">{flagName}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="controls-container">
          <button className="play-btn" onClick={handlePlaying}>
            {isPlaying ? (
              <Pause strokeWidth={1} size={24} color="white" />
            ) : (
              <Play size={24} color="white" />
            )}
          </button>
          
          <div className="other-btns">
            <button className="control-btn" title="Add to Playlist">
              <Plus size={20} color="white" />
            </button>
            <button className="control-btn" title="Share with a Friend">
              <Forward size={20} color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongPost;