import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from '../api/axios';
import '../styles/realtime.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('/auth/login', credentials);
      
      login(data.user, data.token);

      // Redirect based on role
      if (data.user.role === 'TENANT_ADMIN' || data.user.role === 'SUPER_ADMIN' || data.user.role === 'QA_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="animated-bg"></div>
      <div className="auth-container">
        <div className="auth-form" style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            🎬 Welcome Back
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="email"
                placeholder="Email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(220, 53, 69, 0.2)',
                color: '#ff6b6b',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid rgba(220, 53, 69, 0.3)'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-book"
              style={{ marginTop: '1rem' }}
            >
              {loading ? '⏳ Logging in...' : '🚀 Login'}
            </button>
          </form>

          <p style={{
            textAlign: 'center',
            marginTop: '2rem',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            Don't have an account?{' '}
            <Link to="/register" style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
