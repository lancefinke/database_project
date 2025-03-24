import { useState, useRef } from "react";
import { Play, Plus, Forward, Pause } from "lucide-react";
import "./SongIcon.css";


const SongIcon = ({ name, creator, duration, flags, iconImage, isHomePage, isCenter }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  

  const togglePlay=()=>{
    setIsPlaying(!isPlaying);
  }


  // Generate the appropriate class name based on props
  let wrapperClass = "song-post-wrapper";
  
  if (isHomePage) {
    wrapperClass += " home-song-wrapper";
    
    if (isCenter) {
      wrapperClass += " center-song-wrapper";
    }
  }

  return (
    <button 
      className={wrapperClass}
      onClick={togglePlay}
      aria-label={isPlaying ? "Pause song" : "Play song"}
    >
      <div className="song-icon">
        <img src={iconImage} alt="Song Icon" />
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
          <div className="control-icon play-icon">
            {isPlaying ? (
              <Pause strokeWidth={1} size={20} color="white" />
            ) : (
              <Play size={20} color="white" />
            )}
          </div>
          
          <div className="control-icon" 
            title="Add to Playlist"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the parent button click
              // Add your playlist logic here
            }}
          >
            <Plus size={20} color="white" />
          </div>
          
          <div 
            className="control-icon" 
            title="Share with a Friend"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the parent button click
              // Add your share logic here
            }}
          >
            <Forward size={20} color="white" />
          </div>
        </div>
      </div>
    </button>
  );
};

export default SongIcon;