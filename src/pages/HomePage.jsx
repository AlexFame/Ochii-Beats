import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import BeatCard from '../components/marketplace/BeatCard';
import HeroPlayer from '../components/player/HeroPlayer';
import { useAudio } from '../context/AudioContext';

const MOCK_BEATS = [
  {
    id: 1,
    title: 'Midnight Drive',
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
    bpm: 155,
    key: 'F#m',
    price: 19.99,
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop',
    tags: ['Drill', 'Aggressive', 'UK'],
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  }
];

const HomePage = () => {
  const [beats, setBeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeats();
  }, []);

  const fetchBeats = async () => {
    try {
      const { data, error } = await supabase
        .from('beats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        setBeats(MOCK_BEATS);
      } else {
        setBeats(data);
      }
    } catch (error) {
      console.error('Error fetching beats:', error);
      setBeats(MOCK_BEATS);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingBottom: '100px',
        color: 'var(--text-secondary)'
      }}>
        Loading...
      </div>
    );
  }

  const heroBeat = beats.length > 0 ? beats[0] : MOCK_BEATS[0];

  return (
    <div style={{ paddingBottom: '20px' }}>
      <HeroPlayer beat={heroBeat} playlist={beats} />
      
      <div className="container" style={{ marginTop: '0', padding: '0 16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', marginTop: '0' }}>More Beats</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
          {beats.slice(1).map(beat => (
            <BeatCard key={beat.id} beat={beat} playlist={beats} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
