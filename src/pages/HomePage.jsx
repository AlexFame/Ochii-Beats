import React, { useState, useEffect } from 'react';
import BeatCard from '../components/marketplace/BeatCard';
import HeroPlayer from '../components/player/HeroPlayer';
import { useAudio } from '../context/AudioContext';

const MOCK_BEATS = [
  {
    id: 1,
    title: 'Midnight Drive',
    producer: 'Prod. SkyHigh',
    bpm: 140,
    key: 'Cm',
    price: 29.99,
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600&h=600&fit=crop',
    tags: ['Trap', 'Dark', 'Drake'],
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 2,
    title: 'Summer Vibes',
    producer: 'BeatsByDre (Fake)',
    bpm: 98,
    key: 'Gmaj',
    price: 35.00,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop',
    tags: ['Pop', 'Summer', 'Guitar'],
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 3,
    title: 'Hard Hitter',
    producer: '808MafiaClone',
    bpm: 155,
    key: 'F#m',
    price: 19.99,
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop',
    tags: ['Drill', 'Aggressive', 'UK'],
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: 4,
    title: 'Neon Pulse',
    producer: 'SynthWaveKing',
    bpm: 128,
    key: 'Am',
    price: 24.99,
    cover: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&h=600&fit=crop',
    tags: ['Synthwave', 'Retro', '80s'],
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  }
];

const HomePage = () => {
  const { currentTrack } = useAudio();
  const [featuredBeat, setFeaturedBeat] = useState(MOCK_BEATS[0]);

  // Sync featured beat with global player if something is playing
  useEffect(() => {
    if (currentTrack) {
      // Find full beat object if needed, or just use currentTrack
      const found = MOCK_BEATS.find(b => b.id === currentTrack.id);
      if (found) setFeaturedBeat(found);
    }
  }, [currentTrack]);

  return (
    <div style={{ paddingBottom: '20px' }}>
      
      {/* Hero Section */}
      <HeroPlayer beat={featuredBeat} />

      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', marginTop: '16px' }}>More Beats</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {MOCK_BEATS.map(beat => (
          <BeatCard key={beat.id} beat={beat} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
