import React, { useState } from "react";
import "./SearchPage.css"; // Optional CSS import if you create this file

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="search-container">
      <h1>Search Music</h1>
      <p>Find your favorite songs and artists.</p>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <input 
            type="text" 
            placeholder="Search for songs, artists, albums..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">Search</button>
        </div>
      </form>
      
      <div className="search-results">
        <h2>Search Results</h2>
        <p>Enter a search term to find music.</p>
      </div>
    </div>
  );
};

export default SearchPage;