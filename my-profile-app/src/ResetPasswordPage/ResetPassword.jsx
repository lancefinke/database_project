import { useState } from "react";
import "./ResetPassword.css";
import emailjs from '@emailjs/browser'
import keys from './keys';
import { useNavigate } from "react-router-dom";


const ResetPassword = () =>{

    const [confirmed,setConfirmed] = useState(false);
    const [resetCode,setResetCode] = useState(Math.floor(100000 + Math.random() * 900000));

    //input
    const [email,setEmail] = useState('');
    const [codeText,setCodeText] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const [confirmNewPassword,setConfirmNewPassword] = useState('');

    const navigate = useNavigate();

    const validateCode = ()=>{
        if(resetCode===(codeText*1)){
            setConfirmed(true);
        }
        else{
            alert("Codes do not match");
        }
    }

    const sendEmail = (e)=>{
        e.preventDefault();
        emailjs.sendForm(keys.service,keys.template,e.target,keys.api_key);
    }

    const resetPassword = async()=>{

        if(newPassword!==confirmNewPassword){
            alert("Passwords do not match");
            return;
        }
        const newPasswordEncoded = encodeURIComponent(newPassword);
        const emailEncoded = encodeURIComponent(email);

        const url = `https://localhost:7152/api/Auth/ResetPassword?NewPassword=${newPasswordEncoded}&Email=${emailEncoded}`;

        try {
            const response = await fetch(url, {
            method: "PATCH",
            });

            const result = await response.json();
            console.log("Password reset:", result);
            navigate("/login");
        } catch (err) {
            console.error("Error resetting password:", err);
        }
    }



    return(
        <>
            <h1>To reset your password, a 6-digit code will be sent to your email.</h1>

            <div className="reset-container">
                <form style={{display:"flex",flexDirection:"column"}} onSubmit={sendEmail}>
                <label htmlFor="reset-email">EMAIL ADDRESS
                <input type="email" name="email" className="reset-input" id="reset-email" onChange={(e)=>{setEmail(e.target.value);console.log(email)}}></input></label>
                <input type="text" name="resetCode" value={resetCode} style={{display:"none"}}></input>
                <button className="reset-btn" type="submit">SEND RESET CODE</button></form>
                <label htmlFor="reset-code">ENTER CODE HERE
                <input 
                style={{height: "40px",
                    width: "80%",
                    margin: "2px auto",
                    fontSize: "medium",
                    transition: "border-radius 0.35s ease",
                    backgroundColor:"white",
                    color:"black"
                    }}
                type="text" className="reset-input" id="reset-code" onChange={(e)=>{setCodeText(e.target.value)}}></input></label>
                <button className="reset-btn" onClick={validateCode}>CONFIRM CODE</button>
                {confirmed?
                <>
                <label htmlFor="reset-password">NEW PASSWORD
                <input type="password" className="reset-input" id="reset-password" onChange={(e)=>{setNewPassword(e.target.value)}}></input></label>
                <label htmlFor="reset-confirm">CONFIRM NEW PASSWORD
                <input type="password" className="reset-input" id="reset-confirm" onChange={(e)=>{setConfirmNewPassword(e.target.value)}}></input></label>
                <button className="reset-btn" onClick={resetPassword}>RESET PASSWORD</button>
                </>:<></>
                }
            </div>
        </>
    );

}

export default ResetPassword;