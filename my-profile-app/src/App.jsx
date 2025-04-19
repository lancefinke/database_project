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
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [selectedSong, setSelectedSong] = useState(null);
  const { isLoggedIn, setLoggedIn, currentRoute, setCurrentRoute } = useLoginContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Update current route when location changes
  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/reset') {
      setCurrentRoute(location.pathname);
      localStorage.setItem('currentRoute', location.pathname);
    }
  }, [location.pathname, setCurrentRoute]);

  // Handle initial load and route
  useEffect(() => {
    if (isInitialLoad && isLoggedIn) {
      const savedRoute = localStorage.getItem('currentRoute');
      if (savedRoute && savedRoute !== '/' && savedRoute !== '/home') {
        navigate(savedRoute, { replace: true });
      }
      setIsInitialLoad(false);
    }
  }, [isLoggedIn, isInitialLoad, navigate]);
  
  console.log("AppLayout rendering, path:", location.pathname);
  
  // Check admin status on initial load and whenever login status changes
  useEffect(() => {
    const checkAdminStatus = () => {
      // Get raw value from localStorage
      const rawAdminValue = localStorage.getItem('isAdmin');
      // Convert to boolean
      const adminStatus = rawAdminValue === 'true';
      
      console.log("ADMIN CHECK - localStorage 'isAdmin':", rawAdminValue);
      console.log("ADMIN CHECK - Converted adminStatus:", adminStatus);
      console.log("ADMIN CHECK - isLoggedIn:", isLoggedIn);
      
      // Update state
      setIsAdmin(adminStatus);
      
      // Immediate redirect for admin users
      if (isLoggedIn && adminStatus && 
          location.pathname !== '/admin' && 
          location.pathname !== '/login' && 
          location.pathname !== '/signup' && 
          location.pathname !== '/reset') {
        console.log("IMMEDIATE REDIRECT to admin page");
        navigate('/admin');
      }
    };
    
    checkAdminStatus();
  }, [isLoggedIn, location.pathname, navigate]);
  
  useEffect(() => {
    console.log("Admin state changed to:", isAdmin);
    
    // Force redirect when isAdmin becomes true
    if (isAdmin && isLoggedIn && location.pathname !== '/admin') {
      console.log("FORCE REDIRECTING to admin page after state change");
      navigate('/admin');
    }
  }, [isAdmin, isLoggedIn, navigate, location.pathname]);
  
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

  // If not fully loaded yet, show loading
  if (isLoggedIn === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      {isLoggedIn && location.pathname !== '/login' && location.pathname !== '/signup' && 
         location.pathname !== '/reset' && location.pathname !== '/' && (
         isAdmin ? <AdminSidebar /> : <SideBar />
      )}
      <main className={`main-content ${isAdmin ? 'admin-content' : ''}`}>
        <Routes>
          <Route path="/" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to={currentRoute || '/home'} replace />)
              : <Navigate to="/login" replace />
          } />
          <Route path="/home" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <HomePage />) 
              : <Navigate to="/login" replace />
          } />
          <Route path="/search" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <SearchPage onSongSelect={handleSongSelect} />)
              : <Navigate to="/login" replace />
          } />
          <Route path="/profile" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <UserPage onSongSelect={handleSongSelect} />)
              : <Navigate to="/login" replace />
          } />
          <Route path="/user" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <ProfilePage onSongSelect={handleSongSelect} />)
              : <Navigate to="/login" replace />
          } />
          <Route path="/profile/:userId" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <ProfilePage onSongSelect={handleSongSelect} />)
              : <Navigate to="/login" replace />
          } />
          <Route path="/following" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <FollowingPage onSongSelect={handleSongSelect} />)
              : <Navigate to="/login" replace />
          } />
          <Route path="/dashboard" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <Dashboard />)
              : <Navigate to="/login" replace />
          } />
          <Route path='/admin' element={
            isLoggedIn 
              ? (isAdmin ? <Admin /> : <Navigate to="/home" replace />)
              : <Navigate to="/login" replace />
          } />
          <Route path='/login' element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />)
              : <LoginPage />
          } />
          <Route path='/signup' element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />)
              : <SignupPage />
          } />
          <Route path='/reset' element={<ResetPassword />} />
        </Routes>
      </main>
      
      {showMusicPlayer && selectedSong && (
        <MusicPlayer
          duration = {selectedSong.duration}
          songSrc = {selectedSong.songSrc}
          songImage = {selectedSong.songImage}
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