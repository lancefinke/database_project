import { useRef, useEffect, useState } from "react";
import { Play, Plus, Pause, Flag, Check } from "lucide-react";
import UserLink from "../../UserLink/UserLink";
import "./SongIcon.css";
import ReactHowler from 'react-howler';
import FlagIcon from "./FlagIcon";

const SongIcon = ({
  name,
  creator,
  duration,
  flags,
  iconImage,
  isHomePage,
  isCenter,
  shouldPlay = false,
  songSrc,
  onPlayStatusChange,
  AverageRating,
  songID,
  onRate
}) => {
  const [showReport, setShowReport] = useState(false);
  const [rating, setRating] = useState("");
  const [addedToPlaylist, setAddedToPlaylist] = useState(false);
  const [recordSpinning, setRecordSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef(null);

  // Animate record spinning
  useEffect(() => {
    if (shouldPlay) {
      const animate = () => {
        setRotation(prev => (prev + 1) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
      setRecordSpinning(true);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setRecordSpinning(false);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [shouldPlay]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (onPlayStatusChange) {
      onPlayStatusChange(!shouldPlay); // toggle play/pause
    }
  };

  const handleCloseReport = () => {
    setShowReport(false);
  };

  const toggleAddToPlaylist = (e) => {
    e.stopPropagation();
    setAddedToPlaylist(prev => !prev);
  };

  const handleFlagClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
    setShowReport(true);
    document.body.classList.add('modal-open');
  };

  const audioSrc = songSrc || 'https://blobcontainer2005.blob.core.windows.net/songfilecontainer/uploads/008ad32f-f270-4462-8577-bf4a9c3db258.mp3';

  return (
    <>
      <ReactHowler src={audioSrc} playing={shouldPlay} />

      {showReport && <FlagIcon onClose={handleCloseReport} SongID={songID} />}

      <div className={`song-container ${isHomePage ? 'home-song' : ''} ${isCenter ? 'center-song' : ''}`}>
        <button className="record-button" onClick={togglePlay}>
          <div className={`record ${shouldPlay ? 'playing' : ''}`} style={{ transform: `rotate(${rotation}deg)` }}>
            <div className="record-grooves">
              <div className="record-inner"></div>
              <div className="record-label">
                <img src={iconImage || "https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"} alt="Album Art" />
              </div>
            </div>
          </div>
        </button>

        <div className="song-details">
          <div className="song-info">
            <h3 className="song-title">{name}</h3>
            <h4 className="song-creator"><UserLink text={creator} userName={creator} /></h4>
            <div className="meta-row">
              <div className="flags">
                {flags && flags.map((flagName, index) => (
                  <div key={index} className="flag-item">{flagName}</div>
                ))}
              </div>
              <div className="song-duration">{duration}</div>
            </div>
          </div>

          <div className="song-controls">
            <button className="control-button play-button" onClick={togglePlay}>
              {shouldPlay ? <Pause size={28} color="white" /> : <Play size={28} color="white" />}
            </button>

            <button
              className={`control-button add-button ${addedToPlaylist ? "added" : ""}`}
              onClick={toggleAddToPlaylist}
              title={addedToPlaylist ? "Remove from Playlist" : "Add to Playlist"}
            >
              {addedToPlaylist ? <Check size={28} color="white" /> : <Plus size={28} color="white" />}
            </button>

            {location.pathname !== '/profile' && (
              <button
                className="control-button flag-button"
                onClick={handleFlagClick}
                title="Report Song"
              >
                <Flag size={28} color="white" />
              </button>
            )}
          </div>

          <div className="rating-container">
            {location.pathname !== '/profile' && (
              <div className="rating-row">
                <select
                  className="rating-select"
                  value={rating || ""}
                  onChange={(e) => {
                    const selectedRating = parseInt(e.target.value);
                    setRating(selectedRating);
                    if (onRate && songID && !isNaN(selectedRating)) {
                      onRate(songID, selectedRating);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="">Rate</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <div className="average-rating">Average Rating: {AverageRating}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SongIcon;
