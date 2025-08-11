'use client';

import React from 'react';
import { responsive } from '../../app/utils/responsive';

const TitleSection = ({ 
  title = "This is a global warning.",
  subtitle = "",
  mapTrigger = "MAP",
  content = "On Manus Island, the Chauka bird once warned villagers when something was wrong. Its call meant: stop and pay attention.<br/><br/>Now, the ocean is calling.<br/><br/>It sends signals through rising tides, salt in gardens, and floods that reach farther each year. Pacific Island nations are the first to feel this. They didn't cause the crisis, but they are living with its consequences.<br/><br/>Elsewhere, people may not notice yet. But the warning is already here.<br/><br/><strong>This is a global warning.</strong>",
  styles = {}
}) => {
  const [isPortrait, setIsPortrait] = React.useState(false);

  React.useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);
  const defaultStyles = {
    container: {
      width: '100%',
      height: (responsive.isMobile() && isPortrait) ? 'auto' : '100vh',
      background: 'white',
      display: 'flex',
      flexDirection: (responsive.isMobile() && isPortrait) ? 'column' : 'row', // Column only for portrait mobile
      alignItems: (responsive.isMobile() && isPortrait) ? 'flex-start' : 'center',
      justifyContent: (responsive.isMobile() && isPortrait) ? 'flex-start' : 'space-between',
      padding: responsive.isMobile() ? '2rem 2.5rem' : '0 4rem',
      position: 'relative',
      scrollSnapAlign: (responsive.isMobile() && isPortrait) ? 'none' : 'start',
      overflow: 'hidden', // Prevent any content from bleeding out
      isolation: 'isolate', // Create new stacking context
      zIndex: 2000 // Higher than SegmentTemplate's z-index of 1000
    },
    contentWrapper: {
      color: '#000',
      fontSize: responsive.isMobile() ? '1.1rem' : '1.2rem',
      maxWidth: (responsive.isMobile() && isPortrait) ? '95%' : '30%', // Wider width for portrait mobile
      textAlign: 'left',
      fontFamily: 'Helvetica World, Arial, sans-serif',
      fontWeight: 400,
      lineHeight: 1.6,
      zIndex: 2,
      position: 'relative',
      flexShrink: 0,
    },
                   title: {
        fontSize: (responsive.isMobile() && isPortrait) ? '4.5rem' : (responsive.isMobile() ? '3.5rem' : '10rem'),
        fontWeight: 'normal', // Changed from 'bold' to 'normal'
        color: '#000',
        marginBottom: '0',
        textAlign: 'left', // Changed from 'center' to 'left'
        marginTop: (responsive.isMobile() && isPortrait) ? '2rem' : (responsive.isMobile() ? '1.5rem' : '3rem'),
        fontFamily: 'Helvetica World, Arial, sans-serif',
        lineHeight: '1'
      },
      titleSecondLine: {
        fontSize: (responsive.isMobile() && isPortrait) ? '2.2rem' : (responsive.isMobile() ? '1.8rem' : '4rem'),
        fontWeight: 'bold', // Changed from 'normal' to 'bold'
        color: '#000',
        marginBottom: (responsive.isMobile() && isPortrait) ? '4rem' : (responsive.isMobile() ? '3rem' : '6rem'),
        textAlign: 'left', // Changed from 'center' to 'left'
        marginTop: '0.1rem', // Reduced from '0.5rem' to '0.1rem' to bring lines closer
        fontFamily: 'Times New Roman, serif', // Changed from Helvetica World to Times New Roman
        fontStyle: 'italic', // Added italic style
        lineHeight: '1'
      },
    subtitle: {
      marginBottom: '2rem',
      fontSize: '1.5rem',
      color: '#000'
    },
    mapTrigger: {
      marginBottom: '-11rem',
      fontSize: '1rem',
      color: 'transparent'
    },
    content: {
      marginBottom: (responsive.isMobile() && isPortrait) ? '3rem' : '2rem',
      fontSize: (responsive.isMobile() && isPortrait) ? '1.1rem' : (responsive.isMobile() ? '0.9rem' : '1.2rem'),
      color: '#000',
      marginTop: '0',
      fontFamily: 'Helvetica World, Arial, sans-serif'
    },
    emptySpace: {
      height: '1rem'
    },
    spilhausContainer: {
      width: (responsive.isMobile() && isPortrait) ? '120vw' : '70%',
      height: (responsive.isMobile() && isPortrait) ? '100vh' : (responsive.isMobile() ? '50%' : '100%'),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: (responsive.isMobile() && isPortrait) ? 'flex-end' : 'flex-start',
      position: 'relative',
      marginTop: (responsive.isMobile() && isPortrait) ? '0.5rem' : '0vh',
      marginLeft: (responsive.isMobile() && isPortrait) ? '-4rem' : '0%',
      marginRight: (responsive.isMobile() && isPortrait) ? '-4rem' : '0%'
    },
    spilhausWrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    spilhausImage: {
      width: (responsive.isMobile() && isPortrait) ? '120%' : '200%',
      height: 'auto',
      maxHeight: (responsive.isMobile() && isPortrait) ? '90vh' : '100vh',
      objectFit: (responsive.isMobile() && isPortrait) ? 'cover' : 'contain',
      display: 'block',
      filter: 'none',
      opacity: 1,
      transform: 'rotate(0deg)',
      marginLeft: (responsive.isMobile() && isPortrait) ? '-10%' : '0%',
      marginRight: (responsive.isMobile() && isPortrait) ? '-10%' : '0%',
      marginTop: (responsive.isMobile() && isPortrait) ? '0px' : '50px'
    },
    pulsingDot: {
      position: 'absolute',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(67, 97, 238, 0.95) 0%, rgba(67, 97, 238, 0.7) 50%, rgba(67, 97, 238, 0.2) 100%)',
      filter: 'blur(8px)',
      animation: 'pulse 3s ease-in-out infinite',
      zIndex: 1,
      top: '35%',
      left: '70%',
      transform: 'translate(-50%, -50%) rotate(-90deg)',
      pointerEvents: 'none'
    },
    smallPulsingDot: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(67, 97, 238, 0.8) 0%, rgba(67, 97, 238, 0.4) 50%, rgba(67, 97, 238, 0.1) 100%)',
      filter: 'blur(2px)',
      animation: 'smallPulse 2s ease-in-out infinite',
      zIndex: 1,
      pointerEvents: 'none',
      transform: 'rotate(-90deg)'
    }
  };

  // Add CSS animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.6;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 0.8;
        }
        100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.6;
        }
      }
      
      @keyframes smallPulse {
        0% {
          transform: scale(1);
          opacity: 0.4;
        }
        50% {
          transform: scale(1.3);
          opacity: 0.7;
        }
        100% {
          transform: scale(1);
          opacity: 0.4;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Merge default styles with custom styles
  const mergedStyles = {
    container: { ...defaultStyles.container, ...styles.container },
    contentWrapper: { ...defaultStyles.contentWrapper, ...styles.contentWrapper },
    title: { ...defaultStyles.title, ...styles.title },
    titleSecondLine: { ...defaultStyles.titleSecondLine, ...styles.titleSecondLine },
    subtitle: { ...defaultStyles.subtitle, ...styles.subtitle },
    mapTrigger: { ...defaultStyles.mapTrigger, ...styles.mapTrigger },
    content: { ...defaultStyles.content, ...styles.content },
    emptySpace: { ...defaultStyles.emptySpace, ...styles.emptySpace },
    spilhausContainer: { ...defaultStyles.spilhausContainer, ...styles.spilhausContainer },
    spilhausWrapper: { ...defaultStyles.spilhausWrapper, ...styles.spilhausWrapper },
    spilhausImage: { ...defaultStyles.spilhausImage, ...styles.spilhausImage },
    pulsingDot: { ...defaultStyles.pulsingDot, ...styles.pulsingDot },
    smallPulsingDot: { ...defaultStyles.smallPulsingDot, ...styles.smallPulsingDot }
  };

  return (
    <section style={mergedStyles.container}>
      {/* Left side - Text content */}
      <div style={mergedStyles.contentWrapper}>
        {/* Blue explore button removed */}

        {/* Title */}
        <div>
          <h1 style={mergedStyles.title}>Chauka</h1>
          <h1 style={mergedStyles.titleSecondLine}>This is a global warning.</h1>
        </div>
        
        {/* Main content */}
        <p 
          style={mergedStyles.content} 
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Right side - Spilhaus Map */}
      <div style={mergedStyles.spilhausContainer}>
        <div style={mergedStyles.spilhausWrapper}>
          <img 
            src="/spilhaus_black.png" 
            alt="Spilhaus Projection" 
            style={mergedStyles.spilhausImage}
          />
          

          
                     {/* Footnote */}
           <div style={{
             position: 'absolute',
             top: (responsive.isMobile() && isPortrait) ? '75%' : '134px',
             right: (responsive.isMobile() && isPortrait) ? '80px' : '50px',
             fontSize: (responsive.isMobile() && isPortrait) ? '0.8rem' : '0.9rem',
             color: '#000000',
             fontWeight: 400,
             textAlign: 'left',
             maxWidth: (responsive.isMobile() && isPortrait) ? '30%' : '25%',
             lineHeight: '1.2',
             zIndex: 10,
             marginLeft: (responsive.isMobile() && isPortrait) ? '10px' : '20px'
           }}>
            The Spilhaus projection shows the ocean as one connected body, not broken apart like most maps. It helps us see that what happens in one part affects all others. The ocean is the focus, not the background.
          </div>
          
          {/* Annotation line - horizontal under footer - REMOVED */}
          
          {/* Annotation line - angled down to map */}
          <div style={{
            position: 'absolute',
            top: (responsive.isMobile() && isPortrait) ? '53.5%' : '224px',
            right: (responsive.isMobile() && isPortrait) ? '35%' : '329px',
            width: '1px',
            height: (responsive.isMobile() && isPortrait) ? '150px' : '90px',
            backgroundColor: '#000',
            transform: (responsive.isMobile() && isPortrait) ? 'rotate(0deg)' : 'rotate(0deg)',
            transformOrigin: 'bottom left',
            zIndex: 1
          }} />
          
                     {/* 9 Small Pulsing Dots in Pacific Islands */}
           <div style={{
             ...mergedStyles.smallPulsingDot,
             width: (responsive.isMobile() && isPortrait) ? '60px' : '80px',
             height: (responsive.isMobile() && isPortrait) ? '60px' : '80px',
             top: (responsive.isMobile() && isPortrait) ? '45%' : '40%',
             left: (responsive.isMobile() && isPortrait) ? '65%' : '65%',
             animationDelay: '0s'
           }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: (responsive.isMobile() && isPortrait) ? '25px' : '30px',
            height: (responsive.isMobile() && isPortrait) ? '25px' : '30px',
            top: '45%',
            left: (responsive.isMobile() && isPortrait) ? '75%' : '70%',
            animationDelay: '0.3s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: (responsive.isMobile() && isPortrait) ? '30px' : '35px',
            height: (responsive.isMobile() && isPortrait) ? '30px' : '35px',
            top: '45%',
            left: (responsive.isMobile() && isPortrait) ? '75%' : '75%',
            animationDelay: '0.6s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '28px',
            height: '28px',
            top: '40%',
            left: '68%',
            animationDelay: '0.9s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '32px',
            height: '32px',
            top: '45%',
            left: '62%',
            animationDelay: '1.2s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '25px',
            height: '25px',
            top: '44%',
            left: '72%',
            animationDelay: '1.5s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '38px',
            height: '38px',
            top: '43%',
            left: '55%',
            animationDelay: '1.8s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '29px',
            height: '29px',
            top: '40%',
            left: '63%',
            animationDelay: '2.1s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '31px',
            height: '31px',
            top: '40%',
            left: '67%',
            animationDelay: '2.4s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '35px',
            height: '35px',
            top: '42%',
            left: '55%',
            animationDelay: '2.7s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '48px',
            height: '48px',
            top: '40%',
            left: '60%',
            animationDelay: '3.0s'
          }} />
          <div style={{
            ...mergedStyles.smallPulsingDot,
            width: '19px',
            height: '19px',
            top: '40%',
            left: '70%',
            animationDelay: '3.3s'
          }} />
          
          {/* Large and small blue static dots in bottom right corner - exact FloatingDot style */}
                     <svg style={{
             position: 'absolute',
             top: (responsive.isMobile() && isPortrait) ? '10%' : '77%',
             left: (responsive.isMobile() && isPortrait) ? '10%' : '82%',
             width: (responsive.isMobile() && isPortrait) ? '120px' : '150px',
             height: (responsive.isMobile() && isPortrait) ? '120px' : '150px',
             zIndex: 1000,
             pointerEvents: 'none'
           }}>
            <defs>
              <filter id="glow-large">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Blurry outline - exact FloatingDot calculation */}
            <circle
              cx="75"
              cy="75"
              r="34"
              fill="#0066cc"
              style={{
                opacity: 0.3,
                filter: 'url(#glow-large)',
              }}
            />
                         {/* Main dot - exact FloatingDot calculation */}
             <circle
               cx="75"
               cy="75"
               r="30"
               fill="#0066cc"
               style={{
                 opacity: 0.8,
                 filter: 'url(#glow-large)',
               }}
             />
                         {/* Annotation */}
             <text
               x="75"
               y="140"
               textAnchor="middle"
               fill="#000000"
               fontSize="12"
               fontFamily="Helvetica World, Arial, sans-serif"
               style={{ display: (responsive.isMobile() && isPortrait) ? 'block' : 'none', zIndex: 1000 }}
             >
               large flood
             </text>
                      </svg>
            
            {/* Large flood text label */}
            <div style={{
              position: 'absolute',
              top: (responsive.isMobile() && isPortrait) ? '27%' : '91%',
              left: (responsive.isMobile() && isPortrait) ? '12%' : '83%',
              color: '#000000',
              fontSize: '12px',
              fontFamily: 'Helvetica World, Arial, sans-serif',
              textAlign: 'center',
              width: '120px',
              zIndex: 1001
            }}>
              large flood
            </div>
            
           <svg style={{
             position: 'absolute',
             top: (responsive.isMobile() && isPortrait) ? '5%' : '81%',
             left: (responsive.isMobile() && isPortrait) ? '40%' : '92%',
             width: (responsive.isMobile() && isPortrait) ? '80px' : '100px',
             height: (responsive.isMobile() && isPortrait) ? '80px' : '100px',
             zIndex: 1000,
             pointerEvents: 'none'
           }}>
            <defs>
              <filter id="glow-small">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Blurry outline - exact FloatingDot calculation */}
            <circle
              cx="50"
              cy="50"
              r="19"
              fill="#0066cc"
              style={{
                opacity: 0.3,
                filter: 'url(#glow-small)',
              }}
            />
                         {/* Main dot - exact FloatingDot calculation */}
             <circle
               cx="50"
               cy="50"
               r="15"
               fill="#0066cc"
               style={{
                 opacity: 0.8,
                 filter: 'url(#glow-small)',
               }}
             />
                         {/* Annotation */}
             <text
               x="50"
               y="100"
               textAnchor="middle"
               fill="#000000"
               fontSize="12"
               fontFamily="Helvetica World, Arial, sans-serif"
               style={{ display: (responsive.isMobile() && isPortrait) ? 'block' : 'none', zIndex: 1000 }}
             >
               small flood
             </text>
                      </svg>
            
            {/* Small flood text label */}
            <div style={{
              position: 'absolute',
              top: (responsive.isMobile() && isPortrait) ? '15%' : '89%',
              left: (responsive.isMobile() && isPortrait) ? '41%' : '93%',
              color: '#000000',
              fontSize: '12px',
              fontFamily: 'Helvetica World, Arial, sans-serif',
              textAlign: 'center',
              width: '80px',
              zIndex: 1001
            }}>
              small flood
            </div>
          </div>
      </div>
    </section>
  );
};

export default TitleSection; 