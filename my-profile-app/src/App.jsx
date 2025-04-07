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
import { useLoginContext } from "./LoginContext/LoginContext";

// Sample audio files for the music player
const playlist = [
  "/music/song1.mp3",
  "/music/song2.mp3",
  "/music/song3.mp3"
];

const LeaveAdminPage = () =>{
  return(
    <h1 style={{fontSize:"200%"}}>You are not authorized to access this page. <Link style={{color:"white",fontSize:"100%"}} to="/home">Click Here to Return</Link></h1>
  );
}

// Layout wrapper to handle class changes based on route
const AppLayout = () => {
  const location = useLocation();
  
  // Add state to track selected song
  const [selectedSong, setSelectedSong] = useState(null);

  //loggedinContext
  const {isLoggedIn} = useLoginContext();
  
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
  const [role, setRole] = useState('admin');

  return (
    <div className="app-container">
      {isLoggedIn && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/reset' && location.pathname!=='/'&&<SideBar />}
      <main className="main-content">
      <Routes>
        <Route path="/home" element={isLoggedIn?<HomePage />:<LoginPage/>} />
        <Route path="/search" element={isLoggedIn?<SearchPage onSongSelect={handleSongSelect} />:<LoginPage/>} />
        <Route path="/profile" element={isLoggedIn?<UserPage onSongSelect={handleSongSelect} />:<LoginPage/>} />
        <Route path="/user" element={isLoggedIn?<ProfilePage onSongSelect={handleSongSelect} />:<LoginPage/>} />
        <Route path="/profile/:userId" element={isLoggedIn?<ProfilePage onSongSelect={handleSongSelect} />:<LoginPage/>} />
        <Route path="/following" element={isLoggedIn?<FollowingPage onSongSelect={handleSongSelect}/>:<LoginPage/> } />
        <Route path="/dashboard" element={isLoggedIn?<Dashboard/> :<LoginPage/> } /> {/* Add Dashboard route */}
        <Route path='/admin' element={isLoggedIn?role === 'admin' ? <Admin /> :<LeaveAdminPage/>:<LoginPage/>} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/reset' element={<ResetPassword />} />
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