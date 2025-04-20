import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Shuffle, Plus, Check, Volume2, Flag } from "lucide-react";
import Editable from "./Editable";
import PlaylistSelectionPopup from "./PlaylistSelectionPopup";
import ReactHowler from 'react-howler';
import "./MusicPlayer.css";
import FlagIcon from "./FlagIcon"; // Update with the correct path to your FlagIcon component
import { useUserContext } from "../../LoginContext/UserContext";

const MusicPlayer = ({ id, songSrc, songImage, song, artist, pageName, playlist, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [songAdded, setSongAdded] = useState(false);
  const [prevPressed, setPrevPressed] = useState(false);
  const [nextPressed, setNextPressed] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showPlaylistSelection, setShowPlaylistSelection] = useState(false);
  const [availablePlaylists, setAvailablePlaylists] = useState([]);
  const playerRef = useRef(null);
 
  // Current song information - would typically come from props
  const currentSong = {
    id: id,
    title: song || "Song Title",
    artist: artist || "Artist Name",
    image: songImage || "https://via.placeholder.com/150"
  };
  console.log("THIS IS THE CURRENT SONG", currentSong);

  const { user } = useUserContext(); // get user info
  console.log("ALL USER RETRIEVED DATA:", user);

  // Apply page-specific class if provided - this will handle the styling
  const playerClassName = `music-player-container ${pageName ? `music-player-${pageName}` : ""}`;

  // Function to update the volume slider fill effect
  const updateVolumeSliderFill = (value) => {
    // Convert the volume value (0-1) to a percentage
    const percentage = value * 100;
    // Update the CSS variable
    document.documentElement.style.setProperty('--volume-percentage', `${percentage}%`);
  };

  // Function to update the progress bar fill effect
  const updateProgressBarFill = (currentValue, maxValue) => {
    // Calculate percentage
    const percentage = (currentValue / maxValue) * 100;
    // Update the CSS variable
    document.documentElement.style.setProperty('--progress-percentage', `${percentage}%`);
  };

  const togglePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  const toggleAddToPlaylist = () => {
    setShowPlaylistSelection(true);
  };

  useEffect(() => {
    // Only fetch if user exists and has a UserID
    if (user && user.UserID) {
      fetch(`http://localhost:5142/api/database/GetUserPlaylists?UserID=${user.UserID}`)
        .then(response => {
          if (!response.ok) throw new Error("Failed to fetch playlists");
          return response.json();
        })
        .then(data => {
          console.log("Fetched playlists:", data);
          
          // Transform API response to match expected format
          const formattedPlaylists = data.map(playlist => ({
            id: playlist.PlaylistID || playlist.Id,
            name: playlist.Title || playlist.Name,
            image: playlist.PlaylistPicture || playlist.PlaylistImage || playlist.ImageURL || "https://via.placeholder.com/100"
          }));
          
          setAvailablePlaylists(formattedPlaylists);
        })
        .catch(error => {
          console.error("Error fetching playlists:", error);
        });
    }
  }, [user]);
 
  const handleAddToPlaylist = (playlistId) => {
    console.log("Adding song to playlist:", { 
      songId: currentSong.id, 
      playlistId: playlistId 
    });
    
    fetch(`http://localhost:5142/api/database/AddSongPlaylist?SongID=${currentSong.id}&PlaylistID=${playlistId}`, {
      method: "POST"
    })
    .then(response => {
      if (!response.ok) throw new Error("Failed to add song");
      return response.json();
    })
    .then(data => {
      console.log("API response:", data);
      setSongAdded(true);
      setShowPlaylistSelection(false);
      console.log("Song", currentSong.id, "was added to playlist", playlistId);
      setTimeout(() => {
        setSongAdded(false);
      }, 3000);
    })
    .catch(error => console.error("Error adding song:", error));
  };

  const toggleReporting = () => {
    setShowReportForm(true);
    setIsReporting(true);
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

  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, [songSrc]);

  useEffect(() => {
    let interval;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        const current = playerRef.current.seek();
        if (typeof current === 'number') {
          setCurrentTime(current);
          updateProgressBarFill(current, duration || 100);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Initialize volume slider fill on component mount
  useEffect(() => {
    updateVolumeSliderFill(volume);
  }, []);

  // Initialize progress bar fill when component mounts or when duration changes
  useEffect(() => {
    updateProgressBarFill(currentTime, duration || 100);
  }, [currentTime, duration]);

  return (
    <>
      {/* Use FlagIcon component instead of the original FlagReport component */}
      {showReportForm && <FlagIcon onClose={handleCloseReport} SongID={id} />}
      
      {showPlaylistSelection && (
        <PlaylistSelectionPopup
          onClose={() => setShowPlaylistSelection(false)}
          playlists={availablePlaylists}
          onAddToPlaylist={handleAddToPlaylist}
          currentSong={currentSong}
        />
      )}
      
      <div className={playerClassName}>
        {/* Song info section */}
        <div className="music-info-section">
          <img
            src={songImage || "https://via.placeholder.com/150"}
            alt="Album cover"
            className="music-image"
          />
          <div className="music-info">
            <p className="music-name">{song || "Song Title"}</p>
            <p className="music-artist">{artist || "Artist Name"}</p>
          </div>
        </div>
        
        {/* Main player section with progress bar and controls */}
        <div className="player-main-section">
          {/* Progress bar */}
          <div className="progress-container">
            <span className="current-time">{formatDuration(currentTime)}</span>
            <div className="progress-wrapper">
              <input 
                type="range" 
                className="progress-bar" 
                min="0" 
                max={duration || 100} 
                value={currentTime || 0} 
                onChange={(e) => {
                  const newTime = parseFloat(e.target.value);
                  setCurrentTime(newTime);
                  updateProgressBarFill(newTime, duration || 100);
                  if (playerRef.current) {
                    playerRef.current.seek(newTime);
                  }
                }}
              />
            </div>
            <span className="total-duration">{formatDuration(duration)}</span>
          </div>
          
          {/* Controls */}
          <div className="controls-container">
            {/* Shuffle button */}
            <button
              onClick={toggleShuffle}
              className={`control-button ${isShuffling ? "active" : ""}`}
              aria-label="Shuffle"
            >
              <Shuffle size={18} />
            </button>
            
            {/* Previous button */}
            <button
              onClick={handlePrevious}
              className={`control-button ${prevPressed ? "pressed" : ""}`}
              aria-label="Previous"
            >
              <SkipBack size={20} />
            </button>
            
            {/* Play/Pause button - centered between skip buttons */}
            <button
              onClick={togglePlayPause}
              className="control-button play-button"
              aria-label={isPlaying ? "Pause" : "Play"}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                height: "46px",
                width: "46px",
                borderRadius: "50%",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                position: "relative",
                zIndex: "100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                margin: "0 12px"
              }}
            >
              {isPlaying ? (
                <Pause size={24} style={{ color: "white", opacity: 1 }} />
              ) : (
                <Play size={24} style={{ color: "white", opacity: 1, marginLeft: "2px" }} />
              )}
            </button>
            
            {/* Next button */}
            <button
              onClick={handleNext}
              className={`control-button ${nextPressed ? "pressed" : ""}`}
              aria-label="Next"
            >
              <SkipForward size={20} />
            </button>
            
            {/* Add to playlist button */}
            <button
              onClick={toggleAddToPlaylist}
              className={`control-button ${songAdded ? "added" : ""}`}
              aria-label="Add to Playlist"
            >
              {songAdded ? <Check size={18} /> : <Plus size={18} />}
            </button>
            
            {/* Report button - updated to use new reporting flow */}
            <button
              onClick={toggleReporting}
              className={`control-button ${isReporting ? "reporting" : ""}`}
              aria-label="Report"
            >
              <Flag size={18} />
            </button>
          </div>
        </div>
        
        {/* Volume control - Updated with fill effect */}
        <div className="volume-control">
          <Volume2 size={18} />
          <div className="volume-slider-container">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              className="volume-slider"
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setVolume(newVolume);
                updateVolumeSliderFill(newVolume);
              }}
              aria-label="Volume"
            />
          </div>
        </div>
        
        {/* Audio player */}
        {songSrc && (
          <ReactHowler
            src={songSrc}
            playing={isPlaying}
            volume={volume}
            ref={playerRef}
            onEnd={() => setIsPlaying(false)}
          />
        )}
      </div>
    </>
  );
};

export default MusicPlayer;