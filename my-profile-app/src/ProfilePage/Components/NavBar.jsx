// Navbar.jsx
import React from 'react';
import './Navbar.css'; // Importing the CSS for Navbar styling

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg fixed-top bg-primary ">
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
              <a className="nav-link" href="HomePage">HOME</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#SearchPage">SEARCH</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#ProfilePage">PROFILE</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
