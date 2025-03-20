import { useState } from "react";
import "./ResetPassword.css";
import Editable from "../ProfilePage/Components/Editable";

const ResetPassword = () =>{

    const [confirmed,setConfirmed] = useState(false);
    const [resetCode,setResetCode] = useState(0);

    //input
    const [email,setEmail] = useState('');
    const [codeText,setCodeText] = useState('');
    const [newPassword,setNewPassword] = useState('');
    const [confirmNewPassword,setConfirmNewPassword] = useState('');

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
            <h1>To reset your password, a 6-digit code will be sent to your email.</h1>
            <div className="reset-container">
                <label htmlFor="reset-email">EMAIL ADDRESS
                <input type="email" className="reset-input" id="reset-email" onChange={(e)=>{setEmail(e.target.value)}}></input></label>
                <button className="reset-btn" onClick={sendCode}>SEND RESET CODE</button>
                <label htmlFor="reset-code">ENTER CODE HERE
                <input type="text" className="reset-input" id="reset-code" onChange={(e)=>{setCodeText(e.target.value)}}></input></label>
                <button className="reset-btn" onClick={validateCode}>CONFIRM CODE</button>
                {confirmed?
                <>
                <label htmlFor="reset-password">NEW PASSWORD
                <input type="password" className="reset-input" id="reset-password" onChange={(e)=>{setNewPassword(e.target.value)}}></input></label>
                <label htmlFor="reset-confirm">CONFIRM NEW PASSWORD
                <input type="password" className="reset-input" id="reset-confirm" onChange={(e)=>{setConfirmNewPassword(e.target.value)}}></input></label>
                <button className="reset-btn">RESET PASSWORD</button>
                </>:<></>
                }
            </div>
        </>
    );

}

export default ResetPassword;