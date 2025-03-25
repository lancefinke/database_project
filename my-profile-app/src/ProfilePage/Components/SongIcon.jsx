import { useState, useRef } from "react";
import { Play, Plus, Forward, Pause, Flag } from "lucide-react";
import Editable from "./Editable";
import "./SongIcon.css";


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


const SongIcon = ({ name, creator, duration, flags, iconImage, isHomePage, isCenter }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReport,setShowReport] = useState(false);
  

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
    <>
    {showReport &&<FlagIcon />}
    {showReport &&<button onClick={()=>{setShowReport(false)}}className="submit-report-btn" style={{margin:"15px 0px 0px 0px",width:"100px",position:"relative",zIndex:"10",bottom:"200px",backgroundColor:"#1D1616"}}>CLOSE</button>}
    <button 
      className={wrapperClass}
      onClick={togglePlay}
      aria-label={isPlaying ? "Pause song" : "Play song"}
    >
      <div className="song-icon">
        <img src={iconImage} alt="Song Icon" />
      </div>
      {location.pathname!=='/profile'&&<select className="rating-select">
        <option className="rating-value" value="">Rate</option>
        <option className="rating-value" value="1">1</option>
        <option className="rating-value" value="1">2</option>
        <option className="rating-value" value="1">3</option>
        <option className="rating-value" value="1">4</option>
        <option className="rating-value" value="1">5</option>
      </select>}
      {location.pathname!=='/profile'&&<div className="flag-btn" title="Report Song" onClick={()=>{setShowReport(true)}}>
       <Flag className="flag-icon"/>
      </div>}

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
    </>
  );
};

export default SongIcon;