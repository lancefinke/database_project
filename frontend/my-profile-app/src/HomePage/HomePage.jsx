import React, { useRef, useEffect, useState } from "react";
import SongIcon from "../ProfilePage/Components/SongIcon";
import "./HomePage.css";

// Sample songs for the home page
/*/const homeSongs = [
  { 
    name: "Lost in the Echo",
    creator: "Linkin Park",
    duration: "3:31",
    flags: ["Rock", "Popular"],
    iconImage: "/images/lost-in-the-echo.jpg",
    songSrc:"./FF Violin II - Clash On The Big Bridge By TAMUSIC.mp3",
  },
  {
    name: "Blinding Lights",
    creator: "The Weeknd",
    duration: "3:20",
    flags: ["Pop", "Hit"],
    iconImage: "/images/blinding-lights.jpg",
    songSrc:"./FF Violin II - Clash On The Big Bridge By TAMUSIC.mp3",
  },
  {
    name: "Bohemian Rhapsody",
    creator: "Queen",
    duration: "5:55",
    flags: ["Rock"],
    iconImage: "/images/bohemian-rhapsody.jpg",
    songSrc:"./FF Violin II - Clash On The Big Bridge By TAMUSIC.mp3",
  },
  {
    name: "Shape of You",
    creator: "Ed Sheeran",
    duration: "3:53",
    flags: ["Pop", "Dance"],
    iconImage: "/images/shape-of-you.jpg",
    songSrc:"./FF Violin II - Clash On The Big Bridge By TAMUSIC.mp3",
  },
  {
    name: "Starboy",
    creator: "The Weeknd",
    duration: "3:50",
    flags: ["Pop", "R&B"],
    iconImage: "/images/starboy.jpg",
    songSrc:"./FF Violin II - Clash On The Big Bridge By TAMUSIC.mp3",
  },
  {
    name: "Uptown Funk",
    creator: "Mark Ronson ft. Bruno Mars",
    duration: "4:30",
    flags: ["Funk", "Dance"],
    iconImage: "/images/uptown-funk.jpg",
    songSrc:"./FF Violin II - Clash On The Big Bridge By TAMUSIC.mp3",
  }
];
/*/

const API_URL = "https://localhost:7152";

