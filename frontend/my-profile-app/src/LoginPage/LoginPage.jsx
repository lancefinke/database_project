import { Link,Navigate } from "react-router-dom";
import { useState } from "react";
import './LoginPage.css';

const LoginPage = () =>{

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [success,setSuccess] = useState(false);

    const storeToken = (token)=>{
        setSuccess(true);
        document.cookie=token
    }

    const loginUser = async()=>{
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: email,
                password: password,
               })
        };
        fetch('https://localhost:7152/api/Auth/login', requestOptions)
            .then(response => response.json())
            .then(data =>{data.token?storeToken(data.token):alert(data.message)});
    }

    return(
        <>
        <h1 className="welcome-message">Hello, Welcome back to Insert Name</h1>
        <div className="login-container">
            <div className="login-option">
                <h3>Returning User?</h3>
                <label for="login-email">USERNAME
                <input type="text" className="login-input" id="login-email" onChange={(event)=>setEmail(event.target.value)}></input></label>
                <label for="login-pswrd">PASSWORD
                <input type="password" className="login-input" id="login-pswrd" onChange={(event)=>setPassword(event.target.value)}></input></label>
                <Link className="forgot-password-link" to='/reset'>Forgot Password?</Link>
                <button className="login-btn" onClick={loginUser}>LOGIN</button>
            </div>
            <div className="signup-option">
                <h3>First time visiting?</h3>
                <h3>Sign Up and create a new Account for Free!</h3>
                <div className="link-container"><Link className="signup-link" to="/signup">Click Here to sign up</Link></div>
            </div>
        </div>
        {success&&<Navigate to='/home' />}
        </>
    );

}

export default LoginPage;