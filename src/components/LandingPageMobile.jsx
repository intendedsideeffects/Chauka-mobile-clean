'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import InteractiveStarGlobe from '../app/components/InteractiveStarGlobe';

// Blue Circle Audio Player Component for Mobile
function BlueCircleAudioPlayerMobile() {
  const [playing, setPlaying] = React.useState(false);
  const [audioElement, setAudioElement] = React.useState(null);

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
      width: '120px', 
      height: '120px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      pointerEvents: 'auto', 
      background: 'none', 
      cursor: 'pointer', 
      opacity: 1, 
      transition: 'opacity 0.4s',
    }} onClick={handleToggle} aria-label="Play or pause ocean sound">
      <svg width="120" height="120" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="pulseBlueMobile" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3d557a" stopOpacity="1" />
            <stop offset="100%" stopColor="#3d557a" stopOpacity="0" />
          </radialGradient>
          <filter id="glowBlueMobile" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="30" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <path id="circlePathBlueTextMobile" d="M45,90 A45,45 0 1,1 135,90" />
        </defs>
        <text fill="#3d557a" fontSize="12" fontWeight="normal" letterSpacing="0.08em">
          <textPath xlinkHref="#circlePathBlueTextMobile" startOffset="0%" dominantBaseline="middle">
            Click for ocean sound!
          </textPath>
        </text>
        <circle cx="90" cy="90" r="36" fill="url(#pulseBlueMobile)" style={{ animation: 'pulseMobile 1.5s infinite', filter: 'url(#glowBlueMobile)' }} />
        <circle cx="90" cy="90" r="22" fill="#3d557a" style={{ filter: 'url(#glowBlueMobile)' }} />
        {!playing && (
          <polygon points="86,84 98,90 86,96" fill="#b8c6e6" style={{ opacity: 1 }} />
        )}
        {playing && (
          <g>
            <rect x="84.5" y="84.5" width="4" height="9" rx="1" fill="#b8c6e6" style={{ opacity: 1 }} />
            <rect x="90.5" y="84.5" width="4" height="9" rx="1" fill="#b8c6e6" style={{ opacity: 1 }} />
          </g>
        )}
      </svg>
      <style>{`
        @keyframes pulseMobile {
          0% { r: 27; opacity: 0.7; }
          50% { r: 36; opacity: 0.2; }
          100% { r: 27; opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

// Bird Audio Player Component for Mobile
function BirdAudioPlayerMobile() {
  const [playing, setPlaying] = React.useState(false);
  const [audioElement, setAudioElement] = React.useState(null);

  React.useEffect(() => {
    const audio = new Audio('/chaukasound.mp3');
    audio.volume = 0.3;
    audio.preload = 'metadata';
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
        await audioElement.play();
        setPlaying(true);
      }
    } catch (error) {
      console.error('Error playing bird audio:', error);
    }
  };

     return (
     <div style={{ 
       width: '60px', 
       height: '60px', 
       display: 'flex', 
       alignItems: 'center', 
       justifyContent: 'center', 
       background: 'none', 
       cursor: 'pointer',
     }} onClick={handleToggle} aria-label="Play or pause Chauka call">
     </div>
   );
}

function LandingPageMobileContent({ 
  showChaukaTooltip, 
  setShowChaukaTooltip, 
  oceanVideoRef 
}) {
  const [isPortrait, setIsPortrait] = React.useState(false);
  const [disableStarControls, setDisableStarControls] = React.useState(false);

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

  // Touch event handlers for star controls
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const touchY = touch.clientY;
    const windowHeight = window.innerHeight;
    
    // Disable star controls in the bottom 40% of the screen to allow page scrolling
    const wavesThreshold = windowHeight * 0.6; // 60% from top = bottom 40%
    setDisableStarControls(touchY > wavesThreshold);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const touchY = touch.clientY;
    const windowHeight = window.innerHeight;
    
    // Update star controls state during touch move
    const wavesThreshold = windowHeight * 0.6;
    setDisableStarControls(touchY > wavesThreshold);
  };

  const handleTouchEnd = () => {
    // Re-enable immediately for better responsiveness
    setDisableStarControls(false);
  };

  return (
    <section 
      style={{ 
        position: 'relative', 
        height: '100vh', 
        width: '100%', 
        background: '#000', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden',
        zIndex: 1,
        isolation: 'isolate',
        scrollSnapAlign: 'start'
      }}
    >
             {/* Star Globe as background */}
       <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: 1 }}>
         <InteractiveStarGlobe />
       </div>
      
      {/* Ocean video overlay, only lower 30% visible, pointer-events: none */}
      <video
        ref={oceanVideoRef}
        src="/ocean_compressed.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          left: 0,
          top: '10vh',
          width: '100vw',
          height: '90vh',
          objectFit: 'cover',
          zIndex: 2,
          pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 59.7%, black 60.7%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 59.7%, black 60.7%, black 100%)',
        }}
      />
      
             {/* Combined bird and boats scene */}
       <img
         src="/chauka_scene.png?v=2"
         alt="Chauka scene with bird and boats"
         style={{
           position: 'absolute',
           left: '0',
           top: '10vh',
           width: '100vw',
           height: '75vh',
           objectFit: 'cover',
           objectPosition: 'center',
           zIndex: 2,
           pointerEvents: 'none',
           userSelect: 'none',
           WebkitUserSelect: 'none',
           MozUserSelect: 'none',
           msUserSelect: 'none'
         }}
       />

      {/* Audio buttons positioned relative to video section */}
      <div style={{ 
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000, 
        pointerEvents: 'auto' 
      }}>
        <button
          style={{
            width: '200px',
            height: '200px',
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
          <svg width="200" height="200" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
            <defs>
              <radialGradient id="pulseMobile" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#cad6fa" stopOpacity="1" />
                <stop offset="100%" stopColor="#cad6fa" stopOpacity="0.8" />
              </radialGradient>
              <filter id="glowMobile" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="30" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <path id="circlePathMobile" d="M100,50 A50,50 0 1,1 99.99,50" />
            </defs>
            <circle cx="100" cy="100" r="30" fill="#cad6fa" style={{ filter: 'url(#glowMobile)' }} />
            <circle cx="100" cy="100" r="40" fill="transparent" style={{ filter: 'url(#glowMobile)', animation: 'pulseMobile 2s ease-in-out infinite', opacity: 0.2 }} />
            <text fill="#94a0c4" fontSize="14" fontWeight="normal" letterSpacing="0.08em">
              <textPath xlinkHref="#circlePathMobile" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                Click for story!
              </textPath>
            </text>
          </svg>
        </button>
      </div>
      
      <div style={{ 
        position: 'absolute',
        bottom: '100px',
        left: '10px',
        zIndex: 1000, 
        pointerEvents: 'auto' 
      }}>
        <BlueCircleAudioPlayerMobile />
      </div>
      
             {/* Bird audio button - positioned directly on the bird */}
       <div style={{ 
         position: 'absolute', 
         top: '25%', 
         left: '28%', 
         zIndex: 1000, 
         pointerEvents: 'auto' 
       }}>
        <BirdAudioPlayerMobile />
      </div>
      
      {/* Scroll down indicator */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        pointerEvents: 'none',
        animation: 'bounce 2s infinite'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M7 10L12 15L17 10" 
            stroke="#ffffff" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.7"
          />
        </svg>
        <style>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            40% {
              transform: translateX(-50%) translateY(-5px);
            }
            60% {
              transform: translateX(-50%) translateY(-3px);
            }
          }
        `}</style>
      </div>

    </section>
  );
}

// Client-side only wrapper to prevent hydration issues
export default function LandingPageMobile(props) {
  return <LandingPageMobileContent {...props} />;
}
