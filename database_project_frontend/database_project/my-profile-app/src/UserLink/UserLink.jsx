import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserLink.css';

const UserLink = ({ text, userName }) => {
  const navigate = useNavigate();
  
  const handleUserClick = (e) => {
    e.stopPropagation(); // Prevent parent click events from firing
    navigate(`/profile/${userName}`);
  };

  return (
    <span className="user-link" onClick={handleUserClick}>
      {text}
    </span>
  );
};

export default UserLink;