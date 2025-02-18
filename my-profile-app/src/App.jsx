import ProfilePage from "./ProfilePage/ProfilePage";
import MusicPlayer from "./ProfilePage/Components/MusicPlayer";
import NavBar from "./ProfilePage/Components/NavBar";
import SongIcon from "./ProfilePage/Components/SongIcon"; // Ensure correct import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./ProfilePage/Components/SongIcon.css"; // Import the correct CSS file

// Sample songs for testing
const sampleSongs = [
  {
    name: "Lost in the Echo",
    creator: "Linkin Park",
    duration: "3:31",
    flags: ["Rock", "Popular"],
    iconImage: "/images/lost-in-the-echo.jpg", // Update with actual image path
  },
  {
    name: "Blinding Lights",
    creator: "The Weeknd",
    duration: "3:20",
    flags: ["Pop", "Hit"],
    iconImage: "/images/blinding-lights.jpg",
  },
  {
    name: "Bohemian Rhapsody",
    creator: "Queen",
    duration: "5:55",
    flags: ["Classic", "Legendary"],
    iconImage: "/images/bohemian-rhapsody.jpg",
  }
];

const playlist = [
  "/music/song1.mp3",
  "/music/song2.mp3",
  "/music/song3.mp3"
];

function App() {
  return (
    <div>
      <ProfilePage />
      <MusicPlayer playlist={playlist} />
      <NavBar />

      {/* Display multiple SongIcon components */}
      <div className="song-list">
        {sampleSongs.map((song, index) => (
          <SongIcon 
            key={index}
            name={song.name} 
            creator={song.creator} 
            duration={song.duration} 
            flags={song.flags} 
            iconImage={song.iconImage} 
          />
        ))}
      </div>
    </div>
  );
}

export default App;
