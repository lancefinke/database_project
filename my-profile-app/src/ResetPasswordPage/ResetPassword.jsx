import { useState } from "react";
import "./ResetPassword.css";

const ResetPassword = () =>{

    const [confirmed,setConfirmed] = useState(false);
    const [resetCode,setResetCode] = useState('');

    const validateCode = ()=>{
        if(resetCode===resetCode){
            setConfirmed(true);
        }
        else{
            alert("Codes do not match");
        }
    }

    const sendCode = () =>{
        setResetCode(Math.floor(100000 + Math.random() * 900000));
    }


    return(
            <>
            <h1>To reset your password, a 6-digit code will be sent to your email. Enter the code in the area below </h1>
            <div className="reset-container">
            <label for="reset-email">EMAIL ADDRESS
            <input type="email" className="reset-input" id="reset-email"></input></label>
            <button className="reset-btn" onClick={sendCode}>SEND RESET CODE</button>
            <label for="reset-code">ENTER CODE HERE
            <input type="text" className="reset-input" id="reset-code"></input></label>
            <button className="reset-btn" onClick={validateCode}>CONFIRM CODE</button>
            {confirmed?
            <>
            <label for="reset-password">NEW PASSWORD
            <input type="password" className="reset-input" id="reset-password"></input></label>
            <label for="reset-confirm">CONFIRM NEW PASSWORD
            <input type="password" className="reset-input" id="reset-confirm"></input></label>
            <button className="reset-btn">RESET PASSWORD</button>
            </>:<></>
            }
            </div>
            </>
    );

}

export default ResetPassword;