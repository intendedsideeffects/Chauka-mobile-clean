'use client';

import React, { useState, useEffect } from 'react';
import { responsive } from './utils/responsive';

// Import both versions
import MobileVersion from './mobile-page';
import BrowserVersion from './browser-page';

// Client-side only router to prevent hydration mismatches
function ClientRouter() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true);
    
    // Check screen size
    const checkScreenSize = () => {
      setIsMobile(responsive.isMobile());
    };
    
    checkScreenSize();
    
    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Show loading state during SSR and before mounting to prevent hydration mismatch
  if (!mounted) {
    return (
      <div style={{
        height: '100vh',
        width: '100%',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '16px'
      }}>
        Loading...
      </div>
    );
  }

  return isMobile ? <MobileVersion /> : <BrowserVersion />;
}

// Main router that decides which version to show
export default function AppRouter() {
  return (
    <div className="app-router">
      <ClientRouter />
    </div>
  );
}
