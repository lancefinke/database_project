import { useState } from "react";
import "./../../SignupPage/Signuppage.css";

const AddPlaylist = ({isVisible=false}) =>{

    const [privacyStatus,setPrivacyStatus] = useState('public');
    const [playlistName,setPlaylistName] = useState('');

    const changeStatus = (e)=>{
        setPrivacyStatus(e.target.value);
    }
    const handleChange = (e)=>{
        setPlaylistName(e.target.value);
    }
    

    return(
        <div className="add-playlist-window" style={{marginLeft:'-10%'}}>
            <div className="form-section">
                <h1>New Playlist</h1>
                <label className="playlist-label" style={{marginLeft:'0px'}}>PLAYLIST NAME<input required type='text' className='playlist-text' style={{width:'90%',height:'25px'}} onChange={handleChange}></input></label>
                <div className='roles'>
                <label className='artist-btn'>PRIVATE<input type='radio' id='private' name='privacy' value='private' checked={privacyStatus === "private"} onChange={changeStatus}/></label>
                <label className='listener-btn'>PUBLIC<input type='radio' id='public' name='privacy' value='public' checked={privacyStatus === "public"} onChange={changeStatus}/></label>
                </div>
                <button className="add-playlist-btn">ADD PLAYLIST</button>
            </div>
        </div>
    );
}

export default AddPlaylist;