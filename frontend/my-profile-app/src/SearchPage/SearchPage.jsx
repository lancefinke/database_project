import React, { useState } from "react";
import "./SearchPage.css"; // Optional CSS import if you create this file






const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  const API_URL = "https://localhost:7152/";
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);

    fetch(API_URL+ "api/Users/GetSearch?search=" + searchQuery,{
      method:"GET",
    })
    .then(res =>res.json())
    .then((result)=>{
      setUsers(result);
      
    })
    .catch(error => console.error("Error fetching data:", error));

  
  };
 //add this later  ../../backend/MusicLibraryBackend/

 
 
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
        <h2 class = "search-results-text">Search Results</h2>
        <p class = "search-results-text">Enter a search term to find music.</p>
        {users.map(user=><h1 style={{color:"black"}}>{user.Username}</h1>)}
      </div>
    </div>  
  );
};

export default SearchPage;