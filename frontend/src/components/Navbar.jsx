import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/realtime.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎬 BookMyShow
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          
          {user ? (
            <>
              {(user.role === 'TENANT_ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'QA_ADMIN') && (
                <Link to="/admin" className="navbar-link">Dashboard</Link>
              )}
              <Link to="/booking" className="navbar-link">My Bookings</Link>
              <span className="navbar-link" style={{ opacity: 0.7 }}>
                👤 {user.name} {user.role && `(${user.role})`}
              </span>
              <button onClick={handleLogout} className="navbar-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="navbar-btn">Login</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
