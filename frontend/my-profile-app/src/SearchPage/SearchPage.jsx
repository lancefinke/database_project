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


      <div className="search-bar-wrapper">
            <div className="search-icon"><span className="icon-align">🔎︎</span></div>
            <input className="search-bar" 
                    type="search" value={searchQuery} 
                    placeholder="Search for Artist, song, or Album" 
                    onChange={(e)=>{setSearchQuery(e.target.value)}}>
            </input>

            <button className="search-button" onClick={handleSearch}>Search</button>
        </div>

  
      
      <div className="search-results">
        <h2>Search Results</h2>
        <p>Enter a search term to find music.</p>
      </div>
    </div>
  );
};

export default SearchPage;