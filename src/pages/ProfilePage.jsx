import React, { useState, useEffect } from 'react';
import { User, LogOut, Check, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const adminSession = localStorage.getItem('isAdmin');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = () => {
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    setPassword('');
  };

  return (
    <div style={{ padding: '16px', paddingBottom: '100px', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>Profile</h1>

      {!isAdmin ? (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', textAlign: 'center' }}>
          <User size={48} color="var(--accent-primary)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Admin Access</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
            Enter your password to access admin features.
          </p>
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid var(--glass-border)',
              background: 'var(--bg-secondary)',
              color: 'white',
              marginBottom: '12px',
              outline: 'none'
            }}
          />
          {error && <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}
          
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: 'var(--accent-primary)',
              color: 'white',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '50%', 
              background: 'var(--accent-primary)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center' 
            }}>
              <User size={32} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Admin User</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontSize: '14px' }}>
                <Check size={14} /> Verified Owner
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/upload" style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '16px', borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              textDecoration: 'none', color: 'white'
            }}>
              <div style={{ 
                padding: '10px', borderRadius: '10px', 
                background: 'rgba(124, 58, 237, 0.2)', color: 'var(--accent-primary)' 
              }}>
                <Upload size={20} />
              </div>
              <span style={{ fontWeight: 600 }}>Upload New Beat</span>
            </Link>

            <button 
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px', borderRadius: '16px',
                background: 'rgba(255, 59, 48, 0.1)',
                border: 'none', color: '#ff3b30',
                width: '100%', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <div style={{ 
                padding: '10px', borderRadius: '10px', 
                background: 'rgba(255, 59, 48, 0.2)' 
              }}>
                <LogOut size={20} />
              </div>
              <span style={{ fontWeight: 600 }}>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
