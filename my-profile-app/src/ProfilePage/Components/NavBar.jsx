import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${isProfilePage ? 'profile-page-navbar' : 'full-width-navbar'}`}>
      <div className="nav-container">
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <div className="menu-icon"></div>
        </button>
        
        <div className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link className="nav-link" to="/">HOME</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search">SEARCH</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">PROFILE</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;