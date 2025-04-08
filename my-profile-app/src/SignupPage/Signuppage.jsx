import { useState } from 'react';
import './SignupPage.css';
import { ImageUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignupPage = ()=>{

    const [pfpPrev,setPfpPrev] = useState('https://i.pinimg.com/736x/07/1a/32/071a32648a9ca4aebad44fa4eb43c276.jpg');//creates a temporary picture
    const [pfpFile,setPfpFile] = useState(null);//this will be stored in the database

    const [id,setId] = useState('');
    const [email,setEmail] = useState('');
    const [username,setUsername] = useState('');
    const [role,setRole] = useState('listener');
    const [description,setDescription] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [success,setSuccess] = useState(false);

    const navigate = useNavigate();


    const createUser = async () => {

        const formData = new FormData();

        if(password!==confirmPassword){
            alert('Passwords Do not match');
            return;
        }
      
        formData.append("profilePicture", pfpFile);
      
        // URL-encoded values
        const usernameEncoded = encodeURIComponent(username);
        const passwordEncoded = encodeURIComponent(password);
        const emailEncoded = encodeURIComponent(email);
        const isArtist = (role==='artist');
        const bioEncoded = encodeURIComponent(description);
      
        const url = `https://localhost:7152/api/Auth/register?Username=${usernameEncoded}&Password=${passwordEncoded}&Email=${emailEncoded}&IsArtist=${isArtist}&Bio=${bioEncoded}`;
      
        try {
          const response = await fetch(url, {
            method: "POST",
            body: formData,
          });
      
          const result = await response.json();
          if(result.message==="Username already exists" || result.message==='Email already exists'){
            alert(result.message);
            return;
          }
          navigate("/login");
          
        } catch (err) {
          console.error("Error registering user:", err);
        }
      };

    const uploadPicture = (e)=>{
        const file = e.target.files?.[0];
        setPfpPrev(file ? URL.createObjectURL(file):undefined)
        
        setPfpFile(file);
    }


    const changeRole = (e)=>{
        setRole(e.target.value);
    }


    return(
        
        <div className='signup-container'>
            <h2>Create a insert Name accont</h2>
            {/*<label>STUDENT ID<input required type='text' className='text signup-id' placeholder='your student id' onChange={(e)=>{setId(e.target.value)}}></input></label>*/}
            <label>SCHOOL EMAIL<input required type='email' className='text signup-email' placeholder='example@uh.edu' onChange={(e)=>{setEmail(e.target.value)}}></input></label>
            <label>USERNAME
            <input 
            style={{height: "40px",
                width: "82%",
                margin: "2px auto",
                fontSize: "medium",
                transition: "border-radius 0.35s ease",
                backgroundColor:"white",
                color:"black"
                }}
            required type='text' className='text signup-username' onChange={(e)=>{setUsername(e.target.value)}}>
            </input></label>
            <h3 className='roles-text'>What Role best suits you?</h3>
            <div className='roles'>
                <label className='artist-btn'>ARTIST<input type='radio' id='artist' name='role' value='artist' checked={role === "artist"} onChange={changeRole}/></label>
                <label className='listener-btn'>LISTENER<input type='radio' id='listener' name='role' value='listener' checked={role === "listener"} onChange={changeRole}/></label>
            </div>
            <label>DESCRIPTION<textarea className='bio' placeholder='Tell other users about yourself...' onChange={(e)=>{setDescription(e.target.value)}}></textarea></label>
            <label className='pfp-label'>PROFILE PICTURE<input style={{width:"80%",display:"none"}}type='file' className='signup-pfp' onChange={uploadPicture}></input>
                <div className='image-btn'>Image <ImageUp /></div>
                <img className="signup-img" src={pfpPrev} width="70" height="84"/>
            </label>
            <label>PASSWORD<input type='password' className='text signup-password' required onChange={(e)=>{setPassword(e.target.value)}}></input></label>
            <label>CONFIRM PASSWORD<input type='password' className='text signup-confirm-password' required onChange={(e)=>{setConfirmPassword(e.target.value)}}></input></label>
            <button className='signup-btn' onClick={createUser} >CREATE ACCOUNT</button>
            {success&&<Navigate to='/login'/>}
        </div>

    );

}

export default SignupPage;
