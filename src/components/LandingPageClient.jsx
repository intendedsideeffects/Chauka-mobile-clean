'use client';

import React, { useState, useRef, useEffect } from 'react';
import InteractiveStarGlobe from '../app/components/InteractiveStarGlobe';
import { responsive, useResponsive } from '../app/utils/responsive';

// Blue Circle Audio Player Component
function BlueCircleAudioPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const [showButtons, setShowButtons] = React.useState(true);
  const [audioElement, setAudioElement] = React.useState(null);
  const { isMobile } = useResponsive();

  React.useEffect(() => {
    const handleScroll = () => {
      setShowButtons(true); // Always show at bottom
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const audio = new Audio('/oceansound_compressed.m4a');
    audio.volume = 0.20;
    audio.loop = true;
    audio.preload = 'auto';
    setAudioElement(audio);
  }, []);

  const handleToggle = () => {
    if (!audioElement) return;
    if (playing) {
      audioElement.pause();
      setPlaying(false);
    } else {
      audioElement.play().catch(error => {
        console.error('Error playing ocean audio:', error);
      });
      setPlaying(true);
    }
  };

  return (
    <div style={{ 
      width: isMobile ? '180px' : '240px', 
      height: isMobile ? '180px' : '240px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      pointerEvents: showButtons ? 'auto' : 'none', 
      background: 'none', 
      cursor: 'pointer', 
      opacity: showButtons ? 1 : 0, 
      transition: 'opacity 0.4s',
    }} onClick={handleToggle} aria-label="Play or pause ocean sound">
      <svg width={isMobile ? "180" : "240"} height={isMobile ? "180" : "240"} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="pulseBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3d557a" stopOpacity="1" />
            <stop offset="100%" stopColor="#3d557a" stopOpacity="0" />
          </radialGradient>
          <filter id="glowBlue" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation={isMobile ? "30" : "40"} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Arc path for text wrapping around the top half of the dot */}
          <path id="circlePathBlueText" d={isMobile ? "M45,90 A45,45 0 1,1 135,90" : "M60,120 A60,60 0 1,1 180,120"} />
        </defs>
        {/* Wrapped text above the dot */}
        <text fill="#3d557a" fontSize={isMobile ? "12" : "15"} fontWeight="normal" letterSpacing="0.08em">
          <textPath xlinkHref="#circlePathBlueText" startOffset="0%" dominantBaseline="middle">
            Click for ocean sound!
          </textPath>
        </text>
        <circle cx={isMobile ? "90" : "120"} cy={isMobile ? "90" : "120"} r={isMobile ? "36" : "48"} fill="url(#pulseBlue)" style={{ animation: 'pulse 1.5s infinite', filter: 'url(#glowBlue)' }} />
        <circle cx={isMobile ? "90" : "120"} cy={isMobile ? "90" : "120"} r={isMobile ? "22" : "30"} fill="#3d557a" style={{ filter: 'url(#glowBlue)' }} />
        {!playing && (
          <polygon points={isMobile ? "86,84 98,90 86,96" : "115,112 131,120 115,128"} fill="#b8c6e6" style={{ opacity: 1 }} />
        )}
        {playing && (
          <g>
            <rect x={isMobile ? "84.5" : "112.5"} y={isMobile ? "84.5" : "113.5"} width={isMobile ? "4" : "5"} height={isMobile ? "9" : "12"} rx={isMobile ? "1" : "1.5"} fill="#b8c6e6" style={{ opacity: 1 }} />
            <rect x={isMobile ? "90.5" : "120.5"} y={isMobile ? "84.5" : "113.5"} width={isMobile ? "4" : "5"} height={isMobile ? "9" : "12"} rx={isMobile ? "1" : "1.5"} fill="#b8c6e6" style={{ opacity: 1 }} />
          </g>
        )}
      </svg>
      <style>{`
        @keyframes pulse {
          0% { r: ${isMobile ? "27" : "36"}; opacity: 0.7; }
          50% { r: ${isMobile ? "36" : "48"}; opacity: 0.2; }
          100% { r: ${isMobile ? "27" : "36"}; opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

// Bird Audio Player Component
function BirdAudioPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const [audioElement, setAudioElement] = React.useState(null);
  const [audioLoaded, setAudioLoaded] = React.useState(false);
  const { isMobile } = useResponsive();

  React.useEffect(() => {
    const audio = new Audio();
    audio.src = '/chaukasound.mp3';
    audio.volume = 0.3;
    audio.preload = 'metadata';
    audio.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
    });
    audio.addEventListener('ended', () => {
      setPlaying(false);
    });
    audio.addEventListener('error', (e) => {
      console.error('Bird audio error:', e);
    });
    setAudioElement(audio);
  }, []);

  const handleToggle = async () => {
    if (!audioElement) return;
    try {
      if (playing) {
        audioElement.pause();
        setPlaying(false);
      } else {
        // Ensure audio is loaded before playing
        if (audioElement.readyState < 2) {
          await audioElement.load();
        }
        await audioElement.play();
        setPlaying(true);
      }
    } catch (error) {
      console.error('Error playing bird audio:', error);
    }
  };

  return (
    <div style={{ 
      width: isMobile ? '60px' : '120px', 
      height: isMobile ? '60px' : '120px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'none', 
      cursor: 'pointer',
    }} onClick={handleToggle} aria-label="Play or pause Chauka call">
      <svg width={isMobile ? "60" : "120"} height={isMobile ? "60" : "120"} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {!playing && (
          <polygon points={isMobile ? "26,22 37,30 26,38" : "53,46 74,60 53,74"} fill="#676b8b" style={{ opacity: 0.8 }} />
        )}
        {playing && (
          <g>
            <rect x={isMobile ? "24.5" : "49"} y={isMobile ? "23.5" : "47"} width={isMobile ? "3" : "6"} height={isMobile ? "12" : "24"} rx={isMobile ? "0.8" : "1.5"} fill="#676b8b" style={{ opacity: 0.8 }} />
            <rect x={isMobile ? "30.5" : "61"} y={isMobile ? "23.5" : "47"} width={isMobile ? "3" : "6"} height={isMobile ? "12" : "24"} rx={isMobile ? "0.8" : "1.5"} fill="#676b8b" style={{ opacity: 0.8 }} />
          </g>
        )}
      </svg>
    </div>
  );
}

export default function LandingPageClient({ 
  showChaukaTooltip, 
  setShowChaukaTooltip, 
  oceanVideoRef 
}) {
  const [isPortrait, setIsPortrait] = React.useState(false);
  const { isMobile } = useResponsive();

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

  return (
    <section style={{ 
      position: 'relative', 
      height: '100vh', 
      width: '100%', 
      background: '#000', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      overflow: 'hidden',
      scrollSnapAlign: 'start',
      zIndex: 1, // Ensure proper stacking context
      isolation: 'isolate' // Create new stacking context
    }}>
      {/* Star Globe as background */}
      <InteractiveStarGlobe />
      
      {/* Ocean video overlay, only lower 30% visible, pointer-events: none */}
      <video
        ref={oceanVideoRef}
        src="/ocean_compressed.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadStart={() => console.log('Ocean video loading started')}
        onCanPlay={() => console.log('Ocean video can play')}
        onError={(e) => console.error('Ocean video error:', e)}
        onPlay={() => console.log('Ocean video started playing')}
        onLoadedData={() => console.log('Ocean video data loaded')}
        style={{
          position: 'absolute',
          left: 0,
          top: isMobile ? '10vh' : '15vh',
          width: '100vw',
          height: isMobile ? '90vh' : '85vh',
          objectFit: 'cover',
          zIndex: 2,
          pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 59.7%, black 60.7%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 59.7%, black 60.7%, black 100%)',
        }}
      />
      
      {/* Boats background image */}
      <img
        src="/boats.png"
        alt="Boats scene"
        style={{
          position: 'absolute',
          left: 0,
          top: isMobile ? '10vh' : '15vh',
          width: '100vw',
          height: isMobile ? '85vh' : '85vh',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 3,
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      />
      
      {/* Bird overlay image */}
      <img
        src="/bird.png"
        alt="Bird scene"
        style={{
          position: 'absolute',
          left: 0,
          top: isMobile ? '10vh' : '15vh',
          width: '100vw',
          height: isMobile ? '85vh' : '85vh',
          objectFit: 'cover',
          objectPosition: isMobile ? 'left center' : 'center',
          zIndex: 4, // Above boats
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      />
      
      {/* Speech bubble - improved mobile positioning */}
      <div
        style={{
          position: 'absolute',
          top: isMobile ? '55%' : '50%',
          left: isMobile ? '50%' : '40%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <img 
          src="/speechbubble.svg" 
          alt="Speech bubble" 
          style={{ 
            width: isMobile ? '100px' : '200px', 
            height: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            opacity: 0.7
          }} 
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#333',
            fontSize: isMobile ? '7px' : '12px',
            fontWeight: '500',
            textAlign: 'center',
            fontFamily: 'Helvetica World, Arial, sans-serif',
            width: '80%',
            lineHeight: '1.2'
          }}
        >
          Can you find<br />
          the Southern Cross?<br />
          Drag sky to explore.
        </div>
      </div>

      {/* Audio buttons positioned relative to video section */}
      <div style={{ ...responsive.position.absolute.topRight(), zIndex: 1000, pointerEvents: 'auto' }}>
        <button
          style={{
            width: isMobile ? '200px' : responsive.size.width.chart(),
            height: isMobile ? '200px' : responsive.size.height.chart(),
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowChaukaTooltip(true)}
          aria-label="Click for story"
        >
          <svg width={isMobile ? "200" : "300"} height={isMobile ? "200" : "300"} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
            <defs>
              <radialGradient id="pulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#cad6fa" stopOpacity="1" />
                <stop offset="100%" stopColor="#cad6fa" stopOpacity="0.8" />
              </radialGradient>
              <filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation={isMobile ? "30" : "40"} result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <path id="circlePath" d={isMobile ? "M100,50 A50,50 0 1,1 99.99,50" : "M150,75 A75,75 0 1,1 149.99,75"} />
            </defs>
            <circle cx={isMobile ? "100" : "150"} cy={isMobile ? "100" : "150"} r={isMobile ? "30" : "40"} fill="#cad6fa" style={{ filter: 'url(#glow)' }} />
            <circle cx={isMobile ? "100" : "150"} cy={isMobile ? "100" : "150"} r={isMobile ? "40" : "50"} fill="transparent" style={{ filter: 'url(#glow)', animation: 'pulse 2s ease-in-out infinite', opacity: 0.2 }} />
            <text fill="#94a0c4" fontSize={isMobile ? "14" : "18"} fontWeight="normal" letterSpacing="0.08em">
              <textPath xlinkHref="#circlePath" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                Click for story!
              </textPath>
            </text>
          </svg>
        </button>
      </div>
      
      <div style={{ 
        position: 'absolute',
        bottom: isMobile ? '20px' : '50px',
        left: isMobile ? '10px' : '30px',
        zIndex: 1000, 
        pointerEvents: 'auto' 
      }}>
        <BlueCircleAudioPlayer />
      </div>
      
      {/* Bird audio button - positioned directly on the bird */}
      <div style={{ 
        position: 'absolute', 
        top: (isMobile && isPortrait) ? 'calc(15vh + 15%)' : (isMobile ? 'calc(10vh + 15%)' : 'calc(15vh + 12%)'), 
        left: (isMobile && isPortrait) ? 'calc(80vw * 0.4)' : (isMobile ? 'calc(100vw * 0.16)' : 'calc(100vw * 0.18)'), 
        zIndex: 1000, 
        pointerEvents: 'auto' 
      }}>
        <BirdAudioPlayer />
      </div>
      
      {/* Project attribution - improved mobile positioning */}
      <div style={{ 
        position: 'absolute', 
        bottom: isMobile ? '10px' : responsive.size.spacing.md(), 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 1000, 
        pointerEvents: 'auto'
      }}>
        <div style={{
          fontSize: isMobile ? '0.75rem' : '1rem',
          color: '#676b8b',
          fontWeight: 400,
          textAlign: 'center',
          padding: isMobile ? '0 15px' : '0',
          width: isMobile ? '90vw' : 'auto',
          maxWidth: isMobile ? '400px' : 'none',
          lineHeight: '1.2',
          whiteSpace: 'pre-line'
        }}>
          Storytelling by Bertha <a href="https://www.linkedin.com/in/bertha-ngahan-a9b405145/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#676b8b', fontWeight: 'bold' }}>Ngahan</a> |{'\n'}
          Visualization by Janina <a href="https://www.linkedin.com/in/j-grauel/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#676b8b', fontWeight: 'bold' }}>Grauel</a>
        </div>
      </div>
    </section>
  );
}
