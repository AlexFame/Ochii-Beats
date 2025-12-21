import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, ShoppingCart, Share2, Heart, RefreshCw, Volume2, Volume1, VolumeX } from 'lucide-react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { useAudio } from '../../context/AudioContext';
import { useCart } from '../../context/CartContext';
import LicenseModal from '../marketplace/LicenseModal';

const HeroPlayer = ({ beat }) => {
  const { 
    currentTrack, isPlaying, playTrack, togglePlay, 
    currentTime, duration, seek, isLooping, toggleLoop,
    volume, setVolume, playNext, playPrev 
  } = useAudio();
  
  const { addToCart } = useCart();
  const [showLicense, setShowLicense] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  // Animation controls for swipe
  const controls = useAnimation();

  // If this beat is playing, show its state. Otherwise static.
  const isCurrent = currentTrack?.id === beat.id;
  const activePlaying = isCurrent && isPlaying;
  
  // Update local seek value when not manually seeking
  useEffect(() => {
    if (!isSeeking) {
      setSeekValue(currentTime);
    }
  }, [currentTime, isSeeking]);

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

  // Format time (mm:ss)
  const formatTime = (time) => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeekChange = (e) => {
    setSeekValue(Number(e.target.value));
  };

  const handleSeekStart = () => setIsSeeking(true);
  
  const handleSeekEnd = () => {
    seek(seekValue);
    setIsSeeking(false);
  };

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x < -threshold) {
      playNext();
    } else if (info.offset.x > threshold) {
      playPrev();
    }
    controls.start({ x: 0 });
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'space-between',
      paddingBottom: '24px',
      minHeight: '85vh'
    }}>
      
      {/* Cover Art - Swipe enabled */}
      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{
          width: '100%',
          aspectRatio: '1',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          position: 'relative',
          cursor: 'grab',
          touchAction: 'none' 
        }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${beat.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          pointerEvents: 'none' // Let drag handle events
        }} />
      </motion.div>

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

        {/* Improved Progress Bar (replacing waveform) */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={seekValue}
            onChange={handleSeekChange}
            onMouseDown={handleSeekStart}
            onTouchStart={handleSeekStart}
            onMouseUp={handleSeekEnd}
            onTouchEnd={handleSeekEnd}
            style={{
              width: '100%',
              height: '4px',
              background: `linear-gradient(to right, var(--text-primary) ${(seekValue / (duration || 1)) * 100}%, var(--glass-border) 0%)`,
              borderRadius: '2px',
              appearance: 'none',
              outline: 'none',
              cursor: 'pointer'
            }}
            className="seek-slider" 
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span>{formatTime(seekValue)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Player Controls Row */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
          <button onClick={playPrev} style={{ 
            width: '48px', height: '48px', borderRadius: '12px', 
            background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: 'white', backdropFilter: 'blur(10px)'
          }}>
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={handlePlayClick}
            style={{ 
              width: '72px', 
              height: '72px', 
              borderRadius: '24px', 
              background: 'white', 
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

          <button onClick={playNext} style={{ 
            width: '48px', height: '48px', borderRadius: '12px', 
            background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: 'white', backdropFilter: 'blur(10px)'
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
            background: 'var(--accent-primary)', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 700,
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Buy from ${beat.price}
        </button>

        {/* Secondary Actions (Loop, Vol) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px' }}>
           <button 
              onClick={toggleLoop}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isLooping ? 'var(--accent-primary)' : 'var(--text-secondary)', transition: 'color 0.2s' }}>
              <RefreshCw size={18} />
              <span style={{ fontSize: '13px', fontWeight: 500 }}>Loop</span>
           </button>

           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {volume === 0 ? <VolumeX size={18} color="var(--text-secondary)" /> : <Volume2 size={18} color="var(--text-secondary)" />}
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{
                  width: '80px',
                  height: '4px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '2px',
                  appearance: 'none', // Reset default appearance
                  cursor: 'pointer'
                }}
              />
           </div>
        </div>

      </div>

      <LicenseModal 
        isOpen={showLicense} 
        onClose={() => setShowLicense(false)} 
        beat={beat}
        onSelect={handleSelectLicense}
      />
      
      <style>{`
        /* Custom default range input styling */
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #fff;
          margin-top: -4px;
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          cursor: pointer;
          background: transparent; 
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default HeroPlayer;
