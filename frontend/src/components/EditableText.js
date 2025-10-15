import React, { useState, useRef, useEffect } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';

const EditableText = ({ 
  children, 
  section, 
  field, 
  as: Component = 'span',
  className = '',
  ...props 
}) => {
  const { isEditMode, saveContent } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(children);
  const [isSaving, setIsSaving] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    setValue(children);
  }, [children]);

  const handleClick = (e) => {
    if (isEditMode && !isEditing) {
      e.preventDefault();
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleBlur = async () => {
    setIsEditing(false);
    if (value !== children) {
      setIsSaving(true);
      const success = await saveContent(section, field, value);
      setIsSaving(false);
      if (success) {
        // Reload page to show changes
        setTimeout(() => window.location.reload(), 500);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      elementRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setValue(children);
      setIsEditing(false);
    }
  };

  const editModeStyles = isEditMode && !isEditing ? {
    outline: '2px dashed #bb9457',
    outlineOffset: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative'
  } : {};

  const editingStyles = isEditing ? {
    outline: '3px solid #6f1d1b',
    outlineOffset: '4px',
    backgroundColor: 'rgba(187, 148, 87, 0.1)'
  } : {};

  if (!isEditMode) {
    return <Component className={className} {...props}>{children}</Component>;
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Component
        ref={elementRef}
        className={className}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onClick={handleClick}
        onBlur={handleBlur}
        onInput={(e) => setValue(e.currentTarget.textContent)}
        onKeyDown={handleKeyDown}
        style={{
          ...editModeStyles,
          ...editingStyles,
          ...props.style
        }}
        {...props}
      >
        {value}
      </Component>
      {isEditMode && !isEditing && (
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
          ✏️ Click to edit
        </span>
      )}
      {isSaving && (
        <span 
          style={{
            position: 'absolute',
            top: '-20px',
            right: '0',
            fontSize: '10px',
            color: '#6f1d1b',
            fontWeight: 'bold'
          }}
        >
          💾 Saving...
        </span>
      )}
    </div>
  );
};

export default EditableText;
