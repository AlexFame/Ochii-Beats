import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Music, FileAudio, FolderArchive, Image as ImageIcon, X, Check, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const UploadPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [mp3File, setMp3File] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  
  const [metadata, setMetadata] = useState({
    title: '',
    bpm: '',
    key: '',
    price: '',
    tags: '',
    wavLink: '',
    zipLink: ''
  });

  // Check for admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('isAdmin');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleDrop = useCallback((e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (type === 'cover' && file.type.startsWith('image/')) setCoverFile(file);
    if (type === 'mp3' && (file.type === 'audio/mpeg' || file.name.endsWith('.mp3'))) setMp3File(file);
  }, []);

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'cover') setCoverFile(file);
    if (type === 'mp3') setMp3File(file);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '24px', fontWeight: 700 }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Please log in via the Profile page.</p>
        <Link to="/profile" style={{ 
          padding: '12px 24px', borderRadius: '16px',
          background: 'var(--accent-primary)', color: 'white', fontWeight: 600 
        }}>
          Go to Profile
        </Link>
      </div>
    );
  }

  const uploadFileToStorage = async (file, bucket, prefix = '') => {
    if (!file) return null;
    const ext = file.name.split('.').pop();
    const fileName = `${prefix}${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
      
    return publicUrl;
  };

  const handleSubmit = async () => {
    // Validation
    if (!metadata.title || !metadata.price || !coverFile || !mp3File) {
      alert('Please fill in Title, Price, Cover Art, and MP3 file (Required)');
      return;
    }

    setIsUploading(true);
    
    try {
      // 1. Upload Only Media Files
      const uploadPromises = [
        uploadFileToStorage(coverFile, 'covers', 'art_'),
        uploadFileToStorage(mp3File, 'beats', 'mp3_')
      ];

      const [coverUrl, mp3Url] = await Promise.all(uploadPromises);

      // 2. Insert into Database
      const { error: dbError } = await supabase
        .from('beats')
        .insert([{
          title: metadata.title,
          bpm: metadata.bpm ? parseInt(metadata.bpm) : null,
          key: metadata.key,
          price: parseFloat(metadata.price),
          tags: metadata.tags ? metadata.tags.split(',').map(t => t.trim()) : [],
          cover_url: coverUrl,
          audio_url: mp3Url,   // Main preview/MP3
          wav_url: metadata.wavLink,     // Telegram Link
          stems_url: metadata.zipLink  // Telegram Link
        }]);

      if (dbError) throw dbError;

      setUploadStatus('success');
      
      // Reset form
      setTimeout(() => {
        setUploadStatus(null);
        setCoverFile(null);
        setMp3File(null);
        setMetadata({ title: '', bpm: '', key: '', price: '', tags: '', wavLink: '', zipLink: '' });
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '120px', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
        <Link to="/profile" style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ArrowLeft size={20} color="white" />
        </Link>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Upload Beat</h1>
      </div>

      {/* Cover Upload Zone */}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, 'cover')}
        style={{
          width: '100%',
          aspectRatio: '1',
          borderRadius: '32px',
          border: '1px dashed rgba(255,255,255,0.2)',
          background: coverFile ? `url(${URL.createObjectURL(coverFile)}) center/cover` : 'rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: coverFile ? '0 10px 40px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        {!coverFile && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '20px', 
              background: 'var(--bg-tertiary)', margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}>
              <ImageIcon size={32} color="var(--text-secondary)" />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500 }}>Tap to add Cover Art</p>
          </div>
        )}
        
        <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, 'cover')} style={hiddenInputStyle} />
        
        {coverFile && (
          <button 
            onClick={(e) => { e.stopPropagation(); setCoverFile(null); }}
            style={{
              position: 'absolute', top: '16px', right: '16px', zIndex: 10,
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white'
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main Info Section */}
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginLeft: '4px', marginTop: '12px', color: 'var(--accent-secondary)' }}>Track Files</h2>
      
      {/* MP3 Upload */}
      <UploadSection 
        title="MP3 (Tagged/Preview)" 
        file={mp3File} 
        onDrop={(e) => handleDrop(e, 'mp3')} 
        onSelect={(e) => handleFileSelect(e, 'mp3')} 
        onRemove={() => setMp3File(null)}
        accept="audio/mpeg,.mp3"
        icon={<Music size={24} />}
        required
      />

      {/* WAV & ZIP Links */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <LinkInput 
          icon={<FileAudio size={20} />}
          label="WAV Source (Telegram)" 
          value={metadata.wavLink}
          onChange={(e) => setMetadata({...metadata, wavLink: e.target.value})}
          placeholder="Paste Link..."
        />
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
        <LinkInput 
          icon={<FolderArchive size={20} />}
          label="Trackouts Source (Telegram)" 
          value={metadata.zipLink}
          onChange={(e) => setMetadata({...metadata, zipLink: e.target.value})}
          placeholder="Paste Link..."
        />
      </div>

      {/* Metadata Form */}
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginLeft: '4px', marginTop: '12px', color: 'var(--accent-cyan)' }}>Details</h2>
      
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FloatingInput 
          label="Track Title" 
          value={metadata.title} 
          onChange={(e) => setMetadata({...metadata, title: e.target.value})} 
        />
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <FloatingInput 
            label="BPM" 
            type="number"
            value={metadata.bpm} 
            onChange={(e) => setMetadata({...metadata, bpm: e.target.value})} 
          />
          <FloatingInput 
            label="Key" 
            value={metadata.key} 
            onChange={(e) => setMetadata({...metadata, key: e.target.value})} 
          />
        </div>
        
        <FloatingInput 
          label="Price ($)" 
          type="number"
          value={metadata.price} 
          onChange={(e) => setMetadata({...metadata, price: e.target.value})} 
        />
        
        <FloatingInput 
          label="Tags" 
          value={metadata.tags} 
          onChange={(e) => setMetadata({...metadata, tags: e.target.value})} 
          placeholder="Trap, Dark, Piano"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isUploading}
        style={{
          width: '100%',
          height: '60px',
          borderRadius: '20px',
          background: uploadStatus === 'success' ? '#22c55e' : 'var(--accent-primary)',
          color: 'white',
          fontSize: '17px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '12px',
          opacity: isUploading ? 0.8 : 1,
          boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
          transition: 'all 0.3s'
        }}
      >
        {isUploading ? (
          <>
            <Loader2 className="spin" size={22} /> Uploading...
          </>
        ) : uploadStatus === 'success' ? (
          <>
            <Check size={24} /> Uploaded!
          </>
        ) : (
          'Publish Beat'
        )}
      </button>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
};

// Helper Components
const hiddenInputStyle = { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 5 };

const UploadSection = ({ title, file, onSelect, onRemove, accept, icon, required }) => (
  <div style={{
    position: 'relative',
    background: file ? 'rgba(124, 58, 237, 0.15)' : 'rgba(255,255,255,0.03)',
    borderRadius: '20px',
    padding: '16px',
    display: 'flex', alignItems: 'center', gap: '16px',
    border: file ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.3s'
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '14px',
      background: file ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: file ? 'white' : 'var(--text-secondary)'
    }}>
      {icon}
    </div>
    
    <div style={{ flex: 1 }}>
      <p style={{ fontWeight: 600, fontSize: '15px', color: 'white' }}>
        {file ? file.name : title} {required && !file && <span style={{color:'#ef4444'}}>*</span>}
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
        {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Tap to browse'}
      </p>
    </div>
    
    <input type="file" accept={accept} onChange={onSelect} style={hiddenInputStyle} />
    
    {file && (
      <button 
        onClick={(e) => { e.stopPropagation(); onRemove(); }} 
        style={{ zIndex: 10, padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '50%' }}
      >
        <X size={18} color="white" />
      </button>
    )}
  </div>
);

const LinkInput = ({ icon, label, value, onChange, placeholder }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ marginLeft: '4px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</label>
    <div style={{ 
      display: 'flex', gap: '12px', alignItems: 'center',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--glass-border)',
      borderRadius: '16px',
      padding: '4px 4px 4px 16px',
      height: '56px',
      transition: 'all 0.2s'
    }}>
      <div style={{ color: 'var(--text-secondary)' }}>
        {icon}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          flex: 1,
          height: '100%',
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '15px',
          outline: 'none',
          padding: 0
        }}
      />
    </div>
  </div>
);

const FloatingInput = ({ label, value, onChange, type = "text", placeholder }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
    <label style={{ marginLeft: '4px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        height: '56px',
        padding: '0 16px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--glass-border)',
        borderRadius: '16px',
        color: 'white',
        fontSize: '15px',
        fontWeight: 500,
        outline: 'none',
        transition: 'all 0.2s'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--accent-primary)';
        e.target.style.background = 'rgba(124, 58, 237, 0.05)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--glass-border)';
        e.target.style.background = 'var(--bg-secondary)';
      }}
    />
  </div>
);

export default UploadPage;
