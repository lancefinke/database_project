import React, { useState, useRef, useEffect } from "react";
import { Pause, SkipForward, SkipBack, Shuffle, Plus, Check, Volume2, Flag, Star } from "lucide-react";
import Editable from "./Editable";
import PlaylistSelectionPopup from "./PlaylistSelectionPopup";
import ReactHowler from 'react-howler';
import "./MusicPlayer.css";

// FlagReport component
const FlagReport = ({ onClose }) => {
  return (
    <>
      <div className="music-player-overlay"></div>
      <div className="music-player-flag-wrapper">
        <label style={{margin:"0 auto", textAlign:"center"}}>REASON FOR REPORT</label>
        <div className="editable-div-flag" style={{border:"3px solid white", borderRadius:"10px", width:"85%", margin:"auto", height:"60%"}}>
          <Editable 
            className="flag-editable"
            title="Enter the reason for the report"
            value=""
            div_width="90%"
            div_height="90%"
            backgroundColor="#8E1616"
            textColor="white"
            placeholder="Example: Racism, hate speech promotes violence, etc."
          />
        </div>
        <button className="submit-report-btn">REPORT SONG</button>
        <button onClick={onClose} className="cancel-report-btn">CANCEL</button>
      </div>
    </>
  );
};

// RatingDropdown component
const RatingDropdown = ({ rating, onRate, onClose }) => {
  return (
    <>
      <div className="music-player-overlay" onClick={onClose}></div>
      <div className="rating-dropdown">
        <div className="rating-title">RATE THIS SONG</div>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <div 
              key={star} 
              className={`rating-star ${rating >= star ? 'active' : ''}`} 
              onClick={() => onRate(star)}
            >
              <Star 
                size={24} 
                fill={rating >= star ? "#FFC107" : "none"} 
                color={rating >= star ? "#FFC107" : "white"} 
              />
              <span>{star}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="rating-close-btn">CLOSE</button>
      </div>
    </>
  );
};

