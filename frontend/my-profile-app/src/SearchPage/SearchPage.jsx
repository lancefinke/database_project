import React, { useState } from "react";
import { Play, Pause } from "lucide-react";
import "./SearchPage.css"; // Optional CSS import if you create this file
import UserLink from "../UserLink/UserLink";


const SearchResult = ({title,author,duration,image,audiofile,rating})=>{


    const [playing,setPlaying] = useState(false);

    const togglePlaying = ()=>{
        setPlaying(!playing);
    }
    return(
        <div className="search-result">
            <div className="result-song">
            <div className="result-info">
                <p className="result-item">Title: {title}</p>
                <p className="result-item"><UserLink text={`Author: ${author}`} userName={author}/></p>
                <p className="result-item">Duration: {duration}</p>
                <p className="result-item">Rating: {rating}</p>
            </div>
            <img src={image} alt="Image wasn't able to load" className="report-img"/>
            <div className="result-icons" onClick={togglePlaying}>
                {playing?<Play size={40}/>:<Pause size={40}/>}
            </div>
        </div>
        <hr className="divider"></hr>
        </div>
    );
}




const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  const API_URL = "https://coogmusic-g2dcaubsabgtfycy.centralus-01.azurewebsites.net/";
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
        {users.map(user=><h1 style={{color:"white"}}>{user.Username}</h1>)}

        <SearchResult title="Song Title"author="Author Name"duration="3:00"image="https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600"rating={2.4}/>
        <SearchResult title="Song Title"author="Author Name"duration="3:00"image="https://www.billboard.com/wp-content/uploads/media/tyler-the-creator-igor-album-art-2019-billboard-embed.jpg?w=600"rating={2.4}/>

      </div>
    </div>
  );
};

export default SearchPage;