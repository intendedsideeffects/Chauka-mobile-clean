'use client';

import React from 'react';
import DisasterByCountryChart from '../components/DisasterByCountryChart';

export default function DisasterByCountryPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <DisasterByCountryChart />
    </div>
  );
} 