import React, { useState } from 'react';
import { Play, Pause, ShoppingCart } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useCart } from '../../context/CartContext';
import LicenseModal from './LicenseModal';

const BeatCard = ({ beat, playlist = [] }) => {
  const { currentTrack, isPlaying, playTrack } = useAudio();
  const { addToCart } = useCart();
  const [showLicense, setShowLicense] = useState(false);
  
  const isCurrent = currentTrack?.id === beat.id;
  
  const handleBuy = (e) => {
    e.stopPropagation();
    setShowLicense(true);
  };

  const handleSelectLicense = (license) => {
    addToCart(beat, license);
    setShowLicense(false);
  };
  
  return (
    <>
      <div 
        className="glass-panel" 
        onClick={() => playTrack(beat, playlist)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px',
          gap: '16px',
          borderRadius: '20px',
          marginBottom: '12px',
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.05)',
          background: isCurrent ? 'rgba(124, 58, 237, 0.15)' : 'var(--glass-bg)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Active Glow Indicator */}
        {isCurrent && (
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: '4px',
            background: 'var(--accent-primary)',
            boxShadow: '0 0 12px var(--accent-primary)'
          }} />
        )}

        {/* Cover Art */}
        <div style={{
          position: 'relative',
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          backgroundImage: `url(${beat.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: isCurrent ? 'rgba(0,0,0,0.4)' : 'transparent',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}>
            {isCurrent && (
              isPlaying ? <Pause size={20} fill="white" color="white" /> : <Play size={20} fill="white" color="white" />
            )}
          </div>
        </div>
        
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3 style={{ 
            fontSize: '15px', 
            fontWeight: 600, 
            color: isCurrent ? 'var(--accent-secondary)' : 'white',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: '0.2px'
          }}>
            {beat.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '2px 6px', 
              borderRadius: '6px', 
              fontSize: '11px',
              fontWeight: 500
            }}>
              {beat.bpm} BPM
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span style={{
               background: 'rgba(255,255,255,0.1)',
               padding: '2px 6px',
               borderRadius: '6px',
               fontSize: '11px', 
               fontWeight: 500
            }}>
              {beat.key}
            </span>
          </div>
        </div>
        
        {/* Buy Button */}
        <button 
          onClick={handleBuy}
          style={{
            background: 'var(--accent-primary)',
            padding: '8px 14px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'white',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
            transition: 'transform 0.2s',
            zIndex: 2
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span>${beat.price}</span>
          <ShoppingCart size={14} />
        </button>
      </div>

      <LicenseModal 
        isOpen={showLicense} 
        onClose={() => setShowLicense(false)} 
        beat={beat}
        onSelect={handleSelectLicense}
      />
    </>
  );
};

export default BeatCard;