const formatDuration = (duration) => {


  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  

  
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const HomePage = () => {
  const carouselRef = useRef(null);
  const itemsRef = useRef([]);
  const [centerIndex, setCenterIndex] = useState(1); // Start with second item centered
  const [playingSongIndex, setPlayingSongIndex] = useState(null); // Track which song is playing
  const [homeSongs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  

  useEffect(() => {
    setLoading(true);
  
    fetch(`${API_URL}/api/database/GetSongsByRating`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch top songs');
        }
        return response.json();
      })
      .then(data => {
        console.log("Raw data from API:", data); // 👈 Log raw response here
  
        const formattedSongs = data.map(song => ({
          name: song.SongName,
          creator: song.Username,
          duration: formatDuration(song.Duration),
          flags: ["Top Rated"],
          iconImage: song.CoverArtFileName,
          songSrc: song.SongFileName,
          songID: song.SongID,
          totalRatings: song.TotalRatings
        }));
  
        console.log("Formatted songs:", formattedSongs); // Optional, to compare
  
        setSongs(formattedSongs);
      })
      .catch(err => {
        console.error("Error fetching top songs:", err);
        setError(err.message);
  
        // Fill with sample fallback data
        setSongs([
          {
            name: "Lost in the Echo",
            creator: "Linkin Park",
            duration: "3:31",
            flags: ["Rock", "Popular"],
            iconImage: "/images/lost-in-the-echo.jpg",
            songSrc: "./FF Violin II - Clash On The Big Bridge By TAMUSIC.mp3",
          }
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  // Handle layout adjustments when component mounts
  useEffect(() => {
    // Add class to body to signal we're on home page
    
    // Only apply style overrides to the app container for the home page
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      appContainer.style.width = '100vw';
      appContainer.style.maxWidth = '100vw';
      appContainer.style.margin = '0';
      appContainer.style.padding = '0';
      appContainer.style.overflow = 'hidden';
      appContainer.style.border = 'none';
    }
    
    // Hide music player specifically
    const musicPlayers = document.querySelectorAll('.music-player, [class*="music-player"], [class*="player-container"]');
    musicPlayers.forEach(player => {
      if (player) {
        player.style.display = 'none';
      }
    });
    
    return () => {
      // Cleanup when component unmounts - important to restore normal styling
      document.body.classList.remove('on-home-page');
      
      if (appContainer) {
        appContainer.style.width = '';
        appContainer.style.maxWidth = '';
        appContainer.style.margin = '';
        appContainer.style.padding = '';
        appContainer.style.overflow = '';
        appContainer.style.border = '';
      }
      
      // Show music player again
      musicPlayers.forEach(player => {
        if (player) {
          player.style.display = '';
        }
      });
    };
  }, []);

  // Set up refs for each carousel item
  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, homeSongs.length);
  }, [homeSongs.length]);

  // Initial scroll positioning to center an item
  useEffect(() => {
    // Wait for the component to render fully
    const timer = setTimeout(() => {
      if (itemsRef.current[1] && carouselRef.current) {
        // Scroll to second item initially without animation
        itemsRef.current[1].scrollIntoView({
          inline: 'center',
          behavior: 'auto'
        });
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll to determine which item is centered
  useEffect(() => {
    const handleScroll = () => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      // Get the center point of the carousel
      const carouselRect = carousel.getBoundingClientRect();
      const carouselCenter = carouselRect.left + carouselRect.width / 2;
      
      // Find which item is closest to the center
      let closestIndex = 0;
      let closestDistance = Number.MAX_VALUE;

      itemsRef.current.forEach((item, index) => {
        if (!item) return;
        
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance = Math.abs(carouselCenter - itemCenter);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      // Update state only if the center item has changed
      if (closestIndex !== centerIndex) {
        setCenterIndex(closestIndex);
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', handleScroll);
      }
    };
  }, [centerIndex]);

  // Function to scroll to a specific item and play it
  const scrollToItem = (index) => {
    // First stop any currently playing song by setting to null
    setPlayingSongIndex(null);
    
    // Update center index immediately
    setCenterIndex(index);
    
    // Scroll to the desired item
    if (itemsRef.current[index]) {
      itemsRef.current[index].scrollIntoView({
        behavior: 'smooth',
        inline: 'center'
      });
      
      // This is critical: After stopping playback, wait before starting the new song
      // This gives the audio element time to fully reset
      setTimeout(() => {
        console.log("Setting playing index to:", index);
        console.log("Song that will play:", homeSongs[index]?.name);
        console.log("Song source:", homeSongs[index]?.songSrc);
        
        setPlayingSongIndex(index);
      }, 500); // Increased timeout to ensure complete reset
    }
  };

  return (
    <div className="home-container">
      <div className="carousel-container">
        <div className="carousel" ref={carouselRef}>
          {homeSongs.map((song, index) => (
            <div 
              className={`carousel-item ${index === centerIndex ? 'center' : ''}`}
              key={index}
              ref={el => itemsRef.current[index] = el}
              onClick={() => scrollToItem(index)}
            >
              <SongIcon
                name={song.name}
                creator={song.creator}
                duration={song.duration}
                flags={song.flags}
                iconImage={song.iconImage || "https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"}
                isHomePage={true}
                isCenter={index === centerIndex}
                shouldPlay={playingSongIndex === index}
                songSrc={song.songSrc}
                AverageRating = {song.totalRatings}
                songID = {song.songID}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="carousel-nav">
        <button 
          onClick={() => scrollToItem(Math.max(centerIndex - 1, 0))}
          disabled={centerIndex === 0}
        >
          &lt;
        </button>
        <button 
          onClick={() => scrollToItem(Math.min(centerIndex + 1, homeSongs.length - 1))}
          disabled={centerIndex === homeSongs.length - 1}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default HomePage;