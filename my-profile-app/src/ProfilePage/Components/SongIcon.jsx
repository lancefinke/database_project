import { useState } from 'react';
import { Play,Plus,Forward, Pause} from "lucide-react";
import './SongIcon.css';
const SongPost = ({name,creator,duration,flags,iconImage}) =>{

    const [isPlaying,togglePlaying] = useState(false);

    const handlePlaying = ()=>{
        togglePlaying(!isPlaying)
    }

    return(
        <div className="song-post-wrapper">
            <div className='info'>
                <h3 className='info-item'>{name}</h3>
                <h4 className='info-item'>By: {creator}</h4>
                <h5 className='info-item'>{duration}</h5>
                <div className='flags info-item'>
                  {flags.map((flagName)=><div className='flag'>{flagName}</div>)}  
                </div>
            </div>
            <div className='interactables'>
                <div className='play-btn' onClick={handlePlaying}>{isPlaying ? <Play size={60}color='white'/>: <Pause strokeWidth={1} size={60}color='white'/>}</div>
                <div className='other-btns'><span title="Add to Playlist"><Plus color='white'/></span>
                <span title='Share with a Friend'><Forward color='white'/></span></div>
            </div>
            <img className="song-icon" src={iconImage} alt="Song Icon"/>
        </div>
    );
}

export default SongPost;