import React from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
  return (
  
    <div className="profile-container">
      <div className="profile-card">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="profile-image"
        />
        <h1 className="profile-name">Haitham yousif</h1>{/* Profile Name  */}
        <p className="profile-title">He/Him</p> {/*  Optinal Pronouns */}
        <p className="profile-bio">
          Small Creator that focuses on Rnb and Rap style of music. 
        </p>
        <button className="follow-button">Follow</button>
        <div className="music-container">
        <button className="music-genre">Rnb</button>
        <button className="music-genre">Rap</button>
        <button className="music-genre">Country</button>
        <button className="music-genre">HipHop</button>
        <button className="music-genre">Pop</button>
        <button className="music-genre">Rock</button>

        </div>
      </div>
    </div>
    
  );
};

export default ProfilePage;
