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
      <div className="glass-panel" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        gap: '12px',
        borderRadius: 'var(--radius-md)',
        transition: 'transform 0.1s ease',
      }}>
        {/* Cover / Play Button */}
        <div 
          onClick={() => playTrack(beat, playlist)}
          style={{
            position: 'relative',
            width: '64px',
            height: '64px',
            borderRadius: '8px',
            backgroundImage: `url(${beat.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isCurrent && isPlaying ? (
              <Pause size={24} fill="white" color="white" />
            ) : (
              <Play size={24} fill="white" color="white" style={{ marginLeft: '2px' }} />
            )}
          </div>
        </div>
        
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {beat.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 500 }}>{beat.bpm} BPM</span>
            <span>•</span>
            <span style={{ fontWeight: 500 }}>{beat.key}</span>
            <span>•</span>
            <span className="text-gradient" style={{ fontWeight: 600 }}>#{beat.tags[0]}</span>
          </div>
        </div>
        
        {/* Action */}
        <button 
          onClick={handleBuy}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '8px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--accent-primary)'
          }}>
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
