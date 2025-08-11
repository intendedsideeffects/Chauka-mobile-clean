'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import InteractiveStarGlobe from '../app/components/InteractiveStarGlobe';

// Blue Circle Audio Player Component for Browser
function BlueCircleAudioPlayerBrowser() {
  const [playing, setPlaying] = React.useState(false);
  const [showButtons, setShowButtons] = React.useState(true);
  const [audioElement, setAudioElement] = React.useState(null);

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
      width: '240px', 
      height: '240px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      pointerEvents: showButtons ? 'auto' : 'none', 
      background: 'none', 
      cursor: 'pointer', 
      opacity: showButtons ? 1 : 0, 
      transition: 'opacity 0.4s',
    }} onClick={handleToggle} aria-label="Play or pause ocean sound">
      <svg width="240" height="240" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="pulseBlueBrowser" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3d557a" stopOpacity="1" />
            <stop offset="100%" stopColor="#3d557a" stopOpacity="0" />
          </radialGradient>
          <filter id="glowBlueBrowser" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="40" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <path id="circlePathBlueTextBrowser" d="M60,120 A60,60 0 1,1 180,120" />
        </defs>
        <text fill="#3d557a" fontSize="15" fontWeight="normal" letterSpacing="0.08em">
          <textPath xlinkHref="#circlePathBlueTextBrowser" startOffset="0%" dominantBaseline="middle">
            Click for ocean sound!
          </textPath>
        </text>
        <circle cx="120" cy="120" r="48" fill="url(#pulseBlueBrowser)" style={{ animation: 'pulseBrowser 1.5s infinite', filter: 'url(#glowBlueBrowser)' }} />
        <circle cx="120" cy="120" r="30" fill="#3d557a" style={{ filter: 'url(#glowBlueBrowser)' }} />
        {!playing && (
          <polygon points="115,112 131,120 115,128" fill="#b8c6e6" style={{ opacity: 1 }} />
        )}
        {playing && (
          <g>
            <rect x="112.5" y="113.5" width="5" height="12" rx="1.5" fill="#b8c6e6" style={{ opacity: 1 }} />
            <rect x="120.5" y="113.5" width="5" height="12" rx="1.5" fill="#b8c6e6" style={{ opacity: 1 }} />
          </g>
        )}
      </svg>
      <style>{`
        @keyframes pulseBrowser {
          0% { r: 36; opacity: 0.7; }
          50% { r: 48; opacity: 0.2; }
          100% { r: 36; opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

// Bird Audio Player Component for Browser
function BirdAudioPlayerBrowser() {
  const [playing, setPlaying] = React.useState(false);
  const [audioElement, setAudioElement] = React.useState(null);
  const [audioLoaded, setAudioLoaded] = React.useState(false);

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
      width: '120px', 
      height: '120px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'none', 
      cursor: 'pointer',
    }} onClick={handleToggle} aria-label="Play or pause Chauka call">
      <svg width="120" height="120" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {!playing && (
          <polygon points="53,46 74,60 53,74" fill="#676b8b" style={{ opacity: 0.8 }} />
        )}
        {playing && (
          <g>
            <rect x="49" y="47" width="6" height="24" rx="1.5" fill="#676b8b" style={{ opacity: 0.8 }} />
            <rect x="61" y="47" width="6" height="24" rx="1.5" fill="#676b8b" style={{ opacity: 0.8 }} />
          </g>
        )}
      </svg>
    </div>
  );
}

function LandingPageBrowserContent({ 
  showChaukaTooltip, 
  setShowChaukaTooltip, 
  oceanVideoRef 
}) {
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
      zIndex: 1,
      isolation: 'isolate',
      scrollSnapAlign: 'start'
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
          top: '15vh',
          width: '100vw',
          height: '85vh',
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
          top: '15vh',
          width: '100vw',
          height: '85vh',
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
          top: '15vh',
          width: '100vw',
          height: '85vh',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 4,
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      />
      
      {/* Speech bubble - browser positioning */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '40%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <img 
          src="/speechbubble.svg" 
          alt="Speech bubble" 
          style={{ 
            width: '200px', 
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
            fontSize: '12px',
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
      <div style={{ 
        position: 'absolute',
        top: '50px',
        right: '50px',
        zIndex: 1000, 
        pointerEvents: 'auto' 
      }}>
        <button
          style={{
            width: '300px',
            height: '300px',
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
          <svg width="300" height="300" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
            <defs>
              <radialGradient id="pulseBrowser" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#cad6fa" stopOpacity="1" />
                <stop offset="100%" stopColor="#cad6fa" stopOpacity="0.8" />
              </radialGradient>
              <filter id="glowBrowser" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="40" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <path id="circlePathBrowser" d="M150,75 A75,75 0 1,1 149.99,75" />
            </defs>
            <circle cx="150" cy="150" r="40" fill="#cad6fa" style={{ filter: 'url(#glowBrowser)' }} />
            <circle cx="150" cy="150" r="50" fill="transparent" style={{ filter: 'url(#glowBrowser)', animation: 'pulseBrowser 2s ease-in-out infinite', opacity: 0.2 }} />
            <text fill="#94a0c4" fontSize="18" fontWeight="normal" letterSpacing="0.08em">
              <textPath xlinkHref="#circlePathBrowser" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                Click for story!
              </textPath>
            </text>
          </svg>
        </button>
      </div>
      
      <div style={{ 
        position: 'absolute',
        bottom: '50px',
        left: '30px',
        zIndex: 1000, 
        pointerEvents: 'auto' 
      }}>
        <BlueCircleAudioPlayerBrowser />
      </div>
      
      {/* Bird audio button - positioned directly on the bird */}
      <div style={{ 
        position: 'absolute', 
        top: 'calc(15vh + 12%)', 
        left: 'calc(100vw * 0.18)', 
        zIndex: 1000, 
        pointerEvents: 'auto' 
      }}>
        <BirdAudioPlayerBrowser />
      </div>
      
      {/* Project attribution - browser positioning */}
      <div style={{ 
        position: 'absolute', 
        bottom: '24px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 1000, 
        pointerEvents: 'auto'
      }}>
        <div style={{
          fontSize: '1rem',
          color: '#676b8b',
          fontWeight: 400,
          textAlign: 'center',
          lineHeight: '1.2',
          whiteSpace: 'pre-line'
        }}>
          Storytelling by Bertha <a href="https://www.linkedin.com/in/bertha-ngahan-a9b405145/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#676b8b', fontWeight: 'bold' }}>Ngahan</a> |
          Visualization by Janina <a href="https://www.linkedin.com/in/j-grauel/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#676b8b', fontWeight: 'bold' }}>Grauel</a>
        </div>
      </div>
    </section>
  );
}

// Loading component for SSR
function LandingPageBrowserLoading() {
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
      zIndex: 1,
      isolation: 'isolate'
    }}>
      <InteractiveStarGlobe />
    </section>
  );
}

// Client-side only wrapper to prevent hydration issues
export default function LandingPageBrowser(props) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LandingPageBrowserLoading />;
  }

  return (
    <Suspense fallback={<LandingPageBrowserLoading />}>
      <LandingPageBrowserContent {...props} />
    </Suspense>
  );
}
