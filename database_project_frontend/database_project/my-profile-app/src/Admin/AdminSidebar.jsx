import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLoginContext } from '../LoginContext/LoginContext';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { setLoggedIn } = useLoginContext(); // Import login context
  
  // Check if the current path matches to set active state
  const isActive = (path) => location.pathname === path;
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleLogout = () => {
    // Clear the authentication token and admin status
    localStorage.removeItem('userToken');
    localStorage.removeItem('isAdmin');
    
    // Update the login context state
    setLoggedIn(false);
    
    // Redirect to login page
    navigate('/login');
  };
  
  return (
    <nav className={`sidebar full-width ${menuOpen ? 'open' : ''}`}>
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
              <Link 
                className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`} 
                to="/admin" 
                data-initial="A"
              >
                ADMIN
              </Link>
            </li>
          </ul>
          
          <button 
            className="sidebar-link logout-button" 
            onClick={handleLogout} 
            data-initial="L"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminSidebar;