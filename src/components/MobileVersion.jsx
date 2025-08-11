'use client';

import React from 'react';
import MobileSegmentTemplate from './sections/MobileSegmentTemplate';
import { responsive } from '../app/utils/responsive';

// This component contains the MOBILE version
// It is completely separate from the desktop version
const MobileVersion = () => {
  // Only render if mobile
  if (!responsive.isMobile()) {
    return null;
  }

  return (
    <div className="mobile-version">
      {/* Mobile-specific title section */}
      <section style={{
        width: '100%',
        minHeight: '100vh',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: '2rem 1rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '95%',
          margin: '0 auto',
          marginTop: '2rem'
        }}>
          {/* Mobile Title */}
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'normal',
            color: '#000',
            marginBottom: '0.5rem',
            textAlign: 'left',
            marginTop: '0',
            fontFamily: 'Helvetica World, Arial, sans-serif',
            lineHeight: '1'
          }}>
            Chauka
          </h1>
          
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '2rem',
            textAlign: 'left',
            marginTop: '0',
            fontFamily: 'Times New Roman, serif',
            fontStyle: 'italic',
            lineHeight: '1.1'
          }}>
            This is a global warning.
          </h2>

          {/* Mobile Content */}
          <p style={{
            fontSize: '1.1rem',
            color: '#000',
            marginBottom: '2rem',
            lineHeight: 1.6,
            fontFamily: 'Helvetica World, Arial, sans-serif'
          }}
          dangerouslySetInnerHTML={{ 
            __html: "On Manus Island, the Chauka bird once warned villagers when something was wrong. Its call meant: stop and pay attention.<br/><br/>Now, the ocean is calling.<br/><br/>It sends signals through rising tides, salt in gardens, and floods that reach farther each year. Pacific Island nations are the first to feel this. They didn't cause the crisis, but they are living with its consequences.<br/><br/>Elsewhere, people may not notice yet. But the warning is already here.<br/><br/><strong>This is a global warning.</strong>"
          }} />
        </div>

        {/* Mobile Spilhaus Map */}
        <div style={{
          width: '100%',
          height: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '2rem'
        }}>
          <img 
            src="/spilhaus_black.png" 
            alt="Spilhaus Projection" 
            style={{
              width: '120%',
              height: 'auto',
              maxHeight: '90vh',
              objectFit: 'cover',
              marginLeft: '-10%',
              marginRight: '-10%'
            }}
          />
        </div>
      </section>

      {/* Mobile segments */}
      <MobileSegmentTemplate 
        header="Sea Level Rise"
        text="The ocean is rising faster than ever before. This visualization shows the historical sea level rise and projections for the future."
      />

      {/* Add more mobile segments as needed */}
    </div>
  );
};

export default MobileVersion; 