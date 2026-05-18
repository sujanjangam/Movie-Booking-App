import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/Admin.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2>🎬 Admin Panel</h2>
      <nav>
        <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
          🏠 Dashboard
        </Link>
        <Link to="/admin/movies" className={location.pathname === "/admin/movies" ? "active" : ""}>
          🎥 Movies
        </Link>
        <Link to="/admin/theatres" className={location.pathname === "/admin/theatres" ? "active" : ""}>
          🏛️ Theatres
        </Link>
        <Link to="/admin/shows" className={location.pathname === "/admin/shows" ? "active" : ""}>
          🎭 Shows
        </Link>
        <Link to="/admin/analytics" className={location.pathname === "/admin/analytics" ? "active" : ""}>
          📊 Analytics
        </Link>
        <Link to="/" className="">
          🎫 Browse Movies
        </Link>
        <Link to="/booking" className="">
          📋 My Bookings
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
