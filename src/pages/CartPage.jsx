import React from 'react';
import { Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    // Mock Payment
    const confirm = window.confirm(`Pay $${cartTotal.toFixed(2)}?`);
    if (confirm) {
      alert("Payment Successful! Files sent to your email.");
      clearCart();
      navigate('/');
    }
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      {/* Header with Back Button */}
      <header style={{ 
        display: 'flex', 
        alignItems: 'bottom', 
        gap: '12px', 
        marginBottom: '24px',
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '16px'
      }}>
        <button onClick={() => navigate(-1)} style={{ padding: '4px' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Your Cart ({cartItems.length})</h2>
      </header>
      
      {cartItems.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '48px 0', 
          color: 'var(--text-secondary)' 
        }}>
          <p style={{ marginBottom: '16px' }}>Your cart is empty.</p>
          <button 
            onClick={() => navigate('/')}
            className="text-gradient"
            style={{ fontWeight: 600 }}
          >
            Browse Beats
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {cartItems.map((item) => (
              <div key={item.id} className="glass-panel" style={{
                padding: '16px',
                borderRadius: '16px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '8px',
                  backgroundImage: `url(${item.beat.cover})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0
                }} />
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {item.beat.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--accent-primary)', fontWeight: 500 }}>
                    {item.license.name}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '16px' }}>${item.license.price}</span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{ color: 'var(--text-tertiary)', padding: '4px' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary & Checkout */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderRadius: '24px',
            background: 'linear-gradient(180deg, var(--glass-bg) 0%, rgba(124, 58, 237, 0.05) 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <span>Fees</span>
              <span>$0.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '20px', fontWeight: 700 }}>
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                background: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                fontWeight: 700,
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Checkout</span>
              <CreditCard size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
