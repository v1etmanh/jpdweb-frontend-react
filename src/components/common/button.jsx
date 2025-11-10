// src/components/common/button.jsx
import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`transition-all duration-200 font-medium hover:opacity-90 focus:ring-2 focus:ring-indigo-400 focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}
