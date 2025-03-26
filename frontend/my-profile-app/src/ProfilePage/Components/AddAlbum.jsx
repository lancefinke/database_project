import { useState } from "react";
import "./../../SignupPage/Signuppage.css";


const AddAlbum = () =>{


    const handleChange = (e)=>{
        setPlaylistName(e.target.value);
    }
    

    return(
        <div className="add-playlist-window" style={{width:'80%',marginLeft:'-40%'}}>
            <div className="form-section">
                <h1>New Album</h1>
                <label className="playlist-label" style={{marginLeft:'0px'}}>ALBUM NAME<input required type='text' className='playlist-text' style={{width:'90%',height:'25px'}} onChange={handleChange}></input></label>
                <button style={{marginTop:"-10px"}}onClick={()=>{}} className="add-playlist-btn">ADD ALBUM</button>
            </div>
        </div>
    );
}

export default AddAlbum;