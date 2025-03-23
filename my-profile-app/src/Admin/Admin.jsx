import { useState } from "react";
import "./Admin.css";
import image from './Borger.jfif';
import { Play, Pause } from "lucide-react";
import UserLink from "../UserLink/UserLink";

const StatLine = ({name,stat}) =>{
    //The name is the actual statistic. EX 'Users'
    //stat is the quantiy. EX 1000
    //title is how you describe the stat. EX 'listeners for listen' this part is optional
    return(
        <>
        <u><h2 className="statName">{name}</h2></u>
        <h3 className="stat">Total: {stat}</h3>
        <hr className="divider"></hr>
        </>
    );
}

const ReportedSong = ({songName,author,reporter,songImage,duration,reason}) =>{

    const [playing,setPlaying] = useState(false);

    const togglePlaying = ()=>{
        setPlaying(!playing);
    }

    return(
        <>
        <div className="reported-song">
            <div className="report-info">
                <p className="reported-item"><u>Title:</u> {songName}</p>
                <p className="reported-item"><UserLink text={`Author: ${author}`} userName={author}/></p>
                <p className="reported-item"><u>Reported By:</u> {reporter}</p>
                <p className="reported-item"><u>Duration:</u> {duration}</p>
                <p className="reported-item"><u>Reason for Reporting:</u> {reason}</p>
            </div>
            <img src={songImage} alt="Image wasn't able to load" className="report-img"/>
            <div className="report-icons" onClick={togglePlaying}>
                {playing?<Play/>:<Pause/>}
            </div>
            <div className="admin-btns">
                <button className="admin-btn">DISMISS</button>
                <button className="admin-btn">REMOVE SONG</button>
            </div>
        </div>
        <hr className="divider"></hr>
        </>
    );
}

const Admin = ({statlist=['User','Listener Users','Artist Users','Songs Uploaded','Total Listens','Average Song Quality']}) =>{
    return(
        <div className="admin-page">
            <div className="statistics">
                <h1 className="admin-label">Statistics Report</h1>
                {statlist.map(statName=><StatLine name={statName} stat={100}/>)}
            </div>
            <div className="flagged-songs">
                <h1 className="admin-label">Reported Songs</h1>
                <ReportedSong songName="Bad Name" author="Bad Person" reporter="Reddit Admin" songImage={image} duration="3:10" reason="Lyrics contain Racial slurs and violence."/>
                <ReportedSong songName="My Struggle" author="Ye" reporter="Anyone with a soul" songImage="https://i.pinimg.com/736x/68/85/2d/68852d3139951c9e9a568dcd799c8828.jpg" duration="19:41" reason="Bruh I don't even want to say."/>
            </div>
        </div>
    );    
}

export default Admin;