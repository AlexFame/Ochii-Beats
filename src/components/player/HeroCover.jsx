import React from 'react';
import { motion, useAnimation } from 'framer-motion';

const HeroCover = ({ beat, onNext, onPrev }) => {
  const controls = useAnimation();

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x < -threshold) {
      if (onNext) onNext();
    } else if (info.offset.x > threshold) {
      if (onPrev) onPrev();
    }
    controls.start({ x: 0 });
  };

  return (
    <motion.div 
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      animate={controls}
        width: '100vw', 
        maxWidth: '430px',
        marginLeft: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '24px',
        aspectRatio: '1',
        borderBottomLeftRadius: '32px',
        borderBottomRightRadius: '32px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        position: 'relative',
        cursor: 'grab',
        touchAction: 'none',
        zIndex: 0,
        flexShrink: 0,
        left: 0 // Ensure no offset
      }}>
      <div style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url(${beat.cover})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        pointerEvents: 'none'
      }} />
      
      {/* Gradient Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
        pointerEvents: 'none'
      }} />
    </motion.div>
  );
};

export default HeroCover;
