import { useState } from 'react';
import './SignupPage.css';
import { ImageUp } from "lucide-react";

const SignupPage = ()=>{

    const [profilePicture,setProfilePicture] = useState('https://i.pinimg.com/736x/07/1a/32/071a32648a9ca4aebad44fa4eb43c276.jpg');

    const createUser  = (event)=>{
        event.preventDefualt();
    }

    const uploadPicture = (e)=>{
        const file = e.target.files?.[0];
        setProfilePicture(file ? URL.createObjectURL(file):undefined)
    }


    return(
        <form onSubmit={createUser}>
        <div className='signup-container'>
            <h2>Create a insert Name accont</h2>
            <label>STUDENT ID<input required type='text' className='text signup-id' placeholder='your student id'></input></label>
            <label>SCHOOL EMAIL<input required type='email' className='text signup-email' placeholder='example@uh.edu'></input></label>
            <label>USERNAME<input required type='text' className='text signup-username'></input></label>
            <h3 className='roles-text'>What Role best suits you?</h3>
            <div className='roles'>
                <label className='artist-btn'>ARTIST<input type='radio' id='artist' name='role' value='artist'/></label>
                <label className='listener-btn'>LISTENER<input type='radio' id='listener' name='role' value='listener' checked/></label>
            </div>
            <label>DESCRIPTION<textarea placeholder='Tell other users about yourself...'></textarea></label>
            <label className='pfp-label'>PROFILE PICTURE<input type='file' className='signup-pfp' onChange={uploadPicture}></input>
                <div className='image-btn'>Image <ImageUp /></div>
                <img src={profilePicture} width="70" height="84"/>
            </label>
            <label>PASSWORD<input type='password' className='text signup-password' required></input></label>
            <label>CONFIRM PASSWORD<input type='password' className='text signup-confirm-password' required></input></label>
            <button className='signup-btn' type='submit'>CREATE ACCOUNT</button>
        </div>
        </form>
    );

}

export default SignupPage;