import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SideBar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isProfilePage = location.pathname === '/profile';
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleLogout = () => {
    // Clear the authentication token and admin status
    localStorage.removeItem('userToken');
    localStorage.removeItem('isAdmin');
    // Redirect to login page
    navigate('/login');
  };
  
  return (
    <nav className={`sidebar ${isProfilePage ? 'profile-page' : 'full-width'} ${menuOpen ? 'open' : ''}`}>
      <div className="sidebar-container">
        <button
          className="sidebar-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <div className="sidebar-icon"></div>
        </button>
        <div className={`sidebar-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="sidebar-list">
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/home" data-initial="E">EXPLORE</Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/search" data-initial="H">HOME</Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/following" data-initial="F">FOLLOWING</Link>
            </li>
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/profile" data-initial="P">PROFILE</Link>
            </li>
            <li className="sidebar-item">
  <Link className="sidebar-link" to="/dashboard" data-initial="D">DASHBOARD</Link>
</li>
          </ul>
          
          <button 
            className="sidebar-link logout-button" 
            onClick={handleLogout} 
            data-initial="L"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'center',
              fontFamily: 'inherit',
              fontSize: '1.125rem',
              fontWeight: '500',
              color: 'white',
              textTransform: 'uppercase',
              marginTop: 'auto',
              position: 'absolute',
              bottom: '60px',
              left: '0',
              textDecoration: 'underline' // Adding the underline
            }}
          >
            LOGOUT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;