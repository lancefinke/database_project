import { useState, useEffect } from "react";
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

const Admin = () =>{
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const API_URL = "https://coogmusic-g2dcaubsabgtfycy.centralus-01.azurewebsites.net/";


    useEffect(() => {
        const fetchUserReport = () => {
            fetch(API_URL + "api/Users/GenerateUserReport", {
                method: "GET",
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((result) => {
                setReport(result);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching user report:", error);
                setError(error.message);
                setLoading(false);
            });
        };

        fetchUserReport();
    }, []);

    // Calculate statistics from the report
    const calculateStats = () => {
        if (!report) return [
            { name: 'Total Users', stat: 0 },
            { name: 'Artist Users', stat: 0 },
            { name: 'Listener Users', stat: 0 }
        ];

        const totalUsers = report.Artists.length + report.Listeners.length;
        const artistUsers = report.Artists.length;
        const listenerUsers = report.Listeners.length;

        return [
            { name: 'Total Users', stat: totalUsers },
            { name: 'Artist Users', stat: artistUsers },
            { name: 'Listener Users', stat: listenerUsers }
        ];
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return(
        
        <div className="admin-page">
        <div className="statistics">
            <h1 className="admin-label">Statistics Report</h1>
            {calculateStats().map((stat, index) => (
                <StatLine 
                    key={index} 
                    name={stat.name} 
                    stat={stat.stat}
                />
            ))}
        </div>

        <div className="users-report">
            <h2>User Report</h2>
            <div className="report-sections">
                <div className="artists-section">
                    <h3>Artists</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.Artists.map((artist, index) => (
                                <tr key={index}>
                                    <td>{artist.Username}</td>
                                    <td>{artist.Email}</td>
                                    <td>{new Date(artist.CreatedAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="listeners-section">
                    <h3>Listeners</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.Listeners.map((listener, index) => (
                                <tr key={index}>
                                    <td>{listener.Username}</td>
                                    <td>{listener.Email}</td>
                                    <td>{new Date(listener.CreatedAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

            
            <div className="flagged-songs">
                <h1 className="admin-label">Reported Songs</h1>
                <ReportedSong songName="Bad Name" author=" -" reporter="Reddit Admin" songImage={image} duration="3:10" reason="Lyrics contain Racial slurs and violence."/>
                <ReportedSong songName="My Struggle" author="Ye" reporter="Anyone with a soul" songImage="https://i.pinimg.com/736x/68/85/2d/68852d3139951c9e9a568dcd799c8828.jpg" duration="19:41" reason="Bruh I don't even want to say."/>
            </div>
        </div>
    );    
}

export default Admin;