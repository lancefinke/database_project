import React, { useEffect } from "react";
import ProfilePage from "./ProfilePage/ProfilePage";
import MusicPlayer from "./ProfilePage/Components/MusicPlayer";
import SongIcon from "./ProfilePage/Components/SongIcon";
import HomePage from "./HomePage/HomePage";
import LoginPage from "./LoginPage/LoginPage";
import SearchPage from "./SearchPage/SearchPage";
import Admin from "./Admin/Admin";
import UserPage from "./ProfilePage/UserPage/UserPage";
import SignupPage from "./SignupPage/Signuppage";
import ResetPassword from "./ResetPasswordPage/ResetPassword";
import SideBar from "./ProfilePage/Components/SideBar";
import FollowingPage from "./FollowingPage/FollowingPage";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./ProfilePage/ProfilePage.css";
import "./ProfilePage/Components/SongIcon.css";

// Sample songs for the profile page
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
  },
  {
    name: "Stairway to Heaven",
    creator: "Led Zeppelin",
    duration: "8:02",
    flags: ["Rock", "Classic"],
    iconImage: "/images/stairway-to-heaven.jpg",
  },
  {
    name: "Thriller",
    creator: "Michael Jackson",
    duration: "5:57",
    flags: ["Pop", "Iconic"],
    iconImage: "/images/thriller.jpg",
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

  // Show music player on all pages except home
  const showMusicPlayer = location.pathname !== '/home' && location.pathname!=='/login' && location.pathname!=='/signup' && location.pathname!=='/reset' && location.pathname!=='/admin';
  
  // Determine which pageName to use for MusicPlayer based on the current route
  const getMusicPlayerPageName = () => {
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname === '/search') return 'search';
    if (location.pathname === '/following') return 'following';
    return 'default';
  };

  return (
    <div className="app-container">
      {location.pathname!=='/login' && location.pathname!=='/signup' && location.pathname!=='/reset' && <SideBar />}
      <main className="main-content">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile" element={
            <>
              <UserPage />
              <div className="song-list">
                <div className="dice-five-layout">
                  {sampleSongs.map((song, index) => (
                    <div key={index} className={`song-position-${index + 1}`}>
                      <SongIcon
                        name={song.name}
                        creator={song.creator}
                        duration={song.duration}
                        flags={song.flags}
                        iconImage={song.iconImage}
                        isHomePage={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          } />
          <Route path="/user" element={<ProfilePage />} />
          <Route path="/following" element={<FollowingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/reset' element={<ResetPassword />} />
          <Route path='/admin' element={<Admin />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
      
      {showMusicPlayer && (
        <MusicPlayer
          playlist={playlist}
          song="Why Cant You"
          artist="Bryant Barnes"
          pageName={getMusicPlayerPageName()}
        />
      )}
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