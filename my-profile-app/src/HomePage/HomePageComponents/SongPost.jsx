import './../homePage.css'

const SongPost = ({name,creator,duration,flags,iconImage}) =>{
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
            <img className="song-icon" src={iconImage} alt="Song Icon"/>
        </div>
    );
}

export default SongPost;