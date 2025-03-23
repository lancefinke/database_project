import React, { useState } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
    const [isFollowing, setIsFollowing] = useState(false);
    
    return (
        <div className="profile-container">
            <div className="profile-card">
                <img
                    src="https://via.placeholder.com/150"
                    alt="Profile"
                    className="profile-image"
                />
                <h1 className="profile-name">Haitham yousif</h1>
                <p className="profile-bio">
                    Small Creator that focuses on Rnb and Rap style of music.
                </p>
                <div className="stats-container">
                    <p className="follower-count">Followers: 10.2K</p>
                    <p className="total-listens">Total Listens: 1.5M</p>
                </div>
                <button 
                    className="follow-button"
                    onClick={() => setIsFollowing(!isFollowing)}
                >
                    {isFollowing ? 'Following' : 'Follow'}
                </button>
                <div className="music-container">
                    <button className="music-genre">Rnb</button>
                    <button className="music-genre">Rap</button>
                    <button className="music-genre">Country</button>
                    <button className="music-genre">HipHop</button>
                    <button className="music-genre">Pop</button>
                    <button className="music-genre">Rock</button>
                </div>
                <div className="playlist-container">
                    <button className="playlist-button">
                        <img
                            src="https://via.placeholder.com/100"
                            alt="Playlist Cover"
                            className="playlist-image"
                        />
                        <span className="playlist-name">Chill Vibes</span>
                    </button>
                    <button className="playlist-button">
                        <img
                            src="https://via.placeholder.com/100"
                            alt="Playlist Cover"
                            className="playlist-image"
                        />
                        <span className="playlist-name">Workout Hits</span>
                    </button>
                    <button className="playlist-button">
                        <img
                            src="https://via.placeholder.com/100"
                            alt="Playlist Cover"
                            className="playlist-image"
                        />
                        <span className="playlist-name">Late Night</span>
                    </button>
                    <button className="playlist-button">
                        <img
                            src="https://via.placeholder.com/100"
                            alt="Playlist Cover"
                            className="playlist-image"
                        />
                        <span className="playlist-name">Vibe</span>
                    </button>
                    <button className="playlist-button">
                        <img
                            src="https://via.placeholder.com/100"
                            alt="Playlist Cover"
                            className="playlist-image"
                        />
                        <span className="playlist-name">Rap</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;