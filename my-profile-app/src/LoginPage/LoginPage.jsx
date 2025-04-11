import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import './LoginPage.css';
import { useLoginContext } from "../LoginContext/LoginContext";
import { useUserContext } from "../LoginContext/UserContext";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const { isLoggedIn, setLoggedIn } = useLoginContext();
    const { user, setUser } = useUserContext();

    const storeToken = (token, adminStatus)=>{
        // Store token in localStorage instead of cookie
        localStorage.setItem('userToken', token);
        // Store admin status in localStorage
        localStorage.setItem('isAdmin', adminStatus);
        setIsAdmin(adminStatus);
        setLoggedIn(true);
    }

    const getUserInfo = async()=>{
        try {
            const response = await fetch(
                `https://localhost:7152/api/Users/GetUserByName?name=${encodeURIComponent(username)}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    }

    const loginUser = async()=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: username,
                password: password,
            })
        };
        fetch('https://localhost:7152/api/Auth/login', requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.token){
                    // Pass both token and admin status to storeToken
                    getUserInfo();
                    storeToken(data.token, data.isAdmin);
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                alert('An error occurred during login');
            });
    }

    return (
        <div className="login-container">
            <h1 className="welcome-message">Log in to continue</h1>
            <div className="login-option">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    loginUser();
                }}>
                    <label htmlFor="login-email">
                        Username
                        <input
                            type="text"
                            className="login-input"
                            id="login-email"
                            placeholder="Enter your username"
                            onChange={(event) => setUsername(event.target.value)}
                            required
                        />
                    </label>
                    
                    <label htmlFor="login-pswrd">
                        Password
                        <input 
                            type="password" 
                            className="login-input" 
                            id="login-pswrd"
                            placeholder="Password" 
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </label>

                    <Link className="forgot-password-link" to='/reset'>Forgot your password?</Link>
                    
                    <button type="submit" className="login-btn">LOG IN</button>
                </form>

                <div className="divider"></div>

                <p className="signup-text">
                    Don't have an account?{' '}
                    <Link className="signup-link" to="/signup">Sign up</Link>
                </p>
            </div>
            {isLoggedIn && (
                isAdmin 
                    ? <Navigate to='/admin' /> 
                    : <Navigate to='/home' />
            )}
        </div>
    );
}

export default LoginPage;
