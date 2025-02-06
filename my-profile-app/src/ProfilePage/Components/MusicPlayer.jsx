import React, { useState, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react"; // Icons for UI
import './MusicPlayer.css';

const MusicPlayer = ({ playlist }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(null);

  const playSong = () => {
    if (audioRef.current) audioRef.current.play();
  };

  const pauseSong = () => {
    if (audioRef.current) audioRef.current.pause();
  };

  const skipSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
  };

  const rewindSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  // Update audio source when song index changes
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[currentSongIndex];
      audioRef.current.play(); // Auto-play next song
    }
  }, [currentSongIndex, playlist]);

  return (
    <div className="music-player flex flex-col items-center p-4 bg-gray-800 rounded-xl">
  <audio ref={audioRef} />
  <div className="flex gap-4 mt-4">
    <button onClick={rewindSong} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500">
      <SkipBack />
    </button>
    <button onClick={playSong} className="p-2 bg-green-600 text-white rounded-full hover:bg-green-500">
      <Play />
    </button>
    <button onClick={pauseSong} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500">
      <Pause />
    </button>
    <button onClick={skipSong} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500">
      <SkipForward />
    </button>
  </div>
  
</div>

  );
};

export default MusicPlayer;
