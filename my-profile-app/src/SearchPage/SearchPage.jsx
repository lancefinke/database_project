import React, { useState } from "react";
import { Play, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css";
import UserLink from "../UserLink/UserLink";

const SearchResult = ({title, author, duration, image, rating, showPlayButton = false}) => {
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
                      {author && <p className="result-author"><UserLink text={author} userName={author}/></p>}
                      {duration && (
                          <div className="result-details">
                              <span className="result-duration">{duration}</span>
                              
                          </div>
                      )}
                  </div>
                  {showPlayButton && (
                      <div className="result-controls" onClick={togglePlaying}>
                          {playing ? <Pause size={32}/> : <Play size={32}/>}
                      </div>
                  )}
              </div>
          </div>
      </button>
  );
}

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [showGenreSongs, setShowGenreSongs] = useState(false);
  const [genreSongs, setGenreSongs] = useState([]);
  const navigate = useNavigate();

  const API_URL = "https://coogmusic-g2dcaubsabgtfycy.centralus-01.azurewebsites.net/";
  
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);

    fetch(API_URL + "api/Users/GetSearch?search=" + searchQuery, {
      method: "GET",
    })
    .then(res => res.json())
    .then((result) => {
      setUsers(result);
    })
    .catch(error => console.error("Error fetching data:", error));
  };

  // Sample genre songs data - in a real app, you'd fetch this from an API
  const genreSongsData = {
    'Pop': [
      { id: 1, title: "Pop Hit 1", author: "Pop Artist 1", duration: "3:15", rating: 4.7, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
      { id: 2, title: "Pop Hit 2", author: "Pop Artist 2", duration: "2:58", rating: 4.3, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
      { id: 3, title: "Pop Hit 3", author: "Pop Artist 3", duration: "3:42", rating: 4.1, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
    ],
    'rock': [
      { id: 1, title: "Rock Anthem 1", author: "Rock Band 1", duration: "4:30", rating: 4.8, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
      { id: 2, title: "Rock Anthem 2", author: "Rock Band 2", duration: "5:12", rating: 4.6, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
    ],
    'hip-hop': [
      { id: 1, title: "Hip Hop Track 1", author: "Rapper 1", duration: "3:45", rating: 4.9, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
      { id: 2, title: "Hip Hop Track 2", author: "Rapper 2", duration: "3:22", rating: 4.5, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
      { id: 3, title: "Hip Hop Track 3", author: "Rapper 3", duration: "3:50", rating: 4.7, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600" },
    ],
    // Add more genres as needed
  };

  // Handle genre button clicks
  const handleGenreClick = (genre) => {
    // Set active genre
    setActiveGenre(genre);
    
    // Convert genre name to lowercase for use as a key
    const genreKey = genre.toLowerCase().replace(/\s+/g, '-');
    
    // Get songs for this genre - in a real app you'd fetch from an API
    const songs = genreSongsData[genreKey] || [];
    setGenreSongs(songs);
    setShowGenreSongs(true);
    
    console.log(`Showing songs for genre: ${genre}`);
    
    // You could also use navigation if you prefer:
    // navigate(`/genre/${genreKey}`);
  };

  // Sample data for search results
  const sampleSearchResults = [
    { 
      id: 1, 
      title: "Chill Vibes", 
      image: "https://i.scdn.co/image/ab67706f0000000291f511334d761a18891e3d5f" 
    },
    { 
      id: 2, 
      title: "Workout Hits", 
      image: "https://i.scdn.co/image/ab67706f00000002b60db5d0cd3b85d9d67f7a95" 
    },
    { 
      id: 3, 
      title: "Late Night Drive", 
      image: "https://i.scdn.co/image/ab67706f000000025ea54b91b073c2776b966e7b" 
    },
    { 
      id: 4, 
      title: "Study Focus", 
      image: "https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc" 
    }
  ];

  const PlaylistResult = ({title, image}) => {
    const handlePlaylistClick = () => {
        console.log(`Clicked on playlist: ${title}`);
        // Add your click logic here - navigate to playlist page
    }

    return(
        <button className="search-result-button" onClick={handlePlaylistClick}>
            <div className="search-result playlist-result">
                <div className="result-image-container">
                    <img src={image} alt="Playlist cover" className="result-img"/>
                </div>
                <div className="result-content">
                    <div className="result-info">
                        <p className="result-title">{title}</p>
                    </div>
                </div>
            </div>
        </button>
    );
}
{!showGenreSongs && (
  <div className="searchpage-container">
    <div className="search-results">
      {users.length > 0 ? (
        users.map(user => <h1 key={user.Username} style={{color:"white"}}>{user.Username}</h1>)
      ) : (
        // Display sample playlist results
        sampleSearchResults.map(result => (
          <PlaylistResult 
            key={result.id}
            title={result.title}
            image={result.image}
          />
        ))
      )}
    </div>
  </div>
)}
  return (
    <div className="search-page">
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
      </div>
      
      {/* Display search results */}
      {!showGenreSongs && (
        <div className="searchpage-container">
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
      )}
      
      {/* Display genre songs when a genre is selected */}
      {showGenreSongs && (
        <div className="searchpage-container">
          <h2 className="search-genres-title">{activeGenre} Songs</h2>
          <button 
            className="back-button" 
            onClick={() => {
              setShowGenreSongs(false);
              setActiveGenre(null);
            }}
            style={{
              marginBottom: "20px", 
              padding: "8px 16px", 
              background: "#343434",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            ← Back to Genres
          </button>
          <div className="search-results">
            {genreSongs.map(song => (
              <SearchResult 
                key={song.id}
                title={song.title}
                author={song.author}
                duration={song.duration}
                image={song.image}
                rating={song.rating}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Display genre list when not showing genre songs */}
      {!showGenreSongs && (
        <div className="search-genres-container">
          <h2 className="search-genres-title">Browse All Genres</h2>
          <div className="search-genres-list">
            <button 
              className={`genre-button ${activeGenre === 'Pop' ? 'active' : ''}`}
              onClick={() => handleGenreClick('Pop')}
            >
              <span>Pop</span>
            </button>
            <button 
              className={`genre-button ${activeGenre === 'Rock' ? 'active' : ''}`}
              onClick={() => handleGenreClick('Rock')}
            >
              <span>Rock</span>
            </button>
            <button 
              className={`genre-button ${activeGenre === 'Hip-Hop' ? 'active' : ''}`}
              onClick={() => handleGenreClick('Hip-Hop')}
            >
              <span>Hip-Hop</span>
            </button>
            <button 
              className={`genre-button ${activeGenre === 'Jazz' ? 'active' : ''}`}
              onClick={() => handleGenreClick('Jazz')}
            >
              <span>Jazz</span>
            </button>
            <button 
              className={`genre-button ${activeGenre === 'Classical' ? 'active' : ''}`}
              onClick={() => handleGenreClick('Classical')}
            >
              <span>Classical</span>
            </button>
            <button 
              className={`genre-button ${activeGenre === 'Country' ? 'active' : ''}`}
              onClick={() => handleGenreClick('Country')}
            >
              <span>Country</span>
            </button>
            <button 
              className={`genre-button ${activeGenre === 'Metal' ? 'active' : ''}`}
              onClick={() => handleGenreClick('Metal')}
            >
              <span>Metal</span>
            </button>
            <button 
              className={`genre-button ${activeGenre === 'R&B' ? 'active' : ''}`}
              onClick={() => handleGenreClick('R&B')}
            >
              <span>R&B</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;