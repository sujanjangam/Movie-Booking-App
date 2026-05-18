import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/Admin.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="animated-bg"></div>
      <div className="admin-dashboard" style={{
        minHeight: '100vh',
        padding: '4rem 2rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '0.5rem'
            }}>
              🎬 Admin Dashboard
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              Welcome, {user?.name} ({user?.role})
            </p>
          </div>

          <div className="admin-cards" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <Link to="/admin/movies" className="admin-card" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎥</div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '0.5rem'
              }}>Manage Movies</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Add, edit, and manage movies in your cinema
              </p>
            </Link>

            <Link to="/admin/theatres" className="admin-card" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '0.5rem'
              }}>Manage Theatres</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Add theatres and configure screens
              </p>
            </Link>

            <Link to="/admin/shows" className="admin-card" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭</div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '0.5rem'
              }}>Create Shows</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Schedule shows with automatic seat generation
              </p>
            </Link>

            <Link to="/admin/analytics" className="admin-card" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '0.5rem'
              }}>Analytics</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                View revenue, bookings, and performance metrics
              </p>
            </Link>

            <Link to="/" className="admin-card" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '0.5rem'
              }}>Browse Movies</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                View customer-facing movie listings
              </p>
            </Link>

            <Link to="/booking" className="admin-card" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '0.5rem'
              }}>My Bookings</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                View your booking history
              </p>
            </Link>
          </div>

          <div style={{
            background: 'rgba(70, 211, 105, 0.1)',
            border: '1px solid rgba(70, 211, 105, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'var(--success)',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontSize: '1rem' }}>
              💡 <strong>Tip:</strong> Start by adding movies, then create theatres, and finally schedule shows!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
