'use client';

import React from 'react';
import DisasterTimeSeriesChart from '../components/DisasterTimeSeriesChart';

export default function DisasterTimelinePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <DisasterTimeSeriesChart />
    </div>
  );
} 