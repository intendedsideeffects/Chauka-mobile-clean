'use client';

import React from 'react';
import HistoricalSeaLevelRiseExtendedMobile from '../components/HistoricalSeaLevelRiseExtendedMobile';

const ExtendedChartPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      backgroundColor: '#ffffff',
      fontFamily: 'Helvetica World, Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: '#ffffff', 
          padding: '2rem', 
          borderRadius: '8px'
        }}>
          <HistoricalSeaLevelRiseExtendedMobile />
        </div>
      </div>
    </div>
  );
};

export default ExtendedChartPage;


