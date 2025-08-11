'use client';

import React from 'react';
import { responsive } from '../../app/utils/responsive';

const SegmentTemplate = ({
  header = "Sample Header",
  headerSecondLine = "", // New prop for second line
  text = "This is sample text content that demonstrates the formatting. It can include <strong>bold text</strong> and other HTML elements.",
  chartComponent = null, // This will be the actual chart component when ready
  caption = "Fig 1: This is blablabla", // New prop for figure caption
  styles = {},
  customHeight = null, // New prop for custom height
  sectionNumber = null // New prop for grey section number
}) => {
  const defaultStyles = {
                                               container: {
          width: '100%',
                    height: responsive.isMobile() ? (customHeight || '200vh') : '100vh',
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          position: 'relative',
          scrollSnapAlign: 'start',
          borderBottom: '1px solid #9ca3af',
          pointerEvents: 'auto', // Enable interactions
          paddingLeft: 0,
        },
                                       contentWrapper: {
         color: '#0e224f',
         fontSize: responsive.isMobile() ? '1.1rem' : '1.1rem',
         maxWidth: responsive.isMobile() ? '90%' : '700px',
         textAlign: 'left',
         fontFamily: 'Helvetica World, Arial, sans-serif',
         fontWeight: 400,
         lineHeight: 1.5,
         zIndex: 9999, // Highest z-index to be above everything
         position: 'relative',
         margin: '0',
         flexShrink: 0,
         pointerEvents: 'auto', // Enable interactions
       },
                                       header: {
         fontSize: responsive.isMobile() ? '1.8rem' : '2.5rem',
         fontWeight: 'bold',
         color: '#000',
         marginBottom: '0',
         textAlign: 'left',
         marginTop: '0',
         fontFamily: 'Times New Roman, serif',
         lineHeight: '1.0'
       },
       headerSecondLine: {
         fontSize: responsive.isMobile() ? '1.8rem' : '2.5rem',
         fontWeight: 'bold',
         color: '#000',
         marginBottom: '0',
         textAlign: 'left',
         marginTop: '0',
         fontFamily: 'Times New Roman, serif',
         lineHeight: '1.0'
       },
         text: {
               fontSize: responsive.isMobile() ? '1.1rem' : '1.1rem',
       color: '#000',
       marginBottom: responsive.isMobile() ? '1rem' : '2rem',
       lineHeight: 1.5,
       fontFamily: 'Helvetica World, Arial, sans-serif',
       marginTop: '0',
     },
                                                                                                                                                                                                                                                                                                                                                                       chartContainer: {
          width: '100%',
          maxWidth: responsive.isMobile() ? '90vw' : '1050px',
          marginTop: '0',
          marginBottom: responsive.isMobile() ? '1rem' : '2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          top: 'auto',
          left: '0',
          right: '0',
          margin: '0 auto',
          transform: responsive.isMobile() ? 'translateX(0)' : 'translateX(-2cm)',
                     pointerEvents: 'auto', // Enable interactions
           boxSizing: 'border-box',
          padding: responsive.isMobile() ? '0 16px' : '0',
        },
               placeholderChart: {
             width: '100%',
             maxWidth: '1200px',
             height: '400px',
             backgroundColor: '#e5e7eb', // Grey color
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             borderRadius: '8px',
             border: '2px dashed #9ca3af',
             color: '#6b7280',
             fontSize: '1.2rem',
             fontWeight: '500',
             margin: '0 auto'
           }
  };

  // Merge default styles with custom styles
  const mergedStyles = {
    container: { ...defaultStyles.container, ...styles.container },
    contentWrapper: { ...defaultStyles.contentWrapper, ...styles.contentWrapper },
    header: { ...defaultStyles.header, ...styles.header },
    headerSecondLine: { ...defaultStyles.headerSecondLine, ...styles.headerSecondLine },
    text: { ...defaultStyles.text, ...styles.text },
    chartContainer: { ...defaultStyles.chartContainer, ...styles.chartContainer },
    placeholderChart: { ...defaultStyles.placeholderChart, ...styles.placeholderChart }
  };

                       return (
      <section style={mergedStyles.container}>
                                                                                 <div style={{
             display: 'flex',
             flexDirection: 'column',
             alignItems: responsive.isMobile() ? 'flex-start' : 'center',
             justifyContent: responsive.isMobile() ? 'flex-start' : 'center',
             width: '100%',
             maxWidth: '1050px',
              marginBottom: 0,
              marginLeft: 'auto',
              marginRight: 'auto',
             marginTop: '0',
             gap: responsive.isMobile() ? '2rem' : '2rem',
             position: 'relative',
             paddingLeft: responsive.isMobile() ? '2.5rem' : '0',
             paddingRight: responsive.isMobile() ? '2.5rem' : '0',
             paddingTop: responsive.isMobile() ? '10rem' : '0'
           }}>
                                        {/* Grey Section Number - Removed to avoid conflict with absolutely positioned numbers */}
                                        
                                        {/* Header */}
            <div style={{
              width: '100%',
              maxWidth: '800px',
              textAlign: 'left',
              margin: '0 auto'
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
                              marginTop: 0,
                              marginBottom: 0,
                              marginLeft: 0,
                              marginRight: 0,
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

export default SegmentTemplate; 




