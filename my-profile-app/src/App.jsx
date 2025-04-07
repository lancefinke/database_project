import React, { useEffect, useState } from "react";
import ProfilePage from "./ProfilePage/ProfilePage";
import MusicPlayer from "./ProfilePage/Components/MusicPlayer";
import HomePage from "./HomePage/HomePage";
import LoginPage from "./LoginPage/LoginPage";
import SearchPage from "./SearchPage/SearchPage";
import AddSong from "./ProfilePage/Components/AddSong";
import Admin from "./Admin/Admin";
import UserPage from "./ProfilePage/UserPage/UserPage";
import SignupPage from "./SignupPage/Signuppage";
import ResetPassword from "./ResetPasswordPage/ResetPassword";
import SideBar from "./ProfilePage/Components/SideBar";
import FollowingPage from "./FollowingPage/FollowingPage";
import Dashboard from "./ProfilePage/UserPage/Dashboard"; // Import the Dashboard component
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from "react-router-dom";
import "./ProfilePage/ProfilePage.css";

// Sample audio files for the music player
const playlist = [
  "/music/song1.mp3",
  "/music/song2.mp3",
  "/music/song3.mp3"
];

// Layout wrapper to handle class changes based on route
const AppLayout = () => {
  const location = useLocation();
  
  // Add state to track selected song
  const [selectedSong, setSelectedSong] = useState(null);
  
  useEffect(() => {
    // Add a class to the app container based on the current route
    if (location.pathname === '/profile') {
      document.body.classList.add('profile-page-active');
    } else {
      document.body.classList.remove('profile-page-active');
    }
  }, [location]);

  // Function to handle song selection
  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  // Function to close the music player
  const handleClosePlayer = () => {
    setSelectedSong(null);
  };
  
  // Show music player only when a song is selected and not on excluded pages
  const showMusicPlayer = selectedSong !== null && 
    location.pathname !== '/home' && 
    location.pathname !== '/login' && 
    location.pathname !== '/signup' && 
    location.pathname !== '/reset' && 
    location.pathname !== '/admin';
  
  // Determine which pageName to use for MusicPlayer based on the current route
  const getMusicPlayerPageName = () => {
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname === '/search') return 'search';
    if (location.pathname === '/following') return 'following';
    if (location.pathname === '/dashboard') return 'dashboard';
    return 'default';
  };

  //useStates
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState('admin');

  return (
    <div className="app-container">
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/reset' && location.pathname!=='/'&&<SideBar />}
      <main className="main-content">
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage onSongSelect={handleSongSelect} />} />
        <Route path="/profile" element={<UserPage onSongSelect={handleSongSelect} />} />
        <Route path="/user" element={<ProfilePage onSongSelect={handleSongSelect} />} />
        <Route path="/profile/:userId" element={<ProfilePage onSongSelect={handleSongSelect} />} />
        <Route path="/following" element={<FollowingPage onSongSelect={handleSongSelect} />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Add Dashboard route */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/reset' element={<ResetPassword />} />
        <Route path='/admin' element={role === 'admin' ? <Admin /> : <h1 style={{fontSize:"200%"}}>You are not authorized to access this page. <Link style={{color:"white",fontSize:"100%"}} to="/home">Click Here to Return</Link></h1>}></Route>
        <Route path="/" element={<LoginPage />} />
      </Routes>
      </main>
      
      {showMusicPlayer && selectedSong && (
        <MusicPlayer
          playlist={playlist}
          song={selectedSong.name}
          artist={selectedSong.creator}
          pageName={getMusicPlayerPageName()}
          onClose={handleClosePlayer}
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