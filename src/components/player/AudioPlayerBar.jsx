import React from 'react';
import { Play, Pause, ChevronUp } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

const AudioPlayerBar = () => {
  const { currentTrack, isPlaying, togglePlay } = useAudio();

  if (!currentTrack) return null;

  return (
    <div className="glass-panel" style={{
      height: 'var(--player-height)',
      margin: '0 10px 10px 10px',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '12px',
      background: 'rgba(20, 20, 20, 0.95)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Cover Art */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '8px',
        backgroundColor: '#333',
        backgroundImage: `url(${currentTrack.cover})`,
        backgroundSize: 'cover',
        flexShrink: 0
      }} />
      
      {/* Track Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ 
          fontSize: '14px', 
          fontWeight: 600, 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          {currentTrack.title}
        </h4>
        <p style={{ 
          fontSize: '12px', 
          color: 'var(--text-secondary)',
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          {currentTrack.producer}
        </p>
      </div>
      
      {/* Controls */}
      <button onClick={togglePlay} style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'var(--text-primary)',
        color: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
      </button>
    </div>
  );
};

export default AudioPlayerBar;
