import React from 'react';
import HeroCover from './HeroCover';
import HeroControls from './HeroControls';
import { useAudio } from '../../context/AudioContext';

const HeroPlayer = ({ beat, playlist = [] }) => {
  const { playNext, playPrev } = useAudio();

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'flex-start',
      paddingBottom: '24px',
      minHeight: '85vh',
      width: '100%'
    }}>
      
      {/* Cover Art - Handles Swiping */}
      <HeroCover 
        beat={beat} 
        onNext={playNext} 
        onPrev={playPrev} 
      />

      {/* Info & Controls */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <HeroControls beat={beat} playlist={playlist} />
      </div>

    </div>
  );
};

export default HeroPlayer;
