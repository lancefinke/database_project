import SongPost from "./HomePageComponents/SongPost";
import SongSearchBar from "./HomePageComponents/SongSearchBar";
import './homePage.css'

const HomePage = ()=>{
    const songflags= ["Rap","HipHop"];

    return(
         <>
            <SongSearchBar />
            <div className="song-list"><SongPost name="All of the Lights" creator="Kanye West" duration= "5:26" flags={songflags} iconImage="https://i.ytimg.com/vi/HAfFfqiYLp0/maxresdefault.jpg"/></div>
         </>
    );
}


export default HomePage;