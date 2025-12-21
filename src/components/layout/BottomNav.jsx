import React from 'react';
import { Home, Search, Library, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const navItems = [
    { icon: Home, label: 'Feed', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Library', path: '/library' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="glass-panel" style={{
      height: 'var(--bottom-nav-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      borderTop: '1px solid var(--glass-border)',
      background: '#0a0a0a', /* Solid background behind glass for readability */
    }}>
      {navItems.map((item) => (
        <NavLink 
          key={item.label} 
          to={item.path}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            transition: 'color 0.2s ease',
            fontSize: '10px',
            fontWeight: 500
          })}
        >
          <item.icon size={24} strokeWidth={2} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;
