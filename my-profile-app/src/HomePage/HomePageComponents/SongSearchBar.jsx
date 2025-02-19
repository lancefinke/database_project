import { useState } from "react";

const SongSearchBar = () =>{

    const [searchText,setSearchText] = useState("");

    const handleSubmit = (e)=>{
        e.preventDefault();
        //implement this later
    }

    return(
        <div className="search-bar-wrapper">
            <div className="search-icon"><span className="icon-align">🔎︎</span></div>
            <input className="search-bar" type="search" value={searchText} placeholder="Enter a Song name or Artist..." onChange={(e)=>{setSearchText(e.target.value)}}></input>
        </div>
    )
}

export default SongSearchBar;