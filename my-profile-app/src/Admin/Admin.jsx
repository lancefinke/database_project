import "./Admin.css";
import image from './Borger.jfif';

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

    return(
        <div className="reported-song">
            <p className="reported-item"><u>Title:</u> {songName}</p>
            <p className="reported-item"><u>Author:</u> {author}</p>
            <p className="reported-item"><u>Reported By:</u> {reporter}</p>
            <p className="reported-item"><u>Duration:</u> {duration}</p>
            <p className="reported-item"><u>Reason for Reporting:</u> {reason}</p>
            <img src={songImage} alt="Image wasn't able to load" className="report-img"/>
            <div className="admin-btns">
                <button className="admin-btn">DISMISS</button>
                <button className="admin-btn">REMOVE SONG</button>
            </div>

        </div>
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
            </div>
        </div>
    );    
}

export default Admin;