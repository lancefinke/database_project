import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react"; // Icons for UI
import './MusicPlayer.css';

const MusicPlayer = ({ playlist }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // State for play/pause
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
  };

  const rewindSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  // Update audio source when song index changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[currentSongIndex];
      if (isPlaying) audioRef.current.play(); // Auto-play next song
    }
  }, [currentSongIndex, playlist, isPlaying]);

  return (
    <div className="music-player flex flex-col items-center p-4 bg-gray-800 rounded-xl">
      <audio ref={audioRef} />
      <div className="flex gap-4 mt-4">
        <button onClick={rewindSong} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500">
          <SkipBack />
        </button>
        <button onClick={togglePlayPause} className="p-2 bg-green-600 text-white rounded-full hover:bg-green-500">
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <button onClick={skipSong} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500">
          <SkipForward />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
