import React, { useEffect, useState } from "react";
import ProfilePage from "./ProfilePage/ProfilePage";
import MusicPlayer from "./ProfilePage/Components/MusicPlayer";
import HomePage from "./HomePage/HomePage";
import LoginPage from "./LoginPage/LoginPage";
import SearchPage from "./SearchPage/SearchPage";
import AdminPage from "./Admin/Admin"; 
import UserPage from "./ProfilePage/UserPage/UserPage";
import SignupPage from "./SignupPage/Signuppage";
import ResetPassword from "./ResetPasswordPage/ResetPassword";
import SideBar from "./ProfilePage/Components/SideBar";
import AdminSidebar from "./Admin/AdminSidebar"; 
import FollowingPage from "./FollowingPage/FollowingPage";
import Dashboard from "./ProfilePage/UserPage/Dashboard";
import PlaylistPage from "./ProfilePage/Components/PlaylistPage";
import { PlayerProvider, usePlayerContext } from './contexts/PlayerContext';

import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import "./ProfilePage/ProfilePage.css";
import { useLoginContext } from "./LoginContext/LoginContext";
import { useUserContext } from "./LoginContext/UserContext";

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    currentSong, 
    isPlaying, 
    isShuffling, 
    togglePlayPause, 
    toggleShuffle,
    playPreviousSong,
    playNextSong,
    handleSongEnd,
    setIsPlaying,
    playlistSongs
  } = usePlayerContext();
  
  const { isLoggedIn, setLoggedIn, currentRoute, setCurrentRoute } = useLoginContext();
  const { user } = useUserContext();
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
  
  // Check admin status on initial load and whenever login status changes
  useEffect(() => {
    const checkAdminStatus = () => {
      const rawAdminValue = localStorage.getItem('isAdmin');
      const adminStatus = rawAdminValue === 'true';
      setIsAdmin(adminStatus);
      
      if (isLoggedIn && adminStatus && 
          location.pathname !== '/admin' && 
          location.pathname !== '/login' && 
          location.pathname !== '/signup' && 
          location.pathname !== '/reset') {
        navigate('/admin');
      }
    };
    
    checkAdminStatus();
  }, [isLoggedIn, location.pathname, navigate]);
  
  useEffect(() => {
    if (isAdmin && isLoggedIn && location.pathname !== '/admin') {
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

  useEffect(() => {
    if (location.pathname === '/home') {
      // Stop music when navigating to explore page
      setIsPlaying(false);
    }
  }, [location.pathname, setIsPlaying]);

  // Check if user is viewing their own profile by username parameter
  useEffect(() => {
    if (user && location.pathname.startsWith('/profile/')) {
      const usernameFromUrl = location.pathname.split('/profile/')[1];
      if (usernameFromUrl && user.Username === usernameFromUrl) {
        // Redirect to editable profile if viewing their own profile
        navigate('/profile', { replace: true });
      }
    }
  }, [location.pathname, user, navigate]);

  const handleClosePlayer = () => {
    setIsPlaying(false);
  };
  
  const showMusicPlayer = currentSong !== null && 
  !location.pathname.startsWith('/home') &&
  location.pathname !== '/login' &&
  location.pathname !== '/signup' &&
  location.pathname !== '/reset' &&
  location.pathname !== '/admin';
  
  const getMusicPlayerPageName = () => {
    if (location.pathname === '/profile') return 'profile';
    if (location.pathname.startsWith('/profile/')) return 'artist-profile';
    if (location.pathname === '/search') return 'search';
    if (location.pathname === '/following') return 'following';
    if (location.pathname === '/dashboard') return 'dashboard';
    if (location.pathname.includes('/playlist')) return 'playlist';
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
              ? (isAdmin ? <Navigate to="/admin" replace /> : <SearchPage />)
              : <Navigate to="/login" replace />
          } />
          {/* Editable user profile */}
          <Route path="/profile" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <UserPage />)
              : <Navigate to="/login" replace />
          } />
          {/* Legacy path - redirect to editable profile */}
          <Route path="/user" element={
            isLoggedIn 
              ? <Navigate to="/profile" replace />
              : <Navigate to="/login" replace />
          } />
          {/* View-only artist profile by username */}
          <Route path="/profile/:username" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <ProfilePage />)
              : <Navigate to="/login" replace />
          } />
          <Route path="/following" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <FollowingPage />)
              : <Navigate to="/login" replace />
          } />
          <Route path="/dashboard" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <Dashboard />)
              : <Navigate to="/login" replace />
          } />
          <Route path="/playlist/:playlistId" element={
            isLoggedIn 
              ? (isAdmin ? <Navigate to="/admin" replace /> : <PlaylistPage />)
              : <Navigate to="/login" replace />
          } />
          <Route path='/admin' element={
            isLoggedIn 
              ? (isAdmin ? <AdminPage /> : <Navigate to="/home" replace />)
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
      
      {showMusicPlayer && currentSong && (
        <MusicPlayer
          id={currentSong.id || currentSong.SongID}
          duration={currentSong.duration}
          songSrc={currentSong.songFile || currentSong.songSrc}
          songImage={currentSong.image || currentSong.songImage}
          song={currentSong.title || currentSong.name}
          artist={currentSong.artist || currentSong.creator}
          pageName={getMusicPlayerPageName()}
          onClose={handleClosePlayer}
          // Pass context props to music player
          isPlaying={isPlaying}
          isShuffling={isShuffling}
          togglePlayPause={togglePlayPause}
          toggleShuffle={toggleShuffle}
          playPreviousSong={playPreviousSong}
          playNextSong={playNextSong}
          handleSongEnd={handleSongEnd}
          setIsPlaying={setIsPlaying}
          playlistSongs={playlistSongs || []}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <PlayerProvider>
      <Router>
        <AppLayout />
      </Router>
    </PlayerProvider>
  );
}

export default App;