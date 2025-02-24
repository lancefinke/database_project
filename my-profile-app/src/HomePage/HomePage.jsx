import React from "react";
import "./HomePage.css"; // Optional CSS import if you create this file

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Music Library</h1>
      <p>Discover and enjoy your favorite songs.</p>
      
      <div className="featured-section">
        <h2>Featured Playlists</h2>
        <div className="featured-cards">
          <div className="featured-card">
            <div className="card-placeholder"></div>
            <h3>Top Hits</h3>
          </div>
          <div className="featured-card">
            <div className="card-placeholder"></div>
            <h3>New Releases</h3>
          </div>
          <div className="featured-card">
            <div className="card-placeholder"></div>
            <h3>Recommended</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;