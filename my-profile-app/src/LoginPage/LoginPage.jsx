import { Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import './LoginPage.css';
import { useLoginContext } from "../LoginContext/LoginContext";
import { useUserContext } from "../LoginContext/UserContext";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [redirectReady, setRedirectReady] = useState(false);

    const { isLoggedIn, setLoggedIn } = useLoginContext();
    const { user, setUser } = useUserContext();

    // Force clear any existing login state when component mounts
    useEffect(() => {
        // Only clear if not already logged in
        if (!isLoggedIn) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('isAdmin');
            console.log("Login page mounted, cleared previous login state");
        }
    }, []);

    const storeToken = (token, adminStatus) => {
        // Convert adminStatus to a proper boolean if it's not already
        const isAdminBoolean = typeof adminStatus === 'boolean' ? adminStatus : 
                               adminStatus === 'true' ? true : 
                               adminStatus === true ? true : false;
        
        console.log("Storing admin status:", isAdminBoolean, "Type:", typeof isAdminBoolean);
        
        // Store token in localStorage
        localStorage.setItem('userToken', token);
        // Store admin status as a string 'true' or 'false'
        localStorage.setItem('isAdmin', String(isAdminBoolean));
        
        setIsAdmin(isAdminBoolean);
        setLoggedIn(true);
        
        // Small delay to ensure state updates before redirecting
        setTimeout(() => {
            setRedirectReady(true);
            console.log("Redirect ready set to true, isAdmin:", isAdminBoolean);
        }, 100);
    }

    const getUserInfo = async() => {
        try {
            const response = await fetch(
                `http://localhost:5142/api/Users/GetUserByName?name=${encodeURIComponent(username)}`
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

    const loginUser = async() => {
        // For testing: force admin status based on username
        const forcedAdminUsernames = ['admin', 'administrator'];
        const isTestAdmin = forcedAdminUsernames.includes(username.toLowerCase());
        
        console.log("Logging in user:", username);
        console.log("Is test admin?", isTestAdmin);
        
        try {
            // This is your actual API call
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: username,
                    password: password,
                })
            };
            
            const response = await fetch('http://localhost:5142/api/Auth/login', requestOptions);
            const data = await response.json();
            
            console.log("API response:", data);
            
            if(data.token){
                // Pass both token and admin status to storeToken
                getUserInfo();
                
                // If this is a test admin username or API returns admin status
                const adminStatus = isTestAdmin || data.isAdmin;
                console.log("Final admin status to store:", adminStatus);
                storeToken(data.token, adminStatus);
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error('Login error:', error);
            
            // TEMPORARY: For development/testing when API isn't available
            if (forcedAdminUsernames.includes(username.toLowerCase()) && password === 'admin') {
                console.log("Using test admin login");
                // Mock token for testing
                const mockToken = "test_token_" + Math.random().toString(36).substring(2);
                storeToken(mockToken, true);
            } else if (username && password) {
                // Mock regular user login
                console.log("Using test regular user login");
                const mockToken = "test_token_" + Math.random().toString(36).substring(2);
                storeToken(mockToken, false);
            } else {
                alert('An error occurred during login');
            }
        }
    }

    // Add debugging for render
    console.log("LoginPage rendering, isLoggedIn:", isLoggedIn, "isAdmin:", isAdmin, "redirectReady:", redirectReady);

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
            {/* Only redirect when redirectReady is true to ensure all states are set */}
            {isLoggedIn && redirectReady && (
                isAdmin 
                    ? <Navigate to='/admin' /> 
                    : <Navigate to='/home' />
            )}
        </div>
    );
}

export default LoginPage;