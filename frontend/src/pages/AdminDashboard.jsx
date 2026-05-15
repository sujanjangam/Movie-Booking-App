import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-cards">
        <Link to="/admin/movies" className="admin-card">
          <h2>Add Movie</h2>
          <p>Add new movies to the system</p>
        </Link>
        <Link to="/admin/theatres" className="admin-card">
          <h2>Add Theatre</h2>
          <p>Add new theatres to the system</p>
        </Link>
        <Link to="/admin/shows" className="admin-card">
          <h2>Create Show</h2>
          <p>Create shows with movie, theatre, and time</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
