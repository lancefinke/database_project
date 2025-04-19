import { useState, useRef, useEffect } from "react";
import { Play, Plus, Forward, Pause, Flag, Heart, Check } from "lucide-react";
import Editable from "./Editable";
import ErrorDialog from "./ErrorDialog"; 

import UserLink from "../../UserLink/UserLink";
import "./SongIcon.css";
import ReactHowler from 'react-howler';
import FlagIcon from "./FlagIcon"; // Import the FlagIcon component

const SongIcon = ({ name, creator, duration, flags, iconImage, isHomePage, isCenter, likes, shouldPlay = false, songSrc, onPlayStatusChange, AverageRating, songID,onRate }) => {
  // State management
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [rating, setRating] = useState("");
  const [liked, setLiked] = useState(false);
  const [userControlled, setUserControlled] = useState(false);
  const [addedToPlaylist, setAddedToPlaylist] = useState(false);

  // Effect to handle external play control, but only if not user-controlled
  useEffect(() => {
    if (!userControlled) {
      setIsPlaying(shouldPlay);
    }
  }, [shouldPlay, userControlled]);

  // Notify parent component of play status changes
  useEffect(() => {
    if (onPlayStatusChange) {
      onPlayStatusChange(isPlaying);
    }
  }, [isPlaying, onPlayStatusChange]);

  const toggleLiked = () => {
    setLiked(!liked);
    console.log(liked);
  }

  const togglePlay = () => {
    setUserControlled(true);
    setIsPlaying(!isPlaying);
  }

  const handleCloseReport = () => {
    setShowReport(false);
  }

  // Toggle add to playlist state
  const toggleAddToPlaylist = (e) => {
    e.stopPropagation(); // Prevent triggering the parent button click
    setAddedToPlaylist(!addedToPlaylist);
    
    if (!addedToPlaylist) {
      console.log(`Adding song "${name}" to playlist`);
    } else {
      console.log(`Removing song "${name}" from playlist`);
    }
  }

  // Generate the appropriate class name based on props
  let wrapperClass = "song-post-wrapper";
  
  if (isHomePage) {
    wrapperClass += " home-song-wrapper";
    
    if (isCenter) {
      wrapperClass += " center-song-wrapper";
    }
  }

  // Use the provided songSrc or fall back to default
  const audioSrc = songSrc || 'https://blobcontainer2005.blob.core.windows.net/songfilecontainer/uploads/008ad32f-f270-4462-8577-bf4a9c3db258.mp3';

  // Prevent click event propagation for flag button
  const handleFlagClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    console.log("Flag button clicked");
    setShowReport(true);
    
    // Prevent background scrolling when modal is open
    if (!showReport) {
      document.body.classList.add('modal-open');
    }
  };

  return (
    <>
      <ReactHowler 
        src={audioSrc}
        playing={isPlaying}
      />
      
      {showReport && <FlagIcon onClose={handleCloseReport} SongID={songID}/>}
      
      <button 
        className={wrapperClass}
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause song" : "Play song"}
      >
      
        <div className="song-icon">
          <img src={iconImage || "https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"} alt="Song Icon" />
        </div>
        
        <div className="rating-wrapper">
          {location.pathname !== '/profile' && (
            <select
            className="rating-select"
            value={rating || ""} // Avoid "false" here
            onChange={(e) => {
              const selectedRating = parseInt(e.target.value);
              setRating(selectedRating);
          
              if (onRate && songID && !isNaN(selectedRating)) {
                
                onRate(songID, selectedRating);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
              <option value="">Rate</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          )}
          <div className="avg-rating">Average Rating: {AverageRating}</div>
        </div>
        
        {location && location.pathname !== '/profile' && 
          <div 
            className="flag-btn" 
            title="Report Song" 
            onClick={handleFlagClick}
          >
            <Flag className="flag-icon"/>
          </div>
        }
        
        <div className="content-container">
          <div className="song-info">
            <div className="text-content">
              <h3 className="song-title">{name}</h3>
              <h4 className="song-creator"><UserLink text={creator} userName={creator}/></h4>
              <h5 className="song-duration">{duration}</h5>
              <div className="flags">
                {flags && flags.map((flagName, index) => (
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
            
            <div 
              className={`control-icon ${addedToPlaylist ? "added" : ""}`}
              title={addedToPlaylist ? "Remove from Playlist" : "Add to Playlist"}
              onClick={toggleAddToPlaylist}
            >
              {addedToPlaylist ? (
                <Check size={20} color="white" />
              ) : (
                <Plus size={20} color="white" />
              )}
            </div>
          </div>
        </div>
      </button>
    </>
  );
};

export default SongIcon;