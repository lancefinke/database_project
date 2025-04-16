import React, { useEffect, useState } from "react";
import ProfilePage from "./ProfilePage/ProfilePage";
import MusicPlayer from "./ProfilePage/Components/MusicPlayer";
import HomePage from "./HomePage/HomePage";
import LoginPage from "./LoginPage/LoginPage";
import SearchPage from "./SearchPage/SearchPage";
import AddSong from "./ProfilePage/Components/AddSong";
import Admin from "./Admin/Admin"; // Using your existing Admin component
import UserPage from "./ProfilePage/UserPage/UserPage";
import SignupPage from "./SignupPage/Signuppage";
import ResetPassword from "./ResetPasswordPage/ResetPassword";
import SideBar from "./ProfilePage/Components/SideBar";
import AdminSidebar from "./Admin/AdminSidebar"; // Admin-specific sidebar
import FollowingPage from "./FollowingPage/FollowingPage";
import Dashboard from "./ProfilePage/UserPage/Dashboard";
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from "react-router-dom";
import "./ProfilePage/ProfilePage.css";
import { useLoginContext } from "./LoginContext/LoginContext";

// Sample audio files for the music player
const playlist = [
  "/music/song1.mp3",
  "/music/song2.mp3",
  "/music/song3.mp3"
];

// Layout wrapper to handle class changes based on route
const AppLayout = () => {
  const location = useLocation();
  const [selectedSong, setSelectedSong] = useState(null);
  const { isLoggedIn } = useLoginContext();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check if the user is an admin on component mount
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    console.log("localStorage 'isAdmin':", localStorage.getItem('isAdmin'));
    console.log("Converted adminStatus:", adminStatus);
    setIsAdmin(adminStatus);
  }, []);
  
  useEffect(() => {
    if (location.pathname === '/profile') {
      document.body.classList.add('profile-page-active');
    } else {
      document.body.classList.remove('profile-page-active');
    }
  }, [location]);

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  const handleClosePlayer = () => {
    setSelectedSong(null);
  };
  
  const showMusicPlayer = selectedSong !== null && 
    location.pathname !== '/home' && 
    location.pathname !== '/login' && 
    location.pathname !== '/signup' && 
    location.pathname !== '/reset' && 
    location.pathname !== '/admin';
  
  const getMusicPlayerPageName = () => {
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname === '/search') return 'search';
    if (location.pathname === '/following') return 'following';
    if (location.pathname === '/dashboard') return 'dashboard';
    return 'default';
  };

  // If user is logged in as admin, redirect to admin page
  if (isLoggedIn && isAdmin && location.pathname !== '/admin' && 
      location.pathname !== '/login' && location.pathname !== '/signup' && 
      location.pathname !== '/reset') {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="app-container">
      {isLoggedIn && location.pathname !== '/login' && location.pathname !== '/signup' && 
         location.pathname !== '/reset' && location.pathname !== '/' && (
         isAdmin ? <AdminSidebar /> : <SideBar />
      )}
      <main className={`main-content ${isAdmin ? 'admin-content' : ''}`}>
        <Routes>
          <Route path="/home" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" /> : <HomePage />) 
              : <Navigate to="/login" />
          } />
          <Route path="/search" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" /> : <SearchPage onSongSelect={handleSongSelect} />)
              : <Navigate to="/login" />
          } />
          <Route path="/profile" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" /> : <UserPage onSongSelect={handleSongSelect} />)
              : <Navigate to="/login" />
          } />
          <Route path="/user" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" /> : <ProfilePage onSongSelect={handleSongSelect} />)
              : <Navigate to="/login" />
          } />
          <Route path="/profile/:userId" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" /> : <ProfilePage onSongSelect={handleSongSelect} />)
              : <Navigate to="/login" />
          } />
          <Route path="/following" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" /> : <FollowingPage onSongSelect={handleSongSelect} />)
              : <Navigate to="/login" />
          } />
          <Route path="/dashboard" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" /> : <Dashboard />)
              : <Navigate to="/login" />
          } />
          <Route path='/admin' element={
            isLoggedIn 
              ? (isAdmin ? <Admin /> : <Navigate to="/home" />)
              : <Navigate to="/login" />
          } />
          <Route path='/login' element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/home" />)
              : <LoginPage />
          } />
          <Route path='/signup' element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/home" />)
              : <SignupPage />
          } />
          <Route path='/reset' element={<ResetPassword />} />
          <Route path="/" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" /> : <Navigate to="/home" />)
              : <Navigate to="/login" />
          } />
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