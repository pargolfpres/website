import React, { useState } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { Button } from '@/components/ui/button';

const EditableImage = ({ 
  src, 
  alt, 
  section, 
  field,
  className = '',
  ...props 
}) => {
  const { isEditMode, saveContent } = useEditMode();
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'images');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        await saveContent(section, field, data.url);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      setShowUpload(false);
    }
  };

  if (!isEditMode) {
    return <img src={src} alt={alt} className={className} {...props} />;
  }

  return (
    <div 
      style={{ 
        position: 'relative', 
        display: 'inline-block',
        outline: '2px dashed #bb9457',
        outlineOffset: '4px'
      }}
      onMouseEnter={() => setShowUpload(true)}
      onMouseLeave={() => !uploading && setShowUpload(false)}
    >
      <img src={src} alt={alt} className={className} {...props} />
      
      {showUpload && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10
          }}
        >
          <label>
            <Button
              type="button"
              style={{ backgroundColor: '#6f1d1b' }}
              className="text-white"
              disabled={uploading}
              as="span"
            >
              {uploading ? '📤 Uploading...' : '🖼️ Change Image'}
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      )}
      
      <span 
        style={{
          position: 'absolute',
          top: '-20px',
          left: '0',
          fontSize: '10px',
          color: '#bb9457',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}
      >
        🖼️ Hover to change
      </span>
    </div>
  );
};

export default EditableImage;
