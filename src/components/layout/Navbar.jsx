import React from 'react';
import { Music2, ShoppingBag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const location = useLocation();

  if (location.pathname === '/') return null;

  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'var(--header-height)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Music2 size={24} color="var(--accent-primary)" />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            BEAT<span className="text-gradient">STARS</span>
          </h1>
        </Link>
        
        <Link to="/cart" style={{ position: 'relative' }}>
          <ShoppingBag size={24} />
          {cartCount > 0 && (
            <span style={{ 
              position: 'absolute', 
              top: -5, 
              right: -5, 
              background: 'var(--accent-secondary)', 
              width: '16px', 
              height: '16px', 
              borderRadius: '50%', 
              fontSize: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
