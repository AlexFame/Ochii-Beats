import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(new Audio());
  
  // Handle Play/Pause
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle Track Changes
  useEffect(() => {
    if (currentTrack) {
      // In a real app, this would be the preview URL
      // Using a sample MP3 for demo purposes if no preview provided
      const streamUrl = currentTrack.audio || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      
      if (audioRef.current.src !== streamUrl) {
        audioRef.current.src = streamUrl;
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
      }
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!currentTrack) return;
    setIsPlaying(!isPlaying);
  };

  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, currentTrack, togglePlay, playTrack }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
