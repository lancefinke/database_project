import React, { useState } from 'react';
import './../ProfilePage.css';
import './UserPage.css';
import MusicPlayer from "./../Components/MusicPlayer";
import SongIcon from "./../Components/SongIcon";
import Editable from './../Components/Editable';
import AddPlaylist from '../Components/AddPlaylist';
import UserLink from '../../UserLink/UserLink';
import { use } from 'react';


const UserPage = ({role}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [availableGenres,setAvailableGenres] = useState(['Rnb','Rap','Country','HipHop','Pop','Rock']);
  const [userGenres,setUserGenres] = useState([]);
  const [showGenreOptions,setGenreOptions] = useState(false);

  const handleGenres = (e)=>{
    if(e.target.value!=='close'&&e.target.value!==''){
      setUserGenres([...userGenres, e.target.value]);
      setAvailableGenres(availableGenres.filter((genre) => genre !== e.target.value));
    }
    setGenreOptions(!showGenreOptions);
  }

  const removeGenre = (e) =>{
    setAvailableGenres([...availableGenres, e.target.value]);
    setUserGenres(userGenres.filter((genre) => genre !== e.target.value));
  }
  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="profile-image"
        />
        <h1 className="profile-name">Haitham yousif</h1>{/* Profile Name  */}
         {/*  Optinal Pronouns */}
        <h3 style={{textAlign:"left",margin:"30px 0px -10px 0px"}}>Profile Description</h3>
        <Editable
            title="Edit Bio"
            value="Small Creator that focuses on Rnb and Rap style of music. "
            div_width="100%"
            div_height="200px"
            backgroundColor="none"
            textColor="white"/>
        
        <div className="stats-container">
          <p className="follower-count">Followers: 10.2K</p>
          <p className="total-listens">Total Listens: 1.5M</p>
        </div>
        
        <div className="music-container">
          <hr style={{backgroundColor:"white", width:"100%"}}></hr>
          {availableGenres.length!==0 &&<button className='add-genre-btn music-genre' onClick={handleGenres}>ADD GENRE</button>}
          {userGenres.length!==0&&<p>Click on Genre Icons to remove them</p>}
          {showGenreOptions && <select onChange={handleGenres} className='genre-drop-down' name='Genres'>
              <option value="">Select Genre</option>
              {availableGenres.map(genre=><option value={genre}>{genre}</option>)}
              <option className="close-option" style={{backgroundColor:"#EF9393",color:"black"}} value="close">Close</option>
          </select>}
          {userGenres.map(genre=><button title='Remove Genre' className="music-genre" value={genre} onClick={removeGenre}>{genre}</button>)}
        </div>
       
        <div className="playlist-container">
          <h1>Playlists</h1>
          <button className="playlist-button">
            <img
              src="https://via.placeholder.com/100"
              alt="Playlist Cover"
              className="playlist-image"
            />
            <span className="playlist-name"><strong>+ Add Playlist</strong></span>
          </button>
          <AddPlaylist/>
          <button className="playlist-button">
            <img
              src="https://via.placeholder.com/100"
              alt="Playlist Cover"
              className="playlist-image"
            />
            <span className="playlist-name">Chill Vibes</span>
          </button>

          <button className="playlist-button">
            <img
              src="https://via.placeholder.com/100"
              alt="Playlist Cover"
              className="playlist-image"
            />
            <span className="playlist-name">Workout Hits</span>
          </button>

          <button className="playlist-button">
            <img
              src="https://via.placeholder.com/100"
              alt="Playlist Cover"
              className="playlist-image"
            />
            <span className="playlist-name">Late Night</span>
          </button>
          <button className="playlist-button">
            <img
              src="https://via.placeholder.com/100"
              alt="Playlist Cover"
              className="playlist-image"
            />
            <span className="playlist-name">Vibe</span>
            
          </button>
          <button className="playlist-button">
            <img
              src="https://via.placeholder.com/100"
              alt="Playlist Cover"
              className="playlist-image"
            />
            <span className="playlist-name">Rap</span>
          </button>
        </div>

        <MusicPlayer song="Why Cant You" artist="Bryant Barnes" />
      </div>
    </div>
  );
};

export default UserPage;