import { Link,Navigate } from "react-router-dom";
import { useState } from "react";
import './LoginPage.css';
import { useLoginContext } from "../LoginContext/LoginContext";
import { useUserContext } from "../LoginContext/UserContext";

const LoginPage = () =>{
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
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

    return(
        <>
        <h1 className="welcome-message">Hello, Welcome back to Insert Name</h1>
        <div className="login-container">
            <div className="login-option">
                <h3>Returning User?</h3>
                <label for="login-email">USERNAME
                <input 
                style={{height: "40px",
                        width: "82%",
                        margin: "2px auto",
                        fontSize: "medium",
                        transition: "border-radius 0.35s ease",
                        backgroundColor:"white",
                        color:"black"
                        }}
                type="text" className="login-input" id="login-email" onChange={(event)=>setUsername(event.target.value)}></input></label>
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
        {isLoggedIn && (
            isAdmin 
                ? <Navigate to='/admin' /> 
                : <Navigate to='/home' />
        )}
        </>
    );

}

export default LoginPage;
