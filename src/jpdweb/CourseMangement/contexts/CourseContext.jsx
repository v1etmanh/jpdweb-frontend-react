// contexts/CourseContext.jsx
import React, { createContext, useContext, useState, useRef } from 'react';

const CourseContext = createContext();

export const CourseProvider = ({ children, courseId }) => {
  // State management
  const [courseMetadata, setCourseMetadata] = useState(null);
  const [loadedContents, setLoadedContents] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  
  const tempIdCounter = useRef(-1);

  const value = {
    // States
    courseId,
    courseMetadata,
    setCourseMetadata,
    loadedContents,
    setLoadedContents,
    selectedItem,
    setSelectedItem,
    expandedChapters,
    setExpandedChapters,
    expandedModules,
    setExpandedModules,
    loading,
    setLoading,
    contentLoading,
    setContentLoading,
    tempIdCounter,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within CourseProvider');
  }
  return context;
};