import React, { useEffect, useState } from "react";
import ProfilePage from "./ProfilePage/ProfilePage";
import MusicPlayer from "./ProfilePage/Components/MusicPlayer";
import SongIcon from "./ProfilePage/Components/SongIcon";
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
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./ProfilePage/ProfilePage.css";
import "./ProfilePage/Components/SongIcon.css";
import { CirclePlus } from 'lucide-react';

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

  //useStates
  const [showAddSong,setAddVisibility] = useState(false);

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
              <button className="add-btn" onClick={()=>{setAddVisibility(true)}}title="Add new Song" style={{padding:"15px",borderRadius:"50%",backgroundColor:"#8E1616",width:"70px",height:"70px",color:"white",border:"3px solid white",position:"relative",right:"30%",bottom:"1%"}}><CirclePlus /></button>
                {showAddSong &&<div className="add-window" style={{position:"fixed",zIndex:"10",backgroundColor:"#8E1616",height:"450px",width:"600px",borderRadius:'15px',border:"4px solid white"}}>
                  <AddSong />
                  <button className="close-add-song" onClick={()=>{setAddVisibility(false)}} 
                  style={{position:"relative",
                          width:"10%",
                          left:"530px",
                          bottom:"350px",
                          color:"white",
                          backgroundColor:"#101010",
                          borderRadius:"10px",
                          padding:"2px 4px",
                          border: "4px solid white",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"

                  }}>CLOSE</button>
                </div>}
                <div className="dice-five-layout">
                  {sampleSongs.map((song, index) => (
                    <div key={index} className={`song-position-${index + 1}`}>
                      <SongIcon
                        name={song.name}
                        creator={song.creator}
                        duration={song.duration}
                        flags={song.flags}
                        iconImage="https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"
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