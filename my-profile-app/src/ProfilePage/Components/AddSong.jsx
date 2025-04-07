import { ImageUp, ListPlus } from "lucide-react";
import { useState } from "react";
import "./../../SignupPage/Signuppage.css";

const AddSong = () =>{

    const [songImagePrev,setSongImagePrev] = useState('https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=');//creates a temporary picture
    const [songImageFile,setSongImageFile] = useState(undefined);//this will be stored in the database

    const [audioFile,setAudioFile] = useState(undefined);
    const [audioFileName,setAudioFileName] = useState('');
    
    const [selectedGenre, setSelectedGenre] = useState('');
    const [songName, setSongName] = useState('');
    
    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value);
    };

    const handleSongNameChange = (e) => {
        setSongName(e.target.value);
    };

    const uploadAudio = (e) =>{
        const file = e.target.files?.[0];
        setAudioFile(file);
        setAudioFileName(file.name);
    }

    const uploadPicture = (e)=>{
        const file = e.target.files?.[0];
        setSongImagePrev(file ? URL.createObjectURL(file):undefined)
        setSongImageFile(file);
        console.log(file);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedGenre) {
            alert("Please select a genre");
            return;
        }
        // Submit form logic here
        console.log({
            songName,
            selectedGenre,
            audioFile,
            songImageFile
        });
    }

    return(

        <div className="add-song-wrapper" style={{width:'65%',height:"80%",margin:"0px auto"}}>
            <style>
                {
                    `.song-input{
                        width:80%;
                        height:15px;    
                    }
                    .as-label{
                        margin: 3% 5px;
                    }
                    .add-song-wrapper{
                        display:flex;
                        flex-direction:column;
                    }    
                    .song-file{
                        display:none;
                    }
                    .album-select, .genre-select{
                        width:80%;
                        border-radius: 10px;
                        height: 30px;
                    }
                    .file{
                        display:flex;
                        align-items:center;
                        gap:20px;
                    }
                    .add-song-btn{
                        background-color:#101010;
                        color:white;
                        padding: 5px 10px;
                        border: 4px solid white;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        border-radius: 15px;
                    }
                    `
                }
            </style>
            <form onSubmit={handleSubmit}>
                <label className="as-label">
                    SONG NAME
                    <input 
                        required 
                        type='text' 
                        className='song-input'
                        value={songName}
                        onChange={handleSongNameChange}
                    />
                </label>
                
                <label className="as-label">
                    SELECT ALBUM
                    <select className="album-select" style={{borderRadius:"10px"}}>
                        <option value="">Albums</option>
                    </select>
                </label>
                
                <label className="as-label">
                    SELECT GENRE
                    <select 
                        className="genre-select" 
                        value={selectedGenre}
                        onChange={handleGenreChange}
                        required
                    >
                        <option value="">Select a genre</option>
                        <option value="pop">Pop</option>
                        <option value="rock">Rock</option>
                        <option value="hip-hop">Hip-Hop</option>
                        <option value="rnb">R&B</option>
                        <option value="electronic">Electronic</option>
                        <option value="country">Country</option>
                        <option value="jazz">Jazz</option>
                        <option value="blues">Blues</option>
                        <option value="metal">Metal</option>
                        <option value="classical">Classical</option>
                        <option value="alternative">Alternative</option>
                        <option value="indie">Indie</option>
                    </select>
                </label>
                
                <label className='as-label file'>
                    SONG FILE
                    <input 
                        onChange={uploadAudio} 
                        type='file' 
                        className='song-file'
                        required
                    />
                    <div style={{width:"30%"}} className='song-file-btn'>File <ListPlus /></div>
                    {audioFileName}
                </label>
                
                <label className='as-label file'>
                    SONG IMAGE
                    <input 
                        onChange={uploadPicture} 
                        type='file' 
                        className='song-file'
                    />
                    <div style={{width:"30%"}} className='song-file-btn'>Image <ImageUp /></div>
                    <img className="song-image-prev" src={songImagePrev} width="70" height="84"/>
                </label>
                
                <button type="submit" className='add-song-btn'>UPLOAD SONG</button>
            </form>
        </div>
    );
}

export default AddSong;