import React, { createContext, useContext, useState, useEffect } from 'react';

const EditModeContext = createContext();

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode must be used within EditModeProvider');
  }
  return context;
};

export const EditModeProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in as admin
    const token = localStorage.getItem('adminToken');
    setIsAdmin(!!token);
  }, []);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const saveContent = async (section, field, value) => {
    try {
      // Get current section data
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/content/${section}`);
      const data = await response.json();
      
      // Update the specific field
      const updatedData = {
        ...data.data,
        [field]: value
      };

      // Save back to database
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/content/${section}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      return true;
    } catch (error) {
      console.error('Error saving content:', error);
      return false;
    }
  };

  return (
    <EditModeContext.Provider value={{ isEditMode, isAdmin, toggleEditMode, saveContent }}>
      {children}
    </EditModeContext.Provider>
  );
};
