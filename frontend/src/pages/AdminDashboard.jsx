import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/AdminDashboard.css';

const cards = [
  { to: '/admin/movies',    icon: '🎥', title: 'Manage Movies',   desc: 'Add, edit, and manage movies in your cinema' },
  { to: '/admin/theatres',  icon: '🏛️', title: 'Manage Theatres', desc: 'Add theatres and configure screens' },
  { to: '/admin/shows',     icon: '🎭', title: 'Create Shows',    desc: 'Schedule shows with automatic seat generation' },
  { to: '/admin/analytics', icon: '📊', title: 'Analytics',       desc: 'View revenue, bookings, and performance metrics' },
  { to: '/',                icon: '🎫', title: 'Browse Movies',   desc: 'View customer-facing movie listings' },
  { to: '/booking',         icon: '📋', title: 'My Bookings',     desc: 'View your booking history' },
];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="animated-bg"></div>
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-inner">
          <div className="admin-dashboard-header">
            <h1 className="admin-dashboard-title">🎬 Admin Dashboard</h1>
            <p className="admin-dashboard-subtitle">Welcome, {user?.name} ({user?.role})</p>
          </div>

          <div className="admin-cards-grid">
            {cards.map(({ to, icon, title, desc }) => (
              <Link key={to + title} to={to} className="admin-nav-card">
                <div className="admin-nav-card-icon">{icon}</div>
                <h2 className="admin-nav-card-title">{title}</h2>
                <p className="admin-nav-card-desc">{desc}</p>
              </Link>
            ))}
          </div>

          <div className="admin-tip-banner">
            <p>💡 <strong>Tip:</strong> Start by adding movies, then create theatres, and finally schedule shows!</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
