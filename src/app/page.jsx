'use client';

import React, { useEffect } from 'react';
import AppRouter from './router';

// Main entry point - uses router to show appropriate version
export default function Page() {
  useEffect(() => {
    // Simple fix: ensure page starts at top
    window.scrollTo(0, 0);
  }, []);

  return <AppRouter />;
}
