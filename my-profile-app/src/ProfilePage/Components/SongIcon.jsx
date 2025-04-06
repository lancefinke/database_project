import { useState, useRef, useEffect } from "react";
import { Play, Plus, Forward, Pause, Flag, Heart } from "lucide-react";
import Editable from "./Editable";
import UserLink from "../../UserLink/UserLink";
import "./SongIcon.css";
import ReactHowler from 'react-howler'

const FlagIcon = ()=>{
  return(
    <div className="flag-icon-wrapper">
      <label style={{margin:"0 auto",textAlign:"center"}}>REASON FOR REPORT</label>
      <div className="editable-div-flag" style={{border:"3px solid white",borderRadius:"10px",width:"85%",margin:"auto",height:"60%"}}>
      <Editable 
            className="flag-editable"
            title="Enter the reason for the report"
            value=""
            div_width="90%"
            div_height="90%"
            backgroundColor="#8E1616"
            textColor="white"
            placeholder="Example: Racism, hate speech promotes violence, etc."/>
        </div>
        <button className="submit-report-btn">REPORT SONG</button>
    </div>
  );
}

const SongIcon = ({ name, creator, duration, flags, iconImage, isHomePage, isCenter, likes, shouldPlay = false, songSrc, onPlayStatusChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [rating, setRating] = useState(0.0);
  const [liked, setLiked] = useState(false);
  const [userControlled, setUserControlled] = useState(false);

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

  return (
    <>
      <ReactHowler   src='https://blobcontainer2005.blob.core.windows.net/songfilecontainer/uploads/008ad32f-f270-4462-8577-bf4a9c3db258.mp3' playing={isPlaying}/>
      {showReport && <FlagIcon />}
      {showReport && <button onClick={()=>{setShowReport(false)}} className="submit-report-btn" style={{margin:"15px 0px 0px 0px",width:"100px",position:"relative",zIndex:"10",bottom:"200px",backgroundColor:"#1D1616"}}>CLOSE</button>}
      <button 
        className={wrapperClass}
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause song" : "Play song"}
      >
        <div className="song-icon">
          <img src={iconImage} alt="Song Icon" />
        </div>
        <div className="rating-wrapper">
          {location.pathname !== '/profile' && (
            <select 
              className="rating-select"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
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
          <div className="avg-rating">Average Rating: {rating}</div>
        </div>
        {location.pathname !== '/profile' && 
          <div className="flag-btn" title="Report Song" onClick={(e) => {e.stopPropagation(); setShowReport(true)}}>
            <Flag className="flag-icon"/>
          </div>
        }
        <div className="content-container">
          <div className="song-info">
            <div className="text-content">
              <h3 className="song-title">{name}</h3>
              <h4 className="song-creator" style={{zIndex:"100"}}><UserLink text={creator} userName={creator}/></h4>
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
            
            {/* Share button removed as requested */}
          </div>
        </div>
      </button>
    </>
  );
};

export default SongIcon;