import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useCart } from '../../context/CartContext';
import LicenseModal from '../marketplace/LicenseModal';

const HeroControls = ({ beat, playlist = [] }) => {
  const { 
    currentTrack, isPlaying, playTrack, togglePlay, 
    currentTime, duration, seek, isLooping, toggleLoop,
    volume, setVolume, playNext, playPrev 
  } = useAudio();

  const { addToCart } = useCart();
  const [showLicense, setShowLicense] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  const isCurrent = currentTrack?.id === beat.id;
  const activePlaying = isCurrent && isPlaying;

  useEffect(() => {
    if (!isSeeking) {
      setSeekValue(currentTime);
    }
  }, [currentTime, isSeeking]);

  const handlePlayClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(beat, playlist);
    }
  };

  const handleBuy = () => {
    setShowLicense(true);
  };

  const handleSelectLicense = (license) => {
    addToCart(beat, license);
    setShowLicense(false);
  };

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

  return (
    <div style={{ flexShrink: 0, width: '100%', padding: '0 16px' }}>
        
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

      {/* Progress Bar */}
      <div style={{ marginBottom: '32px' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <span>{formatTime(seekValue)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '32px' }}>
        <button onClick={playPrev} style={{ 
            color: 'white', background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px'
        }}>
          <SkipBack size={32} fill="currentColor" />
        </button>
        
        <button 
          onClick={handlePlayClick}
          style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'white', color: 'black', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 24px rgba(255,255,255,0.25)', border: 'none', cursor: 'pointer'
          }}
        >
          {activePlaying ? (
            <Pause size={36} fill="currentColor" />
          ) : (
            <Play size={36} fill="currentColor" style={{ marginLeft: '4px' }} />
          )}
        </button>

        <button onClick={playNext} style={{ 
            color: 'white', background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px'
        }}>
            <SkipForward size={32} fill="currentColor" />
        </button>
      </div>

      {/* Buy Button */}
      <button 
        onClick={handleBuy}
        style={{
          width: '100%', height: '56px', borderRadius: '28px', 
          background: 'var(--accent-primary)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', fontWeight: 700,
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
          marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px'
        }}
      >
        Buy from ${beat.price}
      </button>

      {/* Loop & Volume */}
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
              type="range" min="0" max="1" step="0.05" value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              style={{
                width: '80px', height: '4px', background: 'var(--bg-tertiary)',
                borderRadius: '2px', appearance: 'none', cursor: 'pointer'
              }}
            />
          </div>
      </div>

      <LicenseModal 
        isOpen={showLicense} 
        onClose={() => setShowLicense(false)} 
        beat={beat}
        onSelect={handleSelectLicense}
      />
      
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 12px; width: 12px;
          border-radius: 50%; background: #fff; margin-top: -4px;
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%; height: 4px; cursor: pointer;
          background: transparent; border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default HeroControls;
