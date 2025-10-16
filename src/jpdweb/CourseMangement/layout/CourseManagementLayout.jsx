// components/layout/CourseManagementLayout.jsx (Advanced)
import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ContentArea } from './ContentArea';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CourseManagementLayout = ({ onAddChapter, onAddModule }) => {
  const [sidebarWidth, setSidebarWidth] = useState(320); // Default 320px
  const [isResizing, setIsResizing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const sidebarRef = useRef(null);

  const MIN_WIDTH = 240;
  const MAX_WIDTH = 600;
  const COLLAPSED_WIDTH = 60;

  // Handle mouse move during resize
  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const newWidth = e.clientX;
    if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
      setSidebarWidth(newWidth);
    }
  };

  // Handle mouse up to stop resizing
  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  };

  // Handle mouse down to start resizing
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Add/remove event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Save sidebar width to localStorage
  useEffect(() => {
    localStorage.setItem('courseManagement_sidebarWidth', sidebarWidth.toString());
  }, [sidebarWidth]);

  // Load sidebar width from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem('courseManagement_sidebarWidth');
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      if (width >= MIN_WIDTH && width <= MAX_WIDTH) {
        setSidebarWidth(width);
      }
    }
  }, []);

  const currentWidth = isSidebarCollapsed ? COLLAPSED_WIDTH : sidebarWidth;

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Left Sidebar - Resizable */}
      <div
        ref={sidebarRef}
        className="relative border-r border-gray-200 transition-all duration-300 ease-in-out"
        style={{ width: `${currentWidth}px`, minWidth: `${currentWidth}px` }}
      >
        {/* Sidebar Content */}
        <div className="h-full overflow-hidden">
          {!isSidebarCollapsed ? (
            <Sidebar onAddChapter={onAddChapter} onAddModule={onAddModule} />
          ) : (
            <CollapsedSidebar />
          )}
        </div>

        {/* Resize Handle */}
        {!isSidebarCollapsed && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 hover:w-1.5 transition-all group"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-4 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-0.5 h-6 bg-white rounded"></div>
              </div>
            </div>
          </div>
        )}

        {/* Collapse/Expand Toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 -right-3 z-10 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-3 h-3 text-gray-600" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          )}
        </button>
      </div>

      {/* Right Content Area - Flexible */}
      <div className="flex-1 overflow-hidden">
        <ContentArea />
      </div>
    </div>
  );
};

// Collapsed Sidebar Component
const CollapsedSidebar = () => {
  return (
    <div className="h-full bg-gray-50 border-r border-gray-200 p-2">
      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-blue-600" />
        </div>
        {/* Add more collapsed icons here */}
      </div>
    </div>
  );
};

export default CourseManagementLayout;