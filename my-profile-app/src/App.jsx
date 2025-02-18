import ProfilePage from "./ProfilePage/ProfilePage";
import MusicPlayer from "./ProfilePage/Components/MusicPlayer";
import NavBar from "./ProfilePage/Components/NavBar";
import SongIcon from "./ProfilePage/Components/SongIcon";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./ProfilePage/ProfilePage.css"; // Add this import
import "./ProfilePage/Components/SongIcon.css";

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
    <div className="app-container"> {/* Add a container class */}
      <NavBar />
      <main className="main-content"> {/* Add a main content wrapper */}
        <ProfilePage />
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
      </main>
      <MusicPlayer playlist={playlist} />
    </div>
  );
}

export default App;
