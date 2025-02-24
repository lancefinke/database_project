import React, { useEffect } from "react";
import ProfilePage from "./ProfilePage/ProfilePage";
import MusicPlayer from "./ProfilePage/Components/MusicPlayer";
import NavBar from "./ProfilePage/Components/NavBar";
import SongIcon from "./ProfilePage/Components/SongIcon";
import HomePage from "./HomePage/HomePage";
import SearchPage from "./SearchPage/SearchPage";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./ProfilePage/ProfilePage.css";
import "./ProfilePage/Components/SongIcon.css";

// Sample songs for testing
const sampleSongs = [
  {
    name: "Lost in the Echo",
    creator: "Linkin Park",
    duration: "3:31",
    flags: ["Rock", "Popular"],
    iconImage: "/images/lost-in-the-echo.jpg",
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

// Layout wrapper to handle class changes based on route
const AppLayout = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Add a class to the app container based on the current route
    if (location.pathname === '/profile') {
      document.body.classList.add('profile-page-active');
    } else {
      document.body.classList.remove('profile-page-active');
    }
  }, [location]);

  return (
    <div className="app-container">
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={
            <>
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
            </>
          } />
        </Routes>
      </main>
      <MusicPlayer playlist={playlist} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;