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
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between',
      paddingBottom: '24px',
      minHeight: '85vh' // Ensure it takes up most of the screen initially
    }}>
      
      {/* Cover Art - Flex Grow to fill space */}
      <div style={{
        width: '100%',
        aspectRatio: '1',
        borderRadius: '24px',
        overflow: 'hidden',
        marginBottom: '20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        position: 'relative',
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
      <div style={{ flexShrink: 0, width: '100%' }}>
        
        {/* Title & Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '2px' }}>{beat.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{beat.bpm} BPM • {beat.key}</p>
          </div>
          <div style={{ background: '#000', borderRadius: '12px', padding: '4px 12px', color: 'white', fontSize: '12px', fontWeight: 600 }}>
             PREVIEW
          </div>
        </div>

        {/* Waveform Visualizer */}
        <div style={{ 
          width: '100%', 
          height: '32px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '3px',
          marginBottom: '20px',
          opacity: 0.6
        }}>
          {Array.from({ length: 45 }).map((_, i) => (
            <div key={i} style={{ 
              flex: 1, 
              background: i < 15 ? 'var(--text-primary)' : 'var(--glass-border)',
              height: `${20 + Math.random() * 80}%`, 
              borderRadius: '2px',
            }} />
          ))}
        </div>

        {/* Player Controls Row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
          <button style={{ 
            width: '48px', height: '48px', borderRadius: '12px', 
            background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', // Lighter background
            color: 'white'
          }}>
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={handlePlayClick}
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '20px', 
              background: 'white', // Keep play button white for max contrast
              color: 'black',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(255,255,255,0.2)'
            }}
          >
            {activePlaying ? (
              <Pause size={32} fill="currentColor" />
            ) : (
              <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />
            )}
          </button>

          <button style={{ 
            width: '48px', height: '48px', borderRadius: '12px', 
            background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', // Lighter background
            color: 'white'
          }}>
             <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        {/* Large Buy Button */}
        <button 
          onClick={handleBuy}
          style={{
            width: '100%',
            height: '56px',
            borderRadius: '28px', 
            background: 'var(--accent-primary)', // Purple accent
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 700,
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)', // Purple glow
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Buy from ${beat.price}
        </button>

        {/* Secondary Actions (Loop, Vol) - Optional, mimicking screenshot layout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <RefreshCw size={16} />
              <span style={{ fontSize: '13px' }}>Loop</span>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '13px' }}>Vol</span>
              <div style={{ width: '80px', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', position: 'relative' }}>
                <div style={{ width: '70%', height: '100%', background: 'white', borderRadius: '2px' }} />
                <div style={{ width: '12px', height: '12px', background: 'white', borderRadius: '50%', position: 'absolute', top: '-4px', left: '65%' }} />
              </div>
           </div>
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
