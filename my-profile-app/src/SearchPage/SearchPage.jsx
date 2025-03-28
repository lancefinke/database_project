import React, { useState } from "react";
import { Play, Pause } from "lucide-react";
import "./SearchPage.css"; // Optional CSS import if you create this file
import UserLink from "../UserLink/UserLink";

const SearchResult = ({title, author, duration, image, audiofile, rating}) => {
    const [playing, setPlaying] = useState(false);

    const togglePlaying = (e) => {
        e.stopPropagation(); // Prevent button click from triggering parent click
        setPlaying(!playing);
    }

    const handleResultClick = () => {
        console.log(`Clicked on song: ${title}`);
        // Add your click logic here - navigate to song page, play song, etc.
    }

    return(
        <button className="search-result-button" onClick={handleResultClick}>
            <div className="search-result">
                <div className="result-image-container">
                    <img src={image} alt="Album cover" className="result-img"/>
                </div>
                <div className="result-content">
                    <div className="result-info">
                        <p className="result-title">{title}</p>
                        <p className="result-author"><UserLink text={author} userName={author}/></p>
                        <div className="result-details">
                            <span className="result-duration">{duration}</span>
                            <span className="result-rating">★{rating}</span>
                        </div>
                    </div>
                    <div className="result-controls" onClick={togglePlaying}>
                        {playing ? <Pause size={32}/> : <Play size={32}/>}
                    </div>
                </div>
            </div>
        </button>
    );
}

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  const API_URL = "https://coogmusic-g2dcaubsabgtfycy.centralus-01.azurewebsites.net/";
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);

    fetch(API_URL+ "api/Users/GetSearch?search=" + searchQuery, {
      method: "GET",
    })
    .then(res => res.json())
    .then((result) => {
      setUsers(result);
    })
    .catch(error => console.error("Error fetching data:", error));
  };

  // Sample data for demonstration
  const sampleSearchResults = [
    { id: 1, title: "Song Title 1", author: "Artist 1", duration: "3:00", rating: 4.5, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
    { id: 2, title: "Song Title 2", author: "Artist 2", duration: "4:12", rating: 3.8, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
    { id: 3, title: "Song Title 3", author: "Artist 3", duration: "2:45", rating: 4.2, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
    { id: 4, title: "Song Title 4", author: "Artist 4", duration: "3:33", rating: 5.0, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
    { id: 5, title: "Song Title 5", author: "Artist 5", duration: "3:22", rating: 3.5, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
    { id: 6, title: "Song Title 6", author: "Artist 6", duration: "4:01", rating: 4.1, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
    { id: 7, title: "Song Title 7", author: "Artist 7", duration: "3:15", rating: 3.9, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
    { id: 8, title: "Song Title 8", author: "Artist 8", duration: "2:57", rating: 4.7, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" }
  ];

  return (
    <div className="search-container">
      <div className="search-bar-wrapper">
        <div className="search-icon"><span className="icon-align">🔎︎</span></div>
        <input 
          className="search-bar" 
          type="search" 
          value={searchQuery} 
          placeholder="Search for Artist, song, or Album" 
          onChange={(e) => {setSearchQuery(e.target.value)}}>
        </input>
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>
      
      <div className="search-results">
        {users.length > 0 ? (
          users.map(user => <h1 key={user.Username} style={{color:"white"}}>{user.Username}</h1>)
        ) : (
          // Display sample results when no users are returned from API
          sampleSearchResults.map(result => (
            <SearchResult 
              key={result.id}
              title={result.title}
              author={result.author}
              duration={result.duration}
              image={result.image}
              rating={result.rating}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchPage;