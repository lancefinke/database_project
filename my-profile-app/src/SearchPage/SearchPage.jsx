import React, { useState } from "react";
import { Play, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css";
import UserLink from "../UserLink/UserLink";
import SearchGenreSongList from './SearchGenreSongList';

const SearchResult = ({title, author, image, onPlaylistSelect}) => {
  const handlePlaylistClick = () => {
    console.log(`Clicked on playlist: ${title}`);
    if (onPlaylistSelect) {
      onPlaylistSelect({
        name: title,
        creator: author
      });
    }
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
            {author && <p className="result-author"><UserLink text={author} userName={author}/></p>}
          </div>
        </div>
      </div>
    </button>
  );
}

const SearchPage = ({ onSongSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [showGenreSongs, setShowGenreSongs] = useState(false);
  const [genreSongs, setGenreSongs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  const API_URL = "https://coogmusic-g2dcaubsabgtfycy.centralus-01.azurewebsites.net/";
  
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);

    if (!searchQuery.trim()) {
      // Clear search results if query is empty
      setShowSearchResults(false);
      return;
    }

    // In a real app, you would fetch from API
    // For now, we'll use sample data
    const sampleSongResults = [
      { 
        id: 101, 
        title: searchQuery + " - Hit Song", 
        artist: "Top Artist", 
        genre: "Pop", 
        duration: 180, 
        image: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        album: "Best Album"
      },
      { 
        id: 102, 
        title: "The " + searchQuery + " Experience", 
        artist: "Famous Band", 
        genre: "Rock", 
        duration: 240, 
        image: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        album: "Greatest Hits"
      },
      { 
        id: 103, 
        title: "Finding " + searchQuery, 
        artist: "New Artist", 
        genre: "Hip-Hop", 
        duration: 195, 
        image: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        album: "Fresh Beats"
      },
      { 
        id: 104, 
        title: searchQuery + " Dreams", 
        artist: "Dream Team", 
        genre: "R&B", 
        duration: 210, 
        image: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        album: "Smooth Collection"
      },
      { 
        id: 105, 
        title: "Late Night " + searchQuery, 
        artist: "Night Owl", 
        genre: "Jazz", 
        duration: 300, 
        image: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        album: "Midnight Sessions"
      }
    ];

    // Set search results and show them
    setSearchResults(sampleSongResults);
    setShowSearchResults(true);

    // Attempt API call as well
    fetch(API_URL + "api/Users/GetSearch?search=" + searchQuery, {
      method: "GET",
    })
    .then(res => res.json())
    .then((result) => {
      setUsers(result);
      // If we had a real API for songs, we would set the search results here
    })
    .catch(error => console.error("Error fetching data:", error));
  };

  // Clear search results and return to main view
  const handleBackFromSearch = () => {
    setShowSearchResults(false);
  };

  // Sample genre songs data - in a real app, you'd fetch this from an API
  const genreSongsData = {
    'pop': [
      { id: 1, title: "Pop Hit 1", artist: "Pop Artist 1", duration: "3:15", rating: 4.7, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600", album: "Pop Classics Vol. 1" },
      { id: 2, title: "Pop Hit 2", artist: "Pop Artist 2", duration: "2:58", rating: 4.3, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600", album: "Summer Vibes" },
      { id: 3, title: "Pop Hit 3", artist: "Pop Artist 3", duration: "3:42", rating: 4.1, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600", album: "Greatest Hits" },
    ],
    'rock': [
      { id: 1, title: "Rock Anthem 1", artist: "Rock Band 1", duration: "4:30", rating: 4.8, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600", album: "Rock Revival" },
      { id: 2, title: "Rock Anthem 2", artist: "Rock Band 2", duration: "5:12", rating: 4.6, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600", album: "Garage Sessions" },
    ],
    'hip-hop': [
      { id: 1, title: "Hip Hop Track 1", artist: "Rapper 1", duration: "3:45", rating: 4.9, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600", album: "Street Chronicles" },
      { id: 2, title: "Hip Hop Track 2", artist: "Rapper 2", duration: "3:22", rating: 4.5, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600", album: "Beats & Rhymes" },
      { id: 3, title: "Hip Hop Track 3", artist: "Rapper 3", duration: "3:50", rating: 4.7, image: "https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600", album: "Platinum Hits" },
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
  };

  // Sample data for search results
  const samplePlaylistResults = [
    { 
      id: 1, 
      title: "Chill Vibes", 
      author: "Various Artists",
      duration: "5:20",
      image: "https://i.scdn.co/image/ab67706f0000000291f511334d761a18891e3d5f" 
    },
    { 
      id: 2, 
      title: "Workout Hits", 
      author: "DJ Fitness",
      duration: "4:15",
      image: "https://i.scdn.co/image/ab67706f00000002b60db5d0cd3b85d9d67f7a95" 
    },
    { 
      id: 3, 
      title: "Late Night Drive", 
      author: "Night Owl",
      duration: "3:45",
      image: "https://i.scdn.co/image/ab67706f000000025ea54b91b073c2776b966e7b" 
    },
    { 
      id: 4, 
      title: "Study Focus", 
      author: "Study Beats",
      duration: "6:30",
      image: "https://i.scdn.co/image/ab67706f00000002724554ed6bed6f051d9b0bfc" 
    }
  ];

  // Helper function to convert time string to seconds
  const convertTimeToSeconds = (timeString) => {
    const parts = timeString.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  };

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
  onChange={(e) => {setSearchQuery(e.target.value)}}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  }}
/>
          <button className="search-button" onClick={handleSearch}>Search</button>
        </div>
      </div>
      
      {showSearchResults ? (
        // SHOW SEARCH RESULTS VIEW
        <div className="searchpage-container">
          <SearchGenreSongList 
            songs={searchResults}
            playlistName={`Search Results for "${searchQuery}"`}
            onBackClick={handleBackFromSearch}
            onSongSelect={onSongSelect}
          />
        </div>
      ) : showGenreSongs ? (
        // SHOW GENRE SONGS LIST VIEW
        <div className="searchpage-container">
          <SearchGenreSongList 
            songs={genreSongs.map(song => ({
              id: song.id,
              title: song.title,
              artist: song.author,
              duration: convertTimeToSeconds(song.duration),
              image: song.image,
              album: song.album,
              genre: song.genre || "Unknown"
            }))}
            playlistName={activeGenre}
            onBackClick={() => {
              setShowGenreSongs(false);
              setActiveGenre(null);
            }}
            onSongSelect={onSongSelect}
          />
        </div>
      ) : (
        // SHOW NORMAL SEARCH RESULTS AND GENRE GRID
        <>
          <div className="searchpage-container">
            <h2 className="search-results-title">Featured Playlists</h2>
            <div className="search-results">
              {users.length > 0 ? (
                users.map(user => <h1 key={user.Username} style={{color:"white"}}>{user.Username}</h1>)
              ) : (
                // Display sample results when no users are returned from API
                samplePlaylistResults.map(result => (
                  <SearchResult 
                    key={result.id}
                    title={result.title}
                    author={result.author}
                    duration={result.duration}
                    image={result.image}
                    rating={result.rating}
                    onSongSelect={onSongSelect}
                  />
                ))
              )}
            </div>
          </div>
          
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
              <button 
                className={`genre-button ${activeGenre === 'Electronic' ? 'active' : ''}`}
                onClick={() => handleGenreClick('Electronic')}
              >
                <span>Electronic</span>
              </button>
              <button 
                className={`genre-button ${activeGenre === 'Blues' ? 'active' : ''}`}
                onClick={() => handleGenreClick('Blues')}
              >
                <span>Blues</span>
              </button>
              <button 
                className={`genre-button ${activeGenre === 'Alternative' ? 'active' : ''}`}
                onClick={() => handleGenreClick('Alternative')}
              >
                <span>Alternative</span>
              </button>
              <button 
                className={`genre-button ${activeGenre === 'Indie' ? 'active' : ''}`}
                onClick={() => handleGenreClick('Indie')}
              >
                <span>Indie</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;