import React, { useRef, useEffect, useState } from "react";
import SongIcon from "../ProfilePage/Components/SongIcon";
import "./HomePage.css";

// Sample songs for the home page
const homeSongs = [
  {
    name: "Lost in the Echo",
    creator: "Linkin Park",
    duration: "3:31",
    flags: ["Rock", "Popular"],
    iconImage: "/images/lost-in-the-echo.jpg",
  },
  {
    name: "Blinding Lights",
    creator: "The Weeknd",
    duration: "3:20",
    flags: ["Pop", "Hit"],
    iconImage: "/images/blinding-lights.jpg",
  },
  {
    name: "Bohemian Rhapsody",
    creator: "Queen",
    duration: "5:55",
    flags: ["Rock"],
    iconImage: "/images/bohemian-rhapsody.jpg",
  },
  {
    name: "Shape of You",
    creator: "Ed Sheeran",
    duration: "3:53",
    flags: ["Pop", "Dance"],
    iconImage: "/images/shape-of-you.jpg",
  },
  {
    name: "Starboy",
    creator: "The Weeknd",
    duration: "3:50",
    flags: ["Pop", "R&B"],
    iconImage: "/images/starboy.jpg",
  },
  {
    name: "Uptown Funk",
    creator: "Mark Ronson ft. Bruno Mars",
    duration: "4:30",
    flags: ["Funk", "Dance"],
    iconImage: "/images/uptown-funk.jpg",
  }
];

const HomePage = () => {
  const carouselRef = useRef(null);
  const itemsRef = useRef([]);
  const [centerIndex, setCenterIndex] = useState(1); // Start with second item centered

  // Handle layout adjustments when component mounts
  useEffect(() => {
    // Add class to body to signal we're on home page
    document.body.classList.add('on-home-page');
    
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

  // Function to scroll to a specific item
  const scrollToItem = (index) => {
    if (itemsRef.current[index]) {
      itemsRef.current[index].scrollIntoView({
        behavior: 'smooth',
        inline: 'center'
      });
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
                iconImage={song.iconImage}
                isHomePage={true}
                isCenter={index === centerIndex}
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