'use client';

import React from 'react';
import AppRouter from '../components/AppRouter';

// This is the new main page that uses the separated desktop/mobile architecture
export default function HomePage() {
  return (
    <main>
      <AppRouter />
    </main>
  );
} 