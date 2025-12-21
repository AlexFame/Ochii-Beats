import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]); // Store list of tracks for next/prev
  
  // Audio State
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLooping, setIsLooping] = useState(false);

  const audioRef = useRef(new Audio());
  
  // Init Audio Events
  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [isLooping, playlist, currentTrack]); // Re-bind when dependencies change

  // Handle Play/Pause
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle Loop State
  useEffect(() => {
    audioRef.current.loop = isLooping;
  }, [isLooping]);

  // Handle Volume
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Handle Track Changes
  useEffect(() => {
    if (currentTrack) {
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

  const playTrack = (track, list = []) => {
    if (list.length > 0) setPlaylist(list);
    
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleLoop = () => setIsLooping(!isLooping);

  const playNext = () => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playTrack(playlist[nextIndex]);
  };

  const playPrev = () => {
    if (!currentTrack || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(playlist[prevIndex]);
  };

  return (
    <AudioContext.Provider value={{ 
      isPlaying, 
      currentTrack, 
      togglePlay, 
      playTrack,
      currentTime,
      duration,
      seek,
      volume,
      setVolume,
      isLooping,
      toggleLoop,
      playNext,
      playPrev
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