const MusicPlayer = ({ song, artist, pageName, playlist, songUrl, songId, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [songAdded, setSongAdded] = useState(false);
  const [prevPressed, setPrevPressed] = useState(false);
  const [nextPressed, setNextPressed] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showPlaylistSelection, setShowPlaylistSelection] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [songList, setSongList] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentSongData, setCurrentSongData] = useState({
    title: song || "Song Title",
    artist: artist || "Artist Name",
    url: songUrl || "",
    id: songId || 0,
    image: "https://via.placeholder.com/150"
  });
  const [isHowlerLoaded, setIsHowlerLoaded] = useState(false);
  
  // Refs
  const playerRef = useRef(null);
  const seekBarRef = useRef(null);
  const progressTimerId = useRef(null);
  
  // Mock data for available playlists
  const [availablePlaylists, setAvailablePlaylists] = useState([
    { id: 1, name: "Chill Vibes", image: "https://via.placeholder.com/100" },
    { id: 2, name: "Workout Hits", image: "https://via.placeholder.com/100" },
    { id: 3, name: "Late Night", image: "https://via.placeholder.com/100" },
    { id: 4, name: "Vibe", image: "https://via.placeholder.com/100" },
    { id: 5, name: "Rap", image: "https://via.placeholder.com/100" }
  ]);

  // Apply page-specific class if provided
  const playerClassName = `music-player-new ${pageName ? `music-player-${pageName}` : ""}`;

  // Initialize current song data when props change
  useEffect(() => {
    if (song && songId) {
      setCurrentSongData({
        title: song || "Song Title",
        artist: artist || "Artist Name",
        url: songUrl || "",
        id: songId || 0,
        image: "https://via.placeholder.com/150"
      });
    }
  }, [song, artist, songUrl, songId]);

  // Fetch song list and set up initial song
  useEffect(() => {
    const fetchSongList = async () => {
      try {
        // Determine what list to fetch based on pageName or context
        let endpoint = "";
        
        if (pageName === 'profile') {
          // Fetch user's songs
          endpoint = `https://localhost:7152/api/database/GetUserSongs`;
        } else if (pageName === 'playlist' && currentSongData.playlistId) {
          // Fetch playlist songs
          endpoint = `https://localhost:7152/api/database/GetPlaylistSongs?PlaylistID=${currentSongData.playlistId}`;
        } else if (pageName === 'album' && currentSongData.albumId) {
          // Fetch album songs
          endpoint = `https://localhost:7152/api/database/GetAlbumSongs?AlbumID=${currentSongData.albumId}`;
        } else {
          // Default to getting all songs
          endpoint = `https://localhost:7152/api/database/GetAllSongs`;
        }
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch songs');
        }
        
        const data = await response.json();
        setSongList(data);
        
        // Find index of current song in the list
        const songIndex = data.findIndex(s => s.SongID === currentSongData.id);
        if (songIndex !== -1) {
          setCurrentSongIndex(songIndex);
        }
      } catch (error) {
        console.error('Error fetching song list:', error);
      }
    };

    if (currentSongData.id) {
      fetchSongList();
    }
  }, [currentSongData.id, pageName]);

  // Format time in minutes:seconds
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Update progress function
  const updateProgress = () => {
    if (playerRef.current && isPlaying && isHowlerLoaded) {
      try {
        const currentSecs = playerRef.current.seek();
        if (!isNaN(currentSecs)) {
          setCurrentTime(currentSecs);
          const percent = (currentSecs / duration) * 100;
          setProgressPercent(percent);
        }
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    }
  };

  // Set up the progress timer when playing
  useEffect(() => {
    if (isPlaying && isHowlerLoaded) {
      // Clear any existing timer
      if (progressTimerId.current) {
        clearInterval(progressTimerId.current);
      }
      
      // Set up a new timer
      progressTimerId.current = setInterval(updateProgress, 1000);
    } else if (progressTimerId.current) {
      // Clear the timer when not playing
      clearInterval(progressTimerId.current);
    }
    
    // Clean up on unmount
    return () => {
      if (progressTimerId.current) {
        clearInterval(progressTimerId.current);
      }
    };
  }, [isPlaying, duration, isHowlerLoaded]);

  // Handle seeking when clicking on the progress bar
  const handleSeek = (e) => {
    if (playerRef.current && duration && isHowlerLoaded) {
      try {
        const progressBar = seekBarRef.current;
        const rect = progressBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const clickPercentage = offsetX / rect.width;
        const seekTime = duration * clickPercentage;
        
        playerRef.current.seek(seekTime);
        setCurrentTime(seekTime);
        setProgressPercent(clickPercentage * 100);
      } catch (error) {
        console.error("Error seeking:", error);
      }
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // When howler loads, get duration
  const handleOnLoad = () => {
    if (playerRef.current) {
      try {
        const songDuration = playerRef.current.duration();
        setDuration(songDuration);
        setIsHowlerLoaded(true);
      } catch (error) {
        console.error("Error getting duration:", error);
        setIsHowlerLoaded(false);
      }
    }
  };

  // When song ends
  const handleOnEnd = () => {
    // When the song ends, play the next song
    handleNext();
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  const toggleAddToPlaylist = () => {
    setShowPlaylistSelection(true);
  };
  
  const handleAddToPlaylist = (playlistId) => {
    console.log(`Adding song to playlist with ID: ${playlistId}`);
    setSongAdded(true);
    setShowPlaylistSelection(false);
    
    setTimeout(() => {
      setSongAdded(false);
    }, 3000);
  };

  const toggleReporting = () => {
    setIsReporting(!isReporting);
    setShowReportForm(true);
  };

  const handleCloseReport = () => {
    setShowReportForm(false);
    setIsReporting(false);
  };

  const toggleRating = () => {
    setShowRatingDropdown(!showRatingDropdown);
  };

  const handleRateSong = (rating) => {
    setCurrentRating(rating);
    console.log(`Rating song as ${rating} stars`);
  };

  const handlePrevious = () => {
    setPrevPressed(true);
    
    if (songList.length > 0) {
      let newIndex;
      
      if (isShuffling) {
        // Random song if shuffling
        newIndex = Math.floor(Math.random() * songList.length);
      } else {
        // Previous song in order
        newIndex = (currentSongIndex - 1 + songList.length) % songList.length;
      }
      
      const prevSong = songList[newIndex];
      
      if (prevSong) {
        // Update current song data
        setCurrentSongData({
          title: prevSong.SongName,
          artist: prevSong.Username || prevSong.AuthorID,
          url: prevSong.SongFileName || prevSong.URL,
          id: prevSong.SongID,
          image: prevSong.CoverArtFileName || "https://via.placeholder.com/150"
        });
        
        setCurrentSongIndex(newIndex);
        
        // Reset progress
        setCurrentTime(0);
        setProgressPercent(0);
        setIsHowlerLoaded(false);
        
        // Continue playing if it was already playing
        if (!isPlaying) {
          setIsPlaying(true);
        }
      }
    }
    
    setTimeout(() => setPrevPressed(false), 200);
  };

  const handleNext = () => {
    setNextPressed(true);
    
    if (songList.length > 0) {
      let newIndex;
      
      if (isShuffling) {
        // Random song if shuffling
        newIndex = Math.floor(Math.random() * songList.length);
      } else {
        // Next song in order
        newIndex = (currentSongIndex + 1) % songList.length;
      }
      
      const nextSong = songList[newIndex];
      
      if (nextSong) {
        // Update current song data
        setCurrentSongData({
          title: nextSong.SongName,
          artist: nextSong.Username || nextSong.AuthorID,
          url: nextSong.SongFileName || nextSong.URL,
          id: nextSong.SongID,
          image: nextSong.CoverArtFileName || "https://via.placeholder.com/150"
        });
        
        setCurrentSongIndex(newIndex);
        
        // Reset progress
        setCurrentTime(0);
        setProgressPercent(0);
        setIsHowlerLoaded(false);
        
        // Continue playing if it was already playing
        if (!isPlaying) {
          setIsPlaying(true);
        }
      }
    }
    
    setTimeout(() => setNextPressed(false), 200);
  };

  const handleClosePlayer = () => {
    // Make sure to clean up Howler before closing
    setIsPlaying(false);
    
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 100); // Small delay to ensure Howler has time to clean up
    }
  };

  // Check if we have a valid URL
  const hasValidUrl = currentSongData.url && typeof currentSongData.url === 'string' && currentSongData.url.trim() !== '';

  return (
    <>
      {/* Only render ReactHowler if we have a valid URL */}
      {hasValidUrl && (
        <ReactHowler
          src={currentSongData.url}
          playing={isPlaying}
          volume={volume}
          onLoad={handleOnLoad}
          onEnd={handleOnEnd}
          ref={playerRef}
          html5={true}
        />
      )}
      
      {showReportForm && <FlagReport onClose={handleCloseReport} />}
      
      {showPlaylistSelection && (
        <PlaylistSelectionPopup 
          onClose={() => setShowPlaylistSelection(false)}
          playlists={availablePlaylists}
          onAddToPlaylist={handleAddToPlaylist}
          currentSong={currentSongData}
        />
      )}
      
      {showRatingDropdown && (
        <RatingDropdown 
          rating={currentRating}
          onRate={handleRateSong}
          onClose={() => setShowRatingDropdown(false)}
        />
      )}
      
      <div className={playerClassName}>
        {/* Song Info Section */}
        <div className="player-song-info">
          <img 
            src={currentSongData.image}
            alt="Album cover" 
            className="player-album-cover" 
          />
          <div className="player-text-info">
            <p className="player-song-title">{currentSongData.title}</p>
            <p className="player-artist-name">{currentSongData.artist}</p>
          </div>
        </div>
        
        {/* Main Player Controls */}
        <div className="player-controls-section">
          {/* Progress Bar */}
          <div className="player-progress">
            <span className="player-time">{formatTime(currentTime)}</span>
            <div 
              className="player-progress-bar-container" 
              ref={seekBarRef}
              onClick={handleSeek}
            >
              <div className="player-progress-bar-bg">
                <div 
                  className="player-progress-bar" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            <span className="player-time">{formatTime(duration)}</span>
          </div>
          
          {/* Player Controls */}
          <div className="player-controls">
            <button 
              className={`player-control-btn ${isShuffling ? "active" : ""}`}
              onClick={toggleShuffle}
              title="Shuffle"
            >
              <Shuffle size={18} color={isShuffling ? "#FFC107" : "white"} />
            </button>
            
            <button 
              className={`player-control-btn ${prevPressed ? "pressed" : ""}`}
              onClick={handlePrevious}
              title="Previous"
            >
              <SkipBack size={20} color="white" />
            </button>
            
            <button 
              className="player-play-btn"
              onClick={togglePlayPause}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={22} color="white" />
              ) : (
                "▶"
              )}
            </button>
            
            <button 
              className={`player-control-btn ${nextPressed ? "pressed" : ""}`}
              onClick={handleNext}
              title="Next"
            >
              <SkipForward size={20} color="white" />
            </button>
            
            <button 
              className={`player-control-btn ${songAdded ? "active" : ""}`}
              onClick={toggleAddToPlaylist}
              title={songAdded ? "Added to Playlist" : "Add to Playlist"}
            >
              {songAdded ? 
                <Check size={18} color="#FFC107" /> : 
                <Plus size={18} color="white" />
              }
            </button>
          </div>
        </div>
        
        {/* Right Controls */}
        <div className="player-right-controls">
          <button 
            className={`player-control-btn ${currentRating > 0 ? "active" : ""}`}
            onClick={toggleRating}
            title="Rate Song"
          >
            <Star 
              size={18} 
              color={currentRating > 0 ? "#FFC107" : "white"} 
              fill={currentRating > 0 ? "#FFC107" : "none"} 
            />
          </button>
          
          <button 
            className={`player-control-btn ${isReporting ? "active" : ""}`}
            onClick={toggleReporting}
            title="Report Song"
          >
            <Flag size={18} color={isReporting ? "#FFC107" : "white"} />
          </button>
          
          <div className="player-volume">
            <Volume2 size={18} color="white" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              className="player-volume-slider"
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setVolume(newVolume);
              }}
            />
          </div>
          
          {onClose && (
            <button 
              className="player-close-btn" 
              onClick={handleClosePlayer}
              title="Close Player"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;