'use client';

import React from 'react';
import { responsive } from '../../app/utils/responsive';

const MobileSegmentTemplate = ({
  header = "Sample Header",
  headerSecondLine = "", // New prop for second line
  text = "This is sample text content that demonstrates the formatting. It can include <strong>bold text</strong> and other HTML elements.",
  chartComponent = null, // This will be the actual chart component when ready
  caption = "Fig 1: This is blablabla", // New prop for figure caption
  styles = {},
  customHeight = null // New prop for custom height
}) => {
  const defaultStyles = {
    container: {
      width: '100%',
      height: 'auto', // Auto height for mobile
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      position: 'relative',
      scrollSnapAlign: 'start',
              borderBottom: '1px solid #9ca3af',
      pointerEvents: 'auto',
      paddingLeft: 0,
    },
    header: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '0',
      textAlign: 'left',
      marginTop: '0',
      fontFamily: 'Times New Roman, serif',
      lineHeight: '1.1'
    },
    headerSecondLine: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '0',
      textAlign: 'left',
      marginTop: '0',
      fontFamily: 'Times New Roman, serif',
      lineHeight: '1.1'
    },
    text: {
      fontSize: '1.1rem',
      color: '#000',
      marginBottom: '0',
      lineHeight: 1.5,
      fontFamily: 'Helvetica World, Arial, sans-serif'
    }
  };

  // Merge default styles with custom styles
  const mergedStyles = {
    container: { ...defaultStyles.container, ...styles.container },
    header: { ...defaultStyles.header, ...styles.header },
    headerSecondLine: { ...defaultStyles.headerSecondLine, ...styles.headerSecondLine },
    text: { ...defaultStyles.text, ...styles.text }
  };

  return (
    <section style={mergedStyles.container}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        maxWidth: '1050px',
        marginBottom: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '4rem', // Fixed distance from top (below grey number)
        gap: '1.5rem', // Consistent gap between all elements
        zIndex: 1000,
        position: 'relative',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}>
        {/* Header */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          textAlign: 'left',
          margin: '0 auto',
          marginTop: '1rem'
        }}>
          <h1 style={mergedStyles.header}>{header}</h1>
          <h2 style={mergedStyles.headerSecondLine}>{headerSecondLine}</h2>
        </div>
        
        {/* Text content */}
        <div style={{
          width: '100%',
          maxWidth: '800px',
          textAlign: 'left',
          margin: '0 auto'
        }}>
         <p 
           style={mergedStyles.text}
           dangerouslySetInnerHTML={{ __html: text }}
         />
       </div>
       
       {/* Chart Container - only show if chartComponent is provided */}
       {chartComponent && (
         <div style={{
           width: '100%',
           maxWidth: '100%',
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           justifyContent: 'center',
           marginTop: '0',
           marginBottom: 0,
           marginLeft: '0',
           marginRight: '0',
           padding: 0,
           overflow: 'visible',
         }}>
           {chartComponent}
         </div>
       )}
       
       {/* Figure Caption - under chart but aligned with text width */}
       <div style={{
         width: '100%',
         maxWidth: '800px',
         textAlign: 'left',
         margin: '0 auto',
         marginTop: '0'
       }}>
         <p style={{
           fontSize: '0.9rem',
           color: '#9ca3af',
           fontStyle: 'italic',
           lineHeight: 1.4,
           margin: 0
         }}
         dangerouslySetInnerHTML={{ __html: caption }}
         />
       </div>
    </div>
  </section>
);
};

export default MobileSegmentTemplate; 