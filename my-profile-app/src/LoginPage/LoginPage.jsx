import { Link } from "react-router-dom";
import { useState } from "react";
import './LoginPage.css';

const LoginPage = () =>{


    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');


    return(
        <>
        <h1 className="welcome-message">Hello, Welcome back to Insert Name</h1>
        <div className="login-container">
            <div className="login-option">
                <h3>Returning User?</h3>
                <label for="login-email">EMAIL ADDRESS
                <input type="email" className="login-input" id="login-email" onChange={(event)=>setEmail(event.target.value)}></input></label>
                <label for="login-pswrd">PASSWORD
                <input type="password" className="login-input" id="login-pswrd" onChange={(event)=>setPassword(event.target.value)}></input></label>
                <Link className="forgot-password-link" to='/reset'>Forgot Password?</Link>
                <button className="login-btn">LOGIN</button>
            </div>
            <div className="signup-option">
                <h3>First time visiting?</h3>
                <h3>Sign Up and create a new Account for Free!</h3>
                <div className="link-container"><Link className="signup-link" to="/signup">Click Here to sign up</Link></div>
            </div>
        </div>
        </>
    );

}

export default LoginPage;