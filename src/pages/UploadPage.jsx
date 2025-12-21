import React, { useState, useCallback } from 'react';
import { Upload, Music, FileAudio, FolderArchive, Image as ImageIcon, X, Check, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const UploadPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check for admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('isAdmin');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  const [coverFile, setCoverFile] = useState(null);
  const [mp3File, setMp3File] = useState(null);
  const [wavFile, setWavFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  
  const [metadata, setMetadata] = useState({
    title: '',
    bpm: '',
    key: '',
    price: '',
    tags: ''
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  if (!isAuthenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Please log in via the Profile page.</p>
        <a href="/profile" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold' }}>Go to Profile</a>
      </div>
    );
  }

  const handleDrop = useCallback((e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (type === 'cover' && file.type.startsWith('image/')) setCoverFile(file);
    if (type === 'mp3' && (file.type === 'audio/mpeg' || file.name.endsWith('.mp3'))) setMp3File(file);
    if (type === 'wav' && (file.type === 'audio/wav' || file.name.endsWith('.wav'))) setWavFile(file);
    if (type === 'zip' && (file.type === 'application/zip' || file.type.includes('compressed') || file.name.endsWith('.zip'))) setZipFile(file);
  }, []);

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'cover') setCoverFile(file);
    if (type === 'mp3') setMp3File(file);
    if (type === 'wav') setWavFile(file);
    if (type === 'zip') setZipFile(file);
  };

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
    // Validation: Title, Price, Cover, and at least MP3 are required
    if (!metadata.title || !metadata.price || !coverFile || !mp3File) {
      alert('Please fill in Title, Price, Cover Art, and MP3 file (Required)');
      return;
    }

    setIsUploading(true);
    
    try {
      // 1. Upload All Files Parallely
      const uploadPromises = [
        uploadFileToStorage(coverFile, 'covers', 'art_'),
        uploadFileToStorage(mp3File, 'beats', 'mp3_'),
        uploadFileToStorage(wavFile, 'beats', 'wav_'),
        uploadFileToStorage(zipFile, 'beats', 'stems_')
      ];

      const [coverUrl, mp3Url, wavUrl, stemsUrl] = await Promise.all(uploadPromises);

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
          wav_url: wavUrl,     // Untagged WAV
          stems_url: stemsUrl  // Trackouts ZIP
        }]);

      if (dbError) throw dbError;

      setUploadStatus('success');
      
      // Reset form
      setTimeout(() => {
        setUploadStatus(null);
        setCoverFile(null);
        setMp3File(null);
        setWavFile(null);
        setZipFile(null);
        setMetadata({ title: '', bpm: '', key: '', price: '', tags: '' });
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: '16px', paddingBottom: '100px', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Upload New Beat</h1>

      {/* Cover Upload Zone */}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, 'cover')}
        style={dropZoneStyle(!!coverFile)}
      >
        {!coverFile && (
          <>
            <ImageIcon size={48} color="var(--text-secondary)" style={{ marginBottom: '12px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Drag Cover Art here</p>
          </>
        )}
        <input type="file" accept="image/*" onChange={(e) => handleFileSelect(e, 'cover')} style={hiddenInputStyle} />
        {coverFile && <FilePreview file={coverFile} onRemove={() => setCoverFile(null)} type="image" />}
      </div>

      {/* MP3 Upload (Required) */}
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

      {/* WAV Upload (Optional) */}
      <UploadSection 
        title="WAV (Untagged)" 
        file={wavFile} 
        onDrop={(e) => handleDrop(e, 'wav')} 
        onSelect={(e) => handleFileSelect(e, 'wav')} 
        onRemove={() => setWavFile(null)}
        accept="audio/wav,.wav"
        icon={<FileAudio size={24} />}
      />

      {/* ZIP/Stems Upload (Optional) */}
      <UploadSection 
        title="Trackouts (ZIP)" 
        file={zipFile} 
        onDrop={(e) => handleDrop(e, 'zip')} 
        onSelect={(e) => handleFileSelect(e, 'zip')} 
        onRemove={() => setZipFile(null)}
        accept=".zip,application/zip,application/x-zip-compressed"
        icon={<FolderArchive size={24} />}
      />

      {/* Metadata Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <input
          type="text"
          placeholder="Track Title"
          value={metadata.title}
          onChange={(e) => setMetadata({...metadata, title: e.target.value})}
          style={inputStyle}
        />
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="number"
            placeholder="BPM"
            value={metadata.bpm}
            onChange={(e) => setMetadata({...metadata, bpm: e.target.value})}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Key (e.g. Cm)"
            value={metadata.key}
            onChange={(e) => setMetadata({...metadata, key: e.target.value})}
            style={inputStyle}
          />
        </div>
        <input
          type="number"
          placeholder="Price ($)"
          value={metadata.price}
          onChange={(e) => setMetadata({...metadata, price: e.target.value})}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={metadata.tags}
          onChange={(e) => setMetadata({...metadata, tags: e.target.value})}
          style={inputStyle}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isUploading}
        style={{
          width: '100%',
          height: '56px',
          borderRadius: '16px',
          background: uploadStatus === 'success' ? '#22c55e' : 'var(--accent-primary)',
          color: 'white',
          fontSize: '16px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          opacity: isUploading ? 0.7 : 1,
          transition: 'all 0.3s'
        }}
      >
        {isUploading ? (
          <>
            <Loader2 className="spin" size={20} /> Uploading...
          </>
        ) : uploadStatus === 'success' ? (
          <>
            <Check size={20} /> Done!
          </>
        ) : (
          'Upload Beat'
        )}
      </button>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        /* Remove arrows from number inputs */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
};

// Helper Components & Styles
const UploadSection = ({ title, file, onDrop, onSelect, onRemove, accept, icon, required }) => (
  <div 
    onDragOver={(e) => e.preventDefault()}
    onDrop={onDrop}
    style={{
      width: '100%',
      padding: '20px',
      borderRadius: '16px',
      border: '2px dashed var(--glass-border)',
      background: file ? 'rgba(124, 58, 237, 0.1)' : 'var(--glass-bg)',
      display: 'flex', alignItems: 'center', gap: '16px',
      marginBottom: '16px', position: 'relative'
    }}
  >
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      background: file ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      {React.cloneElement(icon, { color: file ? 'white' : 'var(--text-secondary)' })}
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ fontWeight: 600, fontSize: '14px' }}>
        {file ? file.name : title} {required && !file && <span style={{color:'red'}}>*</span>}
      </p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
        {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Drag or click to browse'}
      </p>
    </div>
    <input type="file" accept={accept} onChange={onSelect} style={hiddenInputStyle} />
    {file && (
      <button onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{ zIndex: 10, padding: '8px' }}>
        <X size={20} color="var(--text-secondary)" />
      </button>
    )}
  </div>
);

const FilePreview = ({ file, onRemove, type }) => (
  <>
  {type === 'image' && <div style={{
    position: 'absolute', inset: 0, 
    background: `url(${URL.createObjectURL(file)}) center/cover`, 
    zIndex: 1 
  }} />}
  <button 
    onClick={(e) => { e.stopPropagation(); onRemove(); }}
    style={{
      position: 'absolute', top: '12px', right: '12px', zIndex: 10,
      background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '4px', color: 'white'
    }}
  >
    <X size={20} />
  </button>
  </>
);

const dropZoneStyle = (hasFile) => ({
  width: '100%',
  aspectRatio: '1',
  borderRadius: '24px',
  border: '2px dashed var(--glass-border)',
  background: 'var(--glass-bg)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  marginBottom: '24px', position: 'relative', overflow: 'hidden'
});

const hiddenInputStyle = { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 5 };

const inputStyle = {
  width: '100%',
  height: '50px',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--glass-border)',
  borderRadius: '12px',
  padding: '0 16px',
  color: 'white',
  fontSize: '16px',
  outline: 'none'
};

export default UploadPage;
