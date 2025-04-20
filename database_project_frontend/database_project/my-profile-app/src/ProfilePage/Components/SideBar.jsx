import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLoginContext } from '../../LoginContext/LoginContext';
import './SideBar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isProfilePage = location.pathname === '/profile';
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { setLoggedIn } = useLoginContext(); // Import login context
  
  // Check if the current path matches to set active state
  const isActive = (path) => location.pathname === path;
  
  // Check if current path is a sub-item of Profile
  const isProfileSubitem = () => 
    location.pathname === '/following' || 
    location.pathname === '/dashboard';
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Modified function to handle both dropdown toggle and navigation
  const handleProfileClick = (e) => {
    if (window.innerWidth <= 768) {
      // On mobile, toggle dropdown without navigating
      e.preventDefault();
      setProfileDropdownOpen(!profileDropdownOpen);
    } else {
      // On desktop, only toggle dropdown if clicking the arrow
      if (e.target.className === 'dropdown-arrow') {
        e.preventDefault();
        setProfileDropdownOpen(!profileDropdownOpen);
      } else {
        // Close dropdown when navigating to profile page
        setProfileDropdownOpen(false);
      }
      // Otherwise the link will navigate normally
    }
  };
  
  // Handle navigation to child items
  const handleChildItemClick = () => {
    // Keep dropdown open when clicking a child item
    // This is needed for mobile, desktop will use hover
    if (window.innerWidth <= 768) {
      setProfileDropdownOpen(true);
    }
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
  
  // Close dropdowns when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileDropdownOpen]);
  
  // Monitor location changes to manage dropdown state
  useEffect(() => {
    // Open dropdown if we're on a sub-item page
    if (isProfileSubitem()) {
      setProfileDropdownOpen(true);
    } 
    // Close dropdown when navigating to profile page
    else if (location.pathname === '/profile') {
      setProfileDropdownOpen(false);
    }
  }, [location.pathname]);
  
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
              <Link 
                className={`sidebar-link ${isActive('/home') ? 'active' : ''}`} 
                to="/home" 
                data-initial="E"
              >
                EXPLORE
              </Link>
            </li>
            <li className="sidebar-item">
              <Link 
                className={`sidebar-link ${isActive('/search') ? 'active' : ''}`} 
                to="/search" 
                data-initial="H"
              >
                HOME
              </Link>
            </li>
            <li className={`sidebar-item profile-dropdown ${isProfileSubitem() ? 'active-parent' : ''}`}>
              <div className="dropdown-header">
                <Link 
                  className={`sidebar-link ${isActive('/profile') || isProfileSubitem() ? 'active' : ''}`} 
                  to="/profile" 
                  data-initial="P"
                  onClick={handleProfileClick}
                >
                  PROFILE
                  <span className="dropdown-arrow">
                    {profileDropdownOpen ? '▲' : '▼'}
                  </span>
                </Link>
              </div>
              <ul className={`dropdown-menu ${profileDropdownOpen ? 'open' : ''}`}>
                <li>
                  <Link 
                    className={`dropdown-item ${isActive('/following') ? 'active' : ''}`} 
                    to="/following"
                    data-initial="F"
                    onClick={handleChildItemClick}
                  >
                    FOLLOWING
                  </Link>
                </li>
                <li>
                  <Link 
                    className={`dropdown-item ${isActive('/dashboard') ? 'active' : ''}`} 
                    to="/dashboard"
                    data-initial="D"
                    onClick={handleChildItemClick}
                  >
                    DASHBOARD
                  </Link>
                </li>
              </ul>
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

export default Sidebar;