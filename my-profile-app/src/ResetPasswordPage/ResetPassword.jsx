import { useState } from "react";
import "./ResetPassword.css";
import emailjs from '@emailjs/browser'
import keys from './keys';
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [confirmed, setConfirmed] = useState(false);
    const [resetCode, setResetCode] = useState(Math.floor(100000 + Math.random() * 900000));
    const [email, setEmail] = useState('');
    const [codeText, setCodeText] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const navigate = useNavigate();

    const validateCode = () => {
        if (resetCode === (codeText * 1)) {
            setConfirmed(true);
        } else {
            alert("Codes do not match");
        }
    }

    const sendEmail = (e) => {
        e.preventDefault();
        emailjs.sendForm(keys.service, keys.template, e.target, keys.api_key);
    }

    const resetPassword = async () => {
        if (newPassword !== confirmNewPassword) {
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

    return (
        <div className="reset-container">
            <h1 className="reset-title">Reset Password</h1>
            <p className="instructions">To reset your password, a 6-digit code will be sent to your email.</p>
            
            <div className="reset-block">
                <div className="reset-form">
                    <form onSubmit={sendEmail}>
                        <label htmlFor="reset-email">
                            Email address
                            <input
                                type="email"
                                name="email"
                                className="reset-input"
                                id="reset-email"
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>
                        <input
                            type="text"
                            name="resetCode"
                            value={resetCode}
                            style={{ display: "none" }}
                        />
                        <button className="reset-btn" type="submit">
                            Send Reset Code
                        </button>
                    </form>

                    <div className="divider"></div>

                    <label htmlFor="reset-code">
                        Verification code
                        <input
                            type="text"
                            className="reset-input"
                            id="reset-code"
                            placeholder="Enter 6-digit code"
                            onChange={(e) => setCodeText(e.target.value)}
                            required
                        />
                    </label>
                    <button className="reset-btn" onClick={validateCode}>
                        Verify Code
                    </button>

                    {confirmed && (
                        <>
                            <div className="divider"></div>
                            <label htmlFor="reset-password">
                                New password
                                <input
                                    type="password"
                                    className="reset-input"
                                    id="reset-password"
                                    placeholder="Enter new password"
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </label>
                            <label htmlFor="reset-confirm">
                                Confirm new password
                                <input
                                    type="password"
                                    className="reset-input"
                                    id="reset-confirm"
                                    placeholder="Confirm new password"
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    required
                                />
                            </label>
                            <button className="reset-btn" onClick={resetPassword}>
                                Reset Password
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;