// --- HomePage.jsx ---
import React, { useRef, useEffect, useState } from "react";
import SongIcon from "../ProfilePage/Components/SongIcon";
import { useUserContext } from "../LoginContext/UserContext";
import "./HomePage.css";

const API_URL = "http://localhost:5142";

const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const HomePage = () => {
  const carouselRef = useRef(null);
  const itemsRef = useRef([]);
  const [centerIndex, setCenterIndex] = useState(1);
  const [playingSongIndex, setPlayingSongIndex] = useState(null);
  const [homeSongs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useUserContext();
  const userId = user?.UserID;

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/database/GetSongsByRating`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch top songs');
        return response.json();
      })
      .then(data => {
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
        setSongs(formattedSongs);
      })
      .catch(err => {
        setError(err.message);
        setSongs([{
          name: "Lost in the Echo",
          creator: "Linkin Park",
          duration: "3:31",
          flags: ["Rock", "Popular"],
          iconImage: "/images/lost-in-the-echo.jpg",
          songSrc: "./FF Violin II - Clash On The Big Bridge By TAMUSIC.mp3",
        }]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (itemsRef.current[1] && carouselRef.current) {
        itemsRef.current[1].scrollIntoView({ inline: 'center', behavior: 'auto' });
        setTimeout(() => {
          setPlayingSongIndex(1);
        }, 800);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const carousel = carouselRef.current;
      if (!carousel) return;
      const carouselRect = carousel.getBoundingClientRect();
      const carouselCenter = carouselRect.left + carouselRect.width / 2;
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

      if (closestIndex !== centerIndex) {
        setCenterIndex(closestIndex);
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => carousel?.removeEventListener('scroll', handleScroll);
  }, [centerIndex]);

  const scrollToItem = (index) => {
    setPlayingSongIndex(null);
    setCenterIndex(index);
    if (itemsRef.current[index]) {
      itemsRef.current[index].scrollIntoView({ behavior: 'smooth', inline: 'center' });
      setTimeout(() => setPlayingSongIndex(index), 700);
    }
  };

  const handlePlayToggle = (index) => {
    setPlayingSongIndex(prev => prev === index ? null : index);
  };

  const handleRateSong = async (songID, rating) => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_URL}/api/Ratings/PostRating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId: songID, userId, rating })
      });
      const data = await response.json();
      setSongs(prev => prev.map(song => song.songID === songID ? { ...song, totalRatings: data.AverageRating } : song));
    } catch (err) {
      console.error("Rating error:", err);
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
  {...song}
  isHomePage={true}
  isCenter={index === centerIndex}
  shouldPlay={playingSongIndex === index}
  onPlayStatusChange={(isPlaying) => {
    if (isPlaying) {
      setPlayingSongIndex(index);
    } else {
      setPlayingSongIndex(null);
    }
  }}
  onRate={handleRateSong}
/>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-nav">
        <button onClick={() => scrollToItem(Math.max(centerIndex - 1, 0))} disabled={centerIndex === 0}>&lt;</button>
        <button onClick={() => scrollToItem(Math.min(centerIndex + 1, homeSongs.length - 1))} disabled={centerIndex === homeSongs.length - 1}>&gt;</button>
      </div>
    </div>
  );
};

export default HomePage;
