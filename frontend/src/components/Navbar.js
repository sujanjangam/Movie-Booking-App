import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Movie Booking</Link>
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          {user ? (
            <>
              <Link to="/booking" className="navbar-link">My Bookings</Link>
              <span className="navbar-user">Hello, {user.name}</span>
              <button onClick={handleLogout} className="navbar-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
