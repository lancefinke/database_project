import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  
  return (
    <nav className={`navbar fixed-top ${isProfilePage ? 'profile-page-navbar' : 'full-width-navbar'}`}>
      <div className="container">
        <button
          data-bs-toggle="collapse"
          data-bs-target="#navcol-1"
          className="navbar-toggler"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navcol-1">
          <ul className="navbar-nav ms-auto">
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