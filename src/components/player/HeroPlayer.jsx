import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, ShoppingCart, Share2, Heart } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useCart } from '../../context/CartContext';
import LicenseModal from '../marketplace/LicenseModal';

const HeroPlayer = ({ beat }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const { addToCart } = useCart();
  const [showLicense, setShowLicense] = useState(false);

  // If this beat is playing, show its state. Otherwise static.
  const isCurrent = currentTrack?.id === beat.id;
  const activePlaying = isCurrent && isPlaying;

  const handlePlayClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(beat);
    }
  };

  const handleBuy = () => {
    setShowLicense(true);
  };

  const handleSelectLicense = (license) => {
    addToCart(beat, license);
    setShowLicense(false);
  };

  return (
    <div style={{ padding: '0 0 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Large Cover Art area */}
      <div style={{
        width: '100%',
        aspectRatio: '1',
        borderRadius: '24px',
        overflow: 'hidden',
        marginBottom: '24px',
        boxShadow: '0 20px 50px rgba(124, 58, 237, 0.3)', // Neon glow
        position: 'relative'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${beat.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
      </div>

      {/* Track Info */}
      <div style={{ width: '100%', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1.2 }}>{beat.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{beat.bpm} BPM • {beat.key}</p>
          </div>
          <button style={{ padding: '8px', background: 'var(--glass-bg)', borderRadius: '50%' }}>
            <Heart size={20} color={activePlaying ? 'var(--accent-secondary)' : 'white'} />
          </button>
        </div>
      </div>

      {/* Waveform / Progress (Mock) */}
      <div style={{ 
        width: '100%', 
        height: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '3px',
        marginBottom: '24px',
        opacity: 0.8
      }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} style={{ 
            flex: 1, 
            background: i < 15 ? 'var(--accent-primary)' : 'var(--glass-border)',
            height: `${Math.random() * 100}%`,
            borderRadius: '2px',
            transition: 'height 0.2s ease' 
          }} />
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '24px' }}>
        <button style={{ color: 'var(--text-secondary)' }}><SkipBack size={24} /></button>
        
        <button 
          onClick={handlePlayClick}
          style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: 'var(--text-primary)', 
            color: 'var(--bg-primary)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(255,255,255,0.3)'
          }}
        >
          {activePlaying ? (
            <Pause size={28} fill="currentColor" />
          ) : (
            <Play size={28} fill="currentColor" style={{ marginLeft: '4px' }} />
          )}
        </button>

        <button style={{ color: 'var(--text-secondary)' }}><SkipForward size={24} /></button>
      </div>

      {/* Layout: Buy Button Frame */}
      <button 
        onClick={handleBuy}
        style={{
          width: '100%',
          padding: '18px',
          borderRadius: '16px',
          background: 'var(--bg-primary)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)' 
        }}
      > 
        <span style={{ fontWeight: 700, fontSize: '16px' }}>Buy License</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-primary)', padding: '6px 14px', borderRadius: '12px', fontSize: '14px', fontWeight: 600 }}>
          <span>From ${beat.price}</span>
          <ShoppingCart size={16} />
        </div>
      </button>

      <LicenseModal 
        isOpen={showLicense} 
        onClose={() => setShowLicense(false)} 
        beat={beat}
        onSelect={handleSelectLicense}
      />
    </div>
  );
};

export default HeroPlayer;
