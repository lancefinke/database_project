import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Shuffle, Plus, Check, Volume2, Flag } from "lucide-react";
import Editable from "./Editable";
import PlaylistSelectionPopup from "./PlaylistSelectionPopup";
import ReactHowler from 'react-howler';
import "./MusicPlayer.css";
import FlagIcon from "./FlagIcon"; 
import { useUserContext } from "../../LoginContext/UserContext";

// Modified MusicPlayer component that uses external navigation state
const MusicPlayer = ({ 
  id, 
  songSrc, 
  songImage, 
  song, 
  artist, 
  pageName, 
  playlist, 
  duration,
  // Navigation props - these come from the useSongNavigation hook
  isPlaying,
  isShuffling,
  togglePlayPause,
  toggleShuffle,
  playPreviousSong,
  playNextSong,
  handleSongEnd,
  setIsPlaying,
  playlistSongs = []
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [songAdded, setSongAdded] = useState(false);
  const [prevPressed, setPrevPressed] = useState(false);
  const [nextPressed, setNextPressed] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showPlaylistSelection, setShowPlaylistSelection] = useState(false);
  const [availablePlaylists, setAvailablePlaylists] = useState([]);
  const [songDuration, setSongDuration] = useState(duration || 0);
  const playerRef = useRef(null);
 
  // Current song information
  const currentSong = {
    id: id || 0,
    title: song || "Song Title",
    artist: artist || "Artist Name",
    image: songImage || "https://placehold.co/150x150"
  };

  const { user } = useUserContext();
  const playerClassName = `music-player-container ${pageName ? `music-player-${pageName}` : ""}`;

  // Function to update the volume slider fill effect
  const updateVolumeSliderFill = (value) => {
    const percentage = value * 100;
    document.documentElement.style.setProperty('--volume-percentage', `${percentage}%`);
  };

  // Function to update the progress bar fill effect
  const updateProgressBarFill = (currentValue, maxValue) => {
    if (!maxValue || maxValue <= 0) return;
    const percentage = (currentValue / maxValue) * 100;
    document.documentElement.style.setProperty('--progress-percentage', `${percentage}%`);
  };

  // Improved formatDuration function that handles all edge cases
  const formatDuration = (seconds) => {
    if (seconds === undefined || seconds === null || isNaN(seconds)) {
      return "0:00";
    }
    
    // Try to parse string durations
    if (typeof seconds === 'string') {
      if (seconds.includes(':')) {
        return seconds; // Already formatted as MM:SS
      }
      // Try to parse as number
      const parsed = parseFloat(seconds);
      if (isNaN(parsed)) return "0:00";
      seconds = parsed;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Effect to update duration when the song loads
  useEffect(() => {
    if (playerRef.current && playerRef.current.howler && isPlaying) {
      // Check every 100ms until we get a valid duration
      const durationCheck = setInterval(() => {
        const actualDuration = playerRef.current.duration();
        if (actualDuration && !isNaN(actualDuration) && actualDuration > 0) {
          console.log("Got actual duration:", actualDuration);
          setSongDuration(actualDuration);
          updateProgressBarFill(currentTime, actualDuration);
          clearInterval(durationCheck);
        }
      }, 100);
      
      // Clean up the interval if component unmounts or song changes
      return () => clearInterval(durationCheck);
    }
  }, [isPlaying, songSrc]);
  
  const toggleAddToPlaylist = () => {
    setShowPlaylistSelection(true);
  };

  // Wrapper functions for the navigation buttons
  const handlePrevious = () => {
    setPrevPressed(true);
    setTimeout(() => setPrevPressed(false), 200);
    playPreviousSong();
  };

  const handleNext = () => {
    setNextPressed(true);
    setTimeout(() => setNextPressed(false), 200);
    playNextSong();
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
            image: playlist.PlaylistPicture || playlist.PlaylistImage || playlist.ImageURL || "https://placehold.co/100x100"
          }));
          
          setAvailablePlaylists(formattedPlaylists);
        })
        .catch(error => {
          console.error("Error fetching playlists:", error);
        });
    }
  }, [user]);

  const handleAddToPlaylist = (playlistId) => {
    const songId = currentSong.id;
    console.log("Adding song to playlist:", { 
      songId: songId, 
      playlistId: playlistId 
    });
    
    fetch(`http://localhost:5142/api/database/AddSongPlaylist?SongID=${songId}&PlaylistID=${playlistId}`, {
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

  // Reset when song changes
  useEffect(() => {
    setCurrentTime(0);
    // Use the provided duration or reset to 0
    setSongDuration(duration || 0);
  }, [songSrc, duration]);

  // Update time as song plays
  useEffect(() => {
    let interval;
    if (isPlaying && playerRef.current) {
      interval = setInterval(() => {
        try {
          const current = playerRef.current.seek();
          if (typeof current === 'number') {
            setCurrentTime(current);
            
            // Use the dynamic songDuration instead of the prop
            const currentDuration = songDuration || duration || 100;
            updateProgressBarFill(current, currentDuration);
          }
        } catch (e) {
          console.error("Error while updating time:", e);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, songDuration, duration]);

  // Initialize volume slider fill on component mount
  useEffect(() => {
    updateVolumeSliderFill(volume);
  }, []);

  // Initialize progress bar fill when component mounts or when duration changes
  useEffect(() => {
    const currentDuration = songDuration || duration || 100;
    updateProgressBarFill(currentTime, currentDuration);
  }, [currentTime, songDuration, duration]);

  return (
    <>
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
            src={songImage || "https://placehold.co/150x150"}
            alt="Album cover"
            className="music-image"
            onError={(e) => {
              e.target.src = "https://placehold.co/150x150";
            }}
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
                max={songDuration || duration || 100} 
                value={currentTime || 0} 
                onChange={(e) => {
                  const newTime = parseFloat(e.target.value);
                  setCurrentTime(newTime);
                  updateProgressBarFill(newTime, songDuration || duration || 100);
                  if (playerRef.current) {
                    playerRef.current.seek(newTime);
                  }
                }}
              />
            </div>
            <span className="total-duration">{formatDuration(songDuration || duration)}</span>
          </div>
          
          {/* Controls */}
          <div className="controls-container">
            {/* Shuffle button */}
            <button
              onClick={toggleShuffle}
              className={`control-button ${isShuffling ? "active" : ""}`}
              aria-label="Shuffle"
              title="Shuffle"
            >
              <Shuffle size={18} />
            </button>
            
            {/* Previous button */}
            <button
              onClick={handlePrevious}
              className={`control-button ${prevPressed ? "pressed" : ""}`}
              aria-label="Previous"
              title="Previous song"
              disabled={playlistSongs.length <= 1}
            >
              <SkipBack size={20} />
            </button>
            
            {/* Play/Pause button - centered between skip buttons */}
            <button
              onClick={togglePlayPause}
              className="control-button play-button"
              aria-label={isPlaying ? "Pause" : "Play"}
              title={isPlaying ? "Pause" : "Play"}
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
              title="Next song"
              disabled={playlistSongs.length <= 1}
            >
              <SkipForward size={20} />
            </button>
            
            {/* Add to playlist button */}
            <button
              onClick={toggleAddToPlaylist}
              className={`control-button ${songAdded ? "added" : ""}`}
              aria-label="Add to Playlist"
              title="Add to playlist"
            >
              {songAdded ? <Check size={18} /> : <Plus size={18} />}
            </button>
            
            {/* Report button */}
            <button
              onClick={toggleReporting}
              className={`control-button ${isReporting ? "reporting" : ""}`}
              aria-label="Report"
              title="Report this song"
            >
              <Flag size={18} />
            </button>
          </div>
        </div>
        
        {/* Volume control */}
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
                if (playerRef.current) {
                  playerRef.current.volume(newVolume);
                }
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
            onEnd={handleSongEnd}
            onLoad={() => {
              // When audio loads, try to get the actual duration
              if (playerRef.current) {
                setTimeout(() => {
                  try {
                    const actualDuration = playerRef.current.duration();
                    if (actualDuration && !isNaN(actualDuration) && actualDuration > 0) {
                      console.log("Audio loaded, duration:", actualDuration);
                      setSongDuration(actualDuration);
                    }
                  } catch (e) {
                    console.error("Error getting duration on load:", e);
                  }
                }, 500); // Give it a bit of time to initialize
              }
            }}
            html5={true}
          />
        )}
      </div>
    </>
  );
};

export default MusicPlayer;