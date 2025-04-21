import React, { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css";
import UserLink from "../UserLink/UserLink";
import SearchGenreSongList from './SearchGenreSongList';
import PlaylistSongList from '../ProfilePage/Components/PlaylistSongList';
import SearchPlaylistView from './Components/SearchPlaylistView';

// Map genre names to their respective codes for API calls
const genreNameToCode = {
  Pop: 1,
  Rock: 2,
  "Hip-Hop": 3,
  "R&B": 4,
  Electronic: 5,
  Country: 6,
  Jazz: 7,
  Blues: 8,
  Metal: 9,
  Classical: 10,
  Alternative: 11,
  Indie: 12,
};

const SearchResult = ({title, author, image, onPlaylistSelect, playlistId}) => {
  const navigate = useNavigate();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlaylistClick = async () => {
    console.log(`Clicked on playlist: ${title}`);
    if (title === "") {
      const token = localStorage.getItem('userToken');
    } else {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5142/api/database/GetPlaylistSongs?playlistId=${playlistId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch playlist songs');
        }
        const songs = await response.json();
        
        // Format the playlist data
        const formattedPlaylist = {
          id: playlistId,
          name: title,
          description: author,
          image: image,
          songs: songs.map(song => ({
            id: song.SongID,
            title: song.SongName,
            artist: song.Username,
            duration: song.Duration,
            image: song.CoverArtFileName || "https://via.placeholder.com/100",
            songFile: song.SongFileName
          }))
        };
        
        setSelectedPlaylist(formattedPlaylist);
      } catch (err) {
        console.error("Error fetching playlist:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setSelectedPlaylist(null);
  };

  if (loading) {
    return <div className="playlist-loading">Loading playlist...</div>;
  }

  if (error) {
    return (
      <div className="playlist-error">
        <p>Error: {error}</p>
        <button onClick={handleBack} className="retry-button">Go Back</button>
      </div>
    );
  }

  if (selectedPlaylist) {
    return (
      <SearchPlaylistView
        songs={selectedPlaylist.songs}
        playlistName={selectedPlaylist.name}
        playlistImage={selectedPlaylist.image}
        onBack={handleBack}
        onSongSelect={onPlaylistSelect}
      />
    );
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
            <p className="result-author">{author}</p>
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
  const [currentUsername, setCurrentUsername] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loadingGenreSongs, setLoadingGenreSongs] = useState(false);
  const navigate = useNavigate();

  const API_URL = "http://localhost:5142/";
  const SEARCH_API_URL = "http://localhost:5142/";
  
  // Get current user's username and fetch their playlists
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        if (username) {
          setCurrentUsername(username);
          // Fetch user's playlists
          fetch(`${API_URL}api/database/GetUserPlaylists?userId=${userId}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log("Fetched playlists:", data);
              setPlaylists(data);
            })
            .catch(error => {
              console.error("Error fetching playlists:", error);
              setPlaylists([]);
            });
        }
      } catch (error) {
        console.error("Error parsing JWT token:", error);
      }
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);

    if (!searchQuery.trim()) {
      // Clear search results if query is empty
      setShowSearchResults(false);
      return;
    }

    setShowSearchResults(true);

    fetch(`${SEARCH_API_URL}api/database/SearchSongs?SearchQuery=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((result) => {
        const formattedResults = result.map((song) => ({
          id: song.SongID,
          title: song.SongName,
          artist: song.ArtistName,
          duration: song.Duration,
          image: song.CoverArtFileName || "https://via.placeholder.com/40",
          album: song.AlbumTitle || "Unknown Album",
          genre: song.GenreCode,
          songSrc: song.SongFileName,
        }));
        setSearchResults(formattedResults);
      })
      .catch((error) => {
        console.error("Error fetching search data:", error);
        setSearchResults([]);
      });

    // Also search for users
    fetch(API_URL + "api/Users/GetSearch?search=" + searchQuery, {
      method: "GET",
    })
    .then(res => res.json())
    .then((result) => {
      setUsers(result);
    })
    .catch(error => console.error("Error fetching user data:", error));
  };

  // Clear search results and return to main view
  const handleBackFromSearch = () => {
    setShowSearchResults(false);
  };

  // Handle genre button clicks
  const handleGenreClick = async (genre) => {
    setActiveGenre(genre);
    setShowGenreSongs(true);
    setLoadingGenreSongs(true);

    const genreCode = genreNameToCode[genre];
    if (!genreCode) return;

    try {
      const response = await fetch(`${SEARCH_API_URL}api/database/GetSongsByGenre?GenreCode=${genreCode}`);
      const data = await response.json();

      const formatted = data.map((song) => ({
        id: song.SongID,
        title: song.SongName,
        artist: song.ArtistName,
        duration: song.Duration,
        image: song.CoverArtFileName || "https://via.placeholder.com/40",
        album: song.AlbumTitle || "Unknown Album",
        genre: song.GenreCode,
        songSrc: song.SongFileName,
      }));
      setGenreSongs(formatted);
    } catch (err) {
      console.error("Failed to fetch genre songs:", err);
      setGenreSongs([]);
    } finally {
      setLoadingGenreSongs(false);
    }
  };

  const handlePlaylistSelect = async (playlist) => {
    try {
      const response = await fetch(`${API_URL}/api/database/GetPlaylistSongs?playlistId=${playlist.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch playlist songs');
      }
      const data = await response.json();
      setSelectedPlaylist({
        ...playlist,
        songs: data
      });
    } catch (error) {
      console.error('Error fetching playlist songs:', error);
    }
  };

  const handleBackFromPlaylist = () => {
    setSelectedPlaylist(null);
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
        // Search results view
        <div className="searchpage-container">
          <SearchGenreSongList 
            songs={searchResults}
            playlistName={`Search Results for "${searchQuery}"`}
            onBackClick={handleBackFromSearch}
            onSongSelect={onSongSelect}
          />
        </div>
      ) : showGenreSongs ? (
        // Genre songs list view
        <div className="searchpage-container">
          {loadingGenreSongs ? (
            <p style={{ color: 'white' }}>Loading songs...</p>
          ) : (
            <SearchGenreSongList 
              songs={genreSongs}
              playlistName={activeGenre}
              onBackClick={() => {
                setShowGenreSongs(false);
                setActiveGenre(null);
              }}
              onSongSelect={onSongSelect}
            />
          )}
        </div>
      ) : (
        <>
          <div className="section-container">
            <h2 className="search-results-title">Featured Playlists</h2>
            <div className="search-results">
              {playlists.length > 0 ? (
                playlists.map(playlist => (
                  <SearchResult 
                    key={playlist.PlaylistID}
                    title={playlist.Title}
                    author={playlist.PlaylistDescription}
                    image={playlist.PlaylistPicture}
                    playlistId={playlist.PlaylistID}
                    onPlaylistSelect={onSongSelect}
                  />
                ))
              ) : (
                <p className="no-results">No playlists available</p>
              )}
            </div>
          </div>
          
          <div className="section-container">
            <h2 className="search-genres-title">Browse All Genres</h2>
            <div className="search-genres-list">
              {Object.keys(genreNameToCode).map(genre => (
                <button 
                  key={genre}
                  className={`genre-button ${activeGenre === genre ? 'active' : ''}`}
                  onClick={() => handleGenreClick(genre)}
                >
                  <span>{genre}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;