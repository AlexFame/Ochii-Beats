import React from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LICENSES = [
  {
    id: 'mp3',
    name: 'MP3 Lease',
    price: 29.99,
    features: ['MP3 File', 'Sell up to 5,000 units', 'Tag-free']
  },
  {
    id: 'wav',
    name: 'WAV Lease',
    price: 49.99,
    features: ['WAV + MP3 File', 'Sell up to 10,000 units', 'Tag-free']
  },
  {
    id: 'trackout',
    name: 'Trackout Lease',
    price: 99.99,
    features: ['Trackout Stems', 'Unlimited sales', 'Broadcast rights']
  },
  {
    id: 'exclusive',
    name: 'Exclusive Rights',
    price: 499.99,
    features: ['Full Ownership', 'Removed from store', 'Unlimited usage']
  }
];

const LicenseModal = ({ isOpen, onClose, beat, onSelect }) => {
  if (!isOpen || !beat) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}>
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)'
          }}
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="glass-panel"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '600px',
            background: '#121212',
            borderTop: '1px solid var(--glass-border)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '24px',
            maxHeight: '85vh',
            overflowY: 'auto'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Choose License</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>for {beat.title}</p>
            </div>
            <button onClick={onClose} style={{ padding: '8px', background: 'var(--bg-tertiary)', borderRadius: '50%' }}>
              <X size={20} />
            </button>
          </div>

          {/* License Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {LICENSES.map((license) => (
              <div 
                key={license.id}
                onClick={() => onSelect(license)}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: license.id === 'exclusive' ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(236, 72, 153, 0.2))' : 'var(--bg-tertiary)',
                  border: license.id === 'exclusive' ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '16px' }}>{license.name}</h3>
                  <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--accent-primary)' }}>${license.price}</span>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {license.features.map((feature, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <Check size={12} color="var(--accent-secondary)" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LicenseModal;
