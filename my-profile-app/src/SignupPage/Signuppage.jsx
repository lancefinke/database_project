import { useState } from 'react';
import './SignupPage.css';
import { ImageUp } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
    const [pfpPrev, setPfpPrev] = useState('https://i.pinimg.com/736x/07/1a/32/071a32648a9ca4aebad44fa4eb43c276.jpg');
    const [pfpFile, setPfpFile] = useState(null);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('listener');
    const [description, setDescription] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const createUser = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const isArtist = role === "artist";

        const requestBody = {
            username,
            password,
            email,
            isArtist,
            profilePicture: pfpPrev,
            bio: description,
        };

        try {
            const response = await fetch("http://localhost:5142/api/Auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();

            if (result.message === "Username already exists" || result.message === "Email already exists") {
                alert(result.message);
                return;
            }

            navigate("/login");
        } catch (err) {
            console.error("Error registering user:", err);
        }
    };

    const uploadPicture = (e) => {
        const file = e.target.files?.[0];
        setPfpPrev(file ? URL.createObjectURL(file) : undefined);
        setPfpFile(file);
    }

    const changeRole = (e) => {
        setRole(e.target.value);
    }

    return (
        <div className='signup-container'>
            <div className="back-button-container">
                <Link to="/login" className="back-button">← Back to Login</Link>
            </div>
            <h1 className='signup-title'>Create your account</h1>
            
            <div className='signup-block'>
                <label>
                    Email address
                    <input
                        required
                        type='email'
                        className='text'
                        placeholder='Enter your email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                <label>
                    Username
                    <input
                        required
                        type='text'
                        className='text'
                        placeholder='Choose a username'
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>

                <label>
                    Profile picture
                    <input
                        type='file'
                        className='signup-pfp'
                        onChange={uploadPicture}
                        style={{ display: 'none' }}
                        id="profile-picture"
                    />
                    <img className="signup-img" src={pfpPrev} alt="Profile preview" />
                    <label htmlFor="profile-picture" className='image-btn'>
                        <ImageUp size={20} />
                        Choose image
                    </label>
                </label>

                <div>
                    <label>Account type</label>
                    <div className='roles'>
                        <label>
                            <input
                                type='radio'
                                id='artist'
                                name='role'
                                value='artist'
                                checked={role === "artist"}
                                onChange={changeRole}
                            />
                            Artist
                        </label>
                        <label>
                            <input
                                type='radio'
                                id='listener'
                                name='role'
                                value='listener'
                                checked={role === "listener"}
                                onChange={changeRole}
                            />
                            Listener
                        </label>
                    </div>
                </div>

                <label>
                    Bio
                    <textarea
                        className='bio'
                        placeholder='Tell other users about yourself...'
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>

                <label>
                    Password
                    <input
                        type='password'
                        className='text'
                        placeholder='Create a password'
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>

                <label>
                    Confirm password
                    <input
                        type='password'
                        className='text'
                        placeholder='Confirm your password'
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </label>

                <button className='signup-btn' onClick={createUser}>
                    Create Account
                </button>
            </div>
        </div>
    );
}

export default SignupPage;
