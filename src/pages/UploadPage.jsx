import { supabase } from '../lib/supabase';

// ... (inside component)

  const handleSubmit = async () => {
    if (!coverFile || !audioFile || !metadata.title || !metadata.price) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUploading(true);
    
    try {
      // 1. Upload Cover
      const coverExt = coverFile.name.split('.').pop();
      const coverName = `${Date.now()}_cover.${coverExt}`;
      const { data: coverData, error: coverError } = await supabase.storage
        .from('covers')
        .upload(coverName, coverFile);
      
      if (coverError) throw coverError;
      
      const { data: { publicUrl: coverUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(coverName);

      // 2. Upload Audio
      const audioExt = audioFile.name.split('.').pop();
      const audioName = `${Date.now()}_audio.${audioExt}`;
      const { data: audioData, error: audioError } = await supabase.storage
        .from('beats')
        .upload(audioName, audioFile);
        
      if (audioError) throw audioError;

      const { data: { publicUrl: audioUrl } } = supabase.storage
        .from('beats')
        .getPublicUrl(audioName);

      // 3. Insert into Database
      const { error: dbError } = await supabase
        .from('beats')
        .insert([{
          title: metadata.title,
          bpm: metadata.bpm ? parseInt(metadata.bpm) : null,
          key: metadata.key,
          price: parseFloat(metadata.price),
          tags: metadata.tags.split(',').map(t => t.trim()),
          cover_url: coverUrl,
          audio_url: audioUrl
        }]);

      if (dbError) throw dbError;

      setUploadStatus('success');
      
      // Reset form
      setTimeout(() => {
        setUploadStatus(null);
        setCoverFile(null);
        setAudioFile(null);
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
    <div style={{ paddingBottom: '100px', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Upload New Beat</h1>

      {/* Cover Upload Zone */}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, 'cover')}
        style={{
          width: '100%',
          aspectRatio: '1',
          borderRadius: '24px',
          border: '2px dashed var(--glass-border)',
          background: coverFile ? `url(${URL.createObjectURL(coverFile)}) center/cover` : 'var(--glass-bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {!coverFile && (
          <>
            <ImageIcon size={48} color="var(--text-secondary)" style={{ marginBottom: '12px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Drag Cover Art here</p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>or click to browse</p>
          </>
        )}
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => handleFileSelect(e, 'cover')}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
        {coverFile && (
          <button 
            onClick={(e) => { e.stopPropagation(); setCoverFile(null); }}
            style={{
              position: 'absolute', top: '12px', right: '12px',
              background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '4px',
              color: 'white'
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Audio Upload Zone */}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, 'audio')}
        style={{
          width: '100%',
          padding: '20px',
          borderRadius: '16px',
          border: '2px dashed var(--glass-border)',
          background: audioFile ? 'rgba(124, 58, 237, 0.1)' : 'var(--glass-bg)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
          position: 'relative'
        }}
      >
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: audioFile ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Music size={24} color={audioFile ? 'white' : 'var(--text-secondary)'} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, fontSize: '14px' }}>
            {audioFile ? audioFile.name : 'Upload MP3/WAV'}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            {audioFile ? `${(audioFile.size / 1024 / 1024).toFixed(2)} MB` : 'Drag or click to browse'}
          </p>
        </div>
        <input 
          type="file" 
          accept="audio/*" 
          onChange={(e) => handleFileSelect(e, 'audio')}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
        {audioFile && (
          <button 
            onClick={(e) => { e.stopPropagation(); setAudioFile(null); }}
            style={{ zIndex: 10, padding: '8px' }}
          >
            <X size={20} color="var(--text-secondary)" />
          </button>
        )}
      </div>

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
      `}</style>
    </div>
  );
};

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
