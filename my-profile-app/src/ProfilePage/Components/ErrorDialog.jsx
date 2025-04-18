import React from 'react';
import './ErrorDialog.css'; // Optional if you want to keep styles separate

const ErrorDialog = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <>
      <div className="dialog-overlay" onClick={onClose}></div>
      <div className="dialog-box">
        <h3> Report Error</h3>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </>
  );
};

export default ErrorDialog;
