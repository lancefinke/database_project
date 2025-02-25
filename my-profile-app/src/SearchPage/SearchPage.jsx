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
      <div className="search-bar-wrapper">
            <div className="search-icon"><span className="icon-align">🔎︎</span></div>
            <input className="search-bar" type="search" value={searchText} placeholder="Enter a Song name or Artist..." onChange={(e)=>{setSearchText(e.target.value)}}></input>
        </div>
      
      <div className="search-results">
        <h2>Search Results</h2>
        <p>Enter a search term to find music.</p>
      </div>
    </div>
  );
};

export default SearchPage;