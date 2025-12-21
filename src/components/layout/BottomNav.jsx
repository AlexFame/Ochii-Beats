import React from 'react';
import { Home, Search, Library, User, Upload } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const navItems = [
    { icon: Home, label: 'Feed', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Library', path: '/library' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: '430px',
      height: '72px',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 8px',
      borderRadius: '28px',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(30px) saturate(180%)',
      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
    }}>
      {navItems.map((item) => (
        <NavLink 
          key={item.label} 
          to={item.path}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            height: '100%',
            position: 'relative',
            color: isActive ? 'white' : 'var(--text-tertiary)',
            transition: 'all 0.4s var(--ease-spring)',
            opacity: isActive ? 1 : 0.6,
            transform: isActive ? 'translateY(-2px)' : 'none'
          })}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  inset: '8px',
                  borderRadius: '20px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                  zIndex: -1,
                  boxShadow: '0 0 20px var(--accent-primary)',
                  opacity: 0.3
                }} />
              )}
              <item.icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
                color={isActive ? 'var(--accent-secondary)' : 'currentColor'}
                style={{ 
                  filter: isActive ? 'drop-shadow(0 0 8px var(--accent-primary))' : 'none',
                  transition: 'all 0.3s'
                }}
              />
              <span style={{ 
                fontSize: '10px', 
                fontWeight: isActive ? 600 : 500,
                letterSpacing: '0.3px'
              }}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;
