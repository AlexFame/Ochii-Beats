import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, ShoppingCart, Share2, Heart, RefreshCw } from 'lucide-react';
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
    <div style={{ 
      height: 'calc(100vh - var(--bottom-nav-height) - 40px)', // Full height minus nav and padding
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between',
      paddingBottom: '16px'
    }}>
      
      {/* Cover Art - Flex Grow to fill space */}
      <div style={{
        flex: 1,
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        marginBottom: '20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        position: 'relative',
        minHeight: '0' // Important for flex child scrolling/shrinking
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${beat.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
      </div>

      {/* Info & Controls Area */}
      <div style={{ flexShrink: 0 }}>
        
        {/* Title & Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{beat.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{beat.bpm} BPM • {beat.key}</p>
          </div>
          <button style={{ padding: '8px', background: 'var(--glass-bg)', borderRadius: '50%' }}>
            <Heart size={24} color={activePlaying ? 'var(--accent-secondary)' : 'white'} />
          </button>
        </div>

        {/* Waveform Visualizer */}
        <div style={{ 
          width: '100%', 
          height: '40px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '3px',
          marginBottom: '24px',
          opacity: 0.8
        }}>
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} style={{ 
              flex: 1, 
              background: i < 15 ? 'var(--accent-primary)' : 'var(--glass-border)',
              height: `${30 + Math.random() * 70}%`, // Dynamic looking height
              borderRadius: '2px',
            }} />
          ))}
        </div>

        {/* Player Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '24px' }}>
          <button style={{ color: 'var(--text-secondary)' }}><RefreshCw size={20} /></button>
          <button style={{ color: 'white' }}><SkipBack size={28} fill="currentColor" /></button>
          
          <button 
            onClick={handlePlayClick}
            style={{ 
              width: '72px', 
              height: '72px', 
              borderRadius: '50%', 
              background: 'white', 
              color: 'black',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255,255,255,0.2)'
            }}
          >
            {activePlaying ? (
              <Pause size={32} fill="currentColor" />
            ) : (
              <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />
            )}
          </button>

          <button style={{ color: 'white' }}><SkipForward size={28} fill="currentColor" /></button>
           {/* Placeholder for Loop/Shuffle if needed, using Buy for now? No, layout asks for clean player */}
           <button style={{ color: 'var(--text-secondary)' }}><Share2 size={20} /></button>
        </div>

      </div>

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
