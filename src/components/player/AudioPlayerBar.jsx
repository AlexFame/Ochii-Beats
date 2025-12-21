import React from 'react';
import { Play, Pause, ChevronUp } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const AudioPlayerBar = () => {
  const { currentTrack, isPlaying, togglePlay } = useAudio();

  if (!currentTrack) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '108px', // 24px (nav bottom) + 72px (nav height) + 12px (gap)
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: '430px',
      height: '64px',
      zIndex: 90,
      borderRadius: '32px',
      display: 'flex',
      alignItems: 'center',
      padding: '6px 6px 6px 16px',
      gap: '12px',
      background: 'rgba(20, 20, 22, 0.85)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.5)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Cover Art / Spinning Vinyl Effect */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#333',
        backgroundImage: `url(${currentTrack.cover})`,
        backgroundSize: 'cover',
        flexShrink: 0,
        animation: isPlaying ? 'spin 10s linear infinite' : 'none',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          background: '#1a1a1a',
          borderRadius: '50%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: '2px solid rgba(255,255,255,0.2)'
        }} />
      </div>
      
      {/* Track Info */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h4 style={{ 
          fontSize: '14px', 
          fontWeight: 600, 
          color: 'white',
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          marginBottom: '2px'
        }}>
          {currentTrack.title}
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            borderRadius: '4px', 
            background: 'var(--accent-primary)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <div style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'white',
              animation: isPlaying ? 'pulse-glow 1s infinite' : 'none'
            }} />
          </div>
          <p style={{ 
            fontSize: '12px', 
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis' 
          }}>
            Now Playing
          </p>
        </div>
      </div>
      
      {/* Controls */}
      <button 
        onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'white',
          color: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(255,255,255,0.2)',
          transition: 'transform 0.2s',
          flexShrink: 0
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isPlaying ? <Pause size={22} fill="black" /> : <Play size={22} fill="black" style={{ marginLeft: '2px' }} />}
      </button>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AudioPlayerBar;
