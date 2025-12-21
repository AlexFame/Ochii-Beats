import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import AudioPlayerBar from '../player/AudioPlayerBar';

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div style={{ 
      minHeight: '100vh', 
      paddingBottom: 'calc(var(--player-height) + var(--bottom-nav-height) + 20px)' 
    }}>
      <Navbar />
      <main className="container" style={{ 
        paddingTop: isHome ? '0' : 'var(--header-height)',
        paddingLeft: isHome ? '0' : '16px',
        paddingRight: isHome ? '0' : '16px'
      }}>
        <Outlet />
      </main>
      
      {/* Hide Mini Player on Home Page since Hero Player is active there */}
      {!isHome && <AudioPlayerBar />}
      <BottomNav />
    </div>
  );
};

export default Layout;
