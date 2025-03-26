import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SideBar.css';

const Sidebar = () => {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;