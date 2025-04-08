import { useState, useRef, useEffect } from "react";
import { Play, Plus, Forward, Pause, Flag, Heart, Check } from "lucide-react";
import Editable from "./Editable";
import UserLink from "../../UserLink/UserLink";
import "./SongIcon.css";
import ReactHowler from 'react-howler'

// Updated FlagIcon to match MusicPlayer style
const FlagIcon = ({ onClose, SongID }) => {
  const [reportReason,setReportReason] = useState("");
  const[isSubmitting,setIsSubmitting]= useState(false);
  const[error,setError] = useState("");
  const[success,setSuccess] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  

  const API_URL = "https://localhost:7152";

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        
        // gets token payload
        const payload = JSON.parse(atob(token.split('.')[1]));
  
        const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        if (userId) {
          setCurrentUserId(userId);
          console.log("User ID extracted:", userId);
  
        } 
        else {
          console.error("Could not find userID in token");
        }
        //username  
      } catch (error) {
        console.error("Error parsing JWT token:", error);
      }
    } else {
      console.log("No token found in localStorage");
    }
  }, []);
  const handleReportSubmit = () => {
    console.log("Button pressed");
    console.log(reportReason);
    if (!reportReason || reportReason.trim() === '') {
      setError("Please provide a reason for the report");
      return;
    }
    if (!currentUserId) {
      console.error("No user ID available");
      setError("No user ID available. Please log in again.");
      return;
    }
    console.log(SongID);
    console.log(reportReason);
    if (!SongID) {
      console.error("No song ID provided");
      setError("No song ID provided. Cannot submit report.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    fetch(`${API_URL}/api/database/ReportSongs?SongID=${SongID}&UserID=${currentUserId}&Reason=${reportReason}`, {
      method: 'POST',
      })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Report submitted successfully:", data);
      setSuccess("Report submitted successfully");
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    })
    .catch(error => {
      console.error("Error submitting report:", error);
      setError("Error submitting report: " + error.message);
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };
  const handleReasonChange = (value) => {
    console.log("Reason changed to " , value);
    setReportReason(value);
  };
  
  return (
    <>
      <div className="song-icon-overlay"></div>
      <div className="song-icon-flag-wrapper">
        <label style={{margin:"0 auto", textAlign:"center"}}>REASON FOR REPORT</label>
        <div className="editable-div-flag" style={{border:"3px solid white", borderRadius:"10px", width:"85%", margin:"auto", height:"60%"}}>
        <textarea 
          value={reportReason}
          onChange={(e) => {
            console.log("Typing:", e.target.value);
            setReportReason(e.target.value);
          }}
          placeholder="Example: Racism, hate speech promotes violence, etc."
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#8E1616",
            color: "white",
            border: "none",
            padding: "10px",
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
            fontSize: "14px",
            zIndex: 200000
          }}
          onClick={(e) => e.stopPropagation()}
          onFocus={(e) => e.stopPropagation()}
        />
        </div>
        <div className="report-buttons">
          <button className="submit-report-btn" onClick={(e) => {
           e.stopPropagation();
          e.preventDefault(); 
         e.nativeEvent.stopImmediatePropagation();
          handleReportSubmit();
        }} 
   disabled = {isSubmitting} >REPORT SONG</button>
          <button onClick={onClose} className="cancel-report-btn">CANCEL</button>
        </div>
      </div>
    </>
  );
};

const SongIcon = ({ name, creator, duration, flags, iconImage, isHomePage, isCenter, likes, shouldPlay = false, songSrc, onPlayStatusChange,AverageRating,songID }) => {
  // Keep existing state

  const [isPlaying, setIsPlaying] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [rating, setRating] = useState(false);
  const [liked, setLiked] = useState(false);
  const [userControlled, setUserControlled] = useState(false);
  const [addedToPlaylist, setAddedToPlaylist] = useState(false); // New state for tracking plus/check toggle

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

  // New function to toggle the add to playlist state
  const toggleAddToPlaylist = (e) => {
    e.stopPropagation(); // Prevent triggering the parent button click
    setAddedToPlaylist(!addedToPlaylist);
    
    // Log the action (in a real app, you would make an API call here)
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

  return (
    <>
      <ReactHowler src={songSrc || 'https://blobcontainer2005.blob.core.windows.net/songfilecontainer/uploads/008ad32f-f270-4462-8577-bf4a9c3db258.mp3'}
       playing={isPlaying}/>
      {showReport && <FlagIcon onClose={handleCloseReport} SongID = {songID}/>}
      
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
              onChange={(e) => setRating(e.target.value)} //changes this so you can send the ratings  /api/Ratings gets back average rating so you can update it 
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
        {location.pathname !== '/profile' && 
          <div className="flag-btn" title="Report Song" onClick={(e) => {e.stopPropagation();e.preventDefault();console.log("Butotn lcicked"); setShowReport(true)}}
          style={{ 
            position: "relative", // Ensure it's positioned properly
            zIndex: 100000 // Higher z-index to ensure it's clickable
          }}>
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