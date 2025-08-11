'use client';

import React, { useState, useRef, useEffect } from 'react';
import StarBackground from './components/shared/StarBackground';
import { responsive } from './utils/responsive';
import TitleSection from '../components/sections/TitleSection';

import Sec2MobileSeaLevelRise from './components/mobile/Sec2MobileSeaLevelRise';
import Sec1MobileSeaLevelHistory from './components/mobile/Sec1MobileSeaLevelHistory';
import Sec5MobileDisasterImpact from './components/mobile/Sec5MobileDisasterImpact';
import Sec3MobileElevation from './components/mobile/Sec3MobileElevation';
import Sec4MobilePopulationRisk from './components/mobile/Sec4MobilePopulationRisk';

import Sec6MobileOverlayScatter from './components/mobile/Sec6MobileOverlayScatter';
import LandingPage from '../components/LandingPageMobile';

export default function TestScroll() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isOceanPlaying, setIsOceanPlaying] = useState(true);
  const [showLepeyamTooltip, setShowLepeyamTooltip] = useState(false);
  const [showChaukaTooltip, setShowChaukaTooltip] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicAudioLoaded, setMusicAudioLoaded] = useState(false);
  const [musicAudioError, setMusicAudioError] = useState(false);
  const [musicAudioElement, setMusicAudioElement] = useState(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const videoRef = useRef();
  const oceanVideoRef = useRef();

  // Add orientation detection for portrait mobile
  useEffect(() => {
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

  // Ensure video plays properly
  useEffect(() => {
    if (videoRef.current) {
      // Start muted to ensure autoplay works
      videoRef.current.muted = true;
      videoRef.current.volume = 1.0;
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Autoplay failed:', error);
        });
      }
    }
  }, []);

  // Ensure ocean video is always muted
  useEffect(() => {
    if (oceanVideoRef.current) {
      oceanVideoRef.current.muted = true;
      oceanVideoRef.current.volume = 0;
    }
  }, []);

  // Enable sound on first user interaction
  useEffect(() => {
    const enableSound = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
      }
      // Remove event listeners after first interaction
      document.removeEventListener('click', enableSound);
      document.removeEventListener('keydown', enableSound);
      document.removeEventListener('touchstart', enableSound);
    };

    document.addEventListener('click', enableSound);
    document.addEventListener('keydown', enableSound);
    document.addEventListener('touchstart', enableSound);

    return () => {
      document.removeEventListener('click', enableSound);
      document.removeEventListener('keydown', enableSound);
      document.removeEventListener('touchstart', enableSound);
    };
  }, []);

  // Enable sound on hover
  const handleVideoHover = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
    }
  };

  // Disable sound when not hovering
  const handleVideoLeave = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  };

  // Pause/play logic for video
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        // Enable sound and play when user clicks
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch((error) => {
          console.log('Manual play failed:', error);
          // If unmuted play fails, try muted
          videoRef.current.muted = true;
          videoRef.current.play();
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Music button functions
  const handleMusicToggle = () => {
    console.log('Music button clicked!', { musicAudioLoaded, musicAudioError, musicAudioElement, musicPlaying });
    if (!musicAudioElement) {
      console.log('No music audio element found');
      return;
    }
    
    if (musicAudioElement) {
      if (musicPlaying) {
        console.log('Pausing music audio');
        musicAudioElement.pause();
      } else {
        console.log('Playing music audio');
        musicAudioElement.play().catch(error => {
          console.error('Error playing music audio:', error);
        });
      }
    }
  };

  const handleMusicStateChange = ({ playing: newPlaying, audioLoaded: newAudioLoaded, audioError: newAudioError }) => {
    console.log('Music state change:', { newPlaying, newAudioLoaded, newAudioError });
    setMusicPlaying(newPlaying);
    setMusicAudioLoaded(newAudioLoaded);
    setMusicAudioError(newAudioError);
  };

  const handleMusicAudioRef = (audio) => {
    setMusicAudioElement(audio);
  };

  return (
    <div style={{ 
      scrollSnapType: (responsive.isMobile() && isPortrait) ? 'none' : 'y mandatory', 
      height: (responsive.isMobile() && isPortrait) ? 'auto' : '100vh', 
      overflowY: 'auto', 
      overflowX: 'visible', 
        position: 'relative', 
      minHeight: '100vh',
      isolation: 'isolate' // Create new stacking context
    }}>
      {/* Landing Page Section */}
      <LandingPage 
        showChaukaTooltip={showChaukaTooltip}
        setShowChaukaTooltip={setShowChaukaTooltip}
        oceanVideoRef={oceanVideoRef}
      />

      {/* Chauka Story Tooltip */}
      {showChaukaTooltip && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          color: '#000',
          ...responsive.container.modal(),
          maxHeight: '80vh',
          overflowY: 'auto',
          zIndex: 10000,
          fontFamily: 'Helvetica World, Arial, sans-serif',
          fontSize: responsive.size.fontSize.md(),
          lineHeight: '1.6',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: responsive.size.spacing.md() }}>
            This video collage is inspired by the Chauka, a bird found only on Manus Island in Papua New Guinea. It plays a role in daily life and is deeply respected, appearing often in local stories. People say its calls help mark the passage of time, acting as a kind of timekeeper. But in many legends, the Chauka also appears as a warning.
          </div>
          
          <div style={{ marginBottom: responsive.size.spacing.md() }}>
            The story behind this visualization is about a man who brings home his newly wed wife. But soon the Chauka begins calling again and again. The villagers are alert, they sense something is wrong. The woman is not who she says she is. She is a spirit in disguise. The villagers listen to the bird and decide to leave the island by boat.
          </div>
          
          <div style={{ marginBottom: responsive.size.spacing.md() }}>
            Stories like this are still told on Manus. The Chauka is seen as a bird that notices things before people do. It speaks up when something is off, when something is coming.
          </div>
          
          <div style={{ 
            fontStyle: 'italic', 
            fontSize: responsive.size.fontSize.sm(), 
            opacity: 0.8,
            borderTop: '1px solid rgba(0,0,0,0.2)',
            paddingTop: responsive.size.spacing.sm(),
            marginTop: responsive.size.spacing.md()
          }}>
            Note: We worked with local knowledge through Bertha, who is from Manus. While we couldn't capture the full version of the story in time for this release, we hope to return to it and share more when the moment is right.
          </div>
          
          <button 
            onClick={() => setShowChaukaTooltip(false)}
            style={{
              position: 'absolute',
              top: responsive.size.spacing.sm(),
              right: responsive.size.spacing.sm(),
              background: 'none',
              border: 'none',
              color: '#333',
              fontSize: responsive.size.fontSize.xl(),
              cursor: 'pointer',
              padding: responsive.size.spacing.xs(),
              borderRadius: '50%',
              width: responsive.size.icon.medium(),
              height: responsive.size.icon.medium(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>
      )}

      {/* Title Section */}
        <TitleSection />

                                                          {/* ExtinctSpeciesViz Scatter Plot Overlay - spans segments 2-7 */}
                                    <div style={{
                                      position: 'absolute',
                                      top: '475vh', // Start at beginning of section 3 (Title: 100vh + Sec1: 200vh + Sec2: 175vh = 475vh)
                                      left: responsive.size.spacing.md(),
                                      width: `calc(100vw - ${responsive.isMobile() ? '32px' : '40px'})`,
                                      height: '1300vh', // Adjusted height to ensure full 9000px scatterplot is visible from beginning of section 3 (475vh) to well beyond end of section 7
                                      zIndex: 100, // Lower z-index to not interfere with section 1
                                      pointerEvents: 'none', // Don't capture pointer events for the container itself
                  borderRadius: '8px',
                  opacity: 1, // Always visible
                  display: 'block', // Always visible
                  overflow: 'visible' // Allow scatterplot to extend fully
                }}>
        <Sec6MobileOverlayScatter />
      </div>

      {/* Test Segment Template */}
              <div style={{position: 'relative', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', minHeight: '200vh'}}>
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: responsive.isMobile() ? '2.5rem' : '20px',
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>1</div>
        
        {/* Simple consistent layout */}
        <div style={{
          paddingTop: '10rem',
          paddingLeft: responsive.isMobile() ? '2.5rem' : '20px',
          paddingRight: responsive.isMobile() ? '2.5rem' : '20px',
          maxWidth: '800px'
        }}>
          {/* Title */}
          <h1 style={{
            fontSize: '2.6rem',
            fontWeight: 'normal',
            fontFamily: 'Helvetica World, Arial, sans-serif',
            margin: '0 0 1rem 0',
            lineHeight: '1.0',
            position: 'relative',
            zIndex: 10000,
            color: '#000'
          }}>Sea levels held steady for a millennium,</h1>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            fontFamily: 'Times New Roman, serif',
            fontStyle: 'italic',
            margin: '0 0 2rem 0',
            lineHeight: '1.0',
            position: 'relative',
            zIndex: 10000,
            color: '#000'
          }}>until now.</h2>
          
          {/* Text */}
          <p style={{
            fontSize: '1.1rem',
            color: '#000',
            lineHeight: 1.5,
            fontFamily: 'Helvetica World, Arial, sans-serif',
            margin: '0 0 2rem 0'
          }} dangerouslySetInnerHTML={{ __html: "For most of the past millennium, sea levels remained relatively stable. But since the late 19th century, they have <strong>risen sharply</strong> due to climate-driven ocean warming and ice melt. Flooding worsens, drinking water is affected, and <strong>coastal communities are under threat</strong>." }} />
          
          {/* Chart */}
          <div style={{
            marginBottom: '1rem',
            marginTop: responsive.isMobile() ? '18rem' : '0px',
            width: '100%',
            overflow: 'visible',
            boxSizing: 'border-box',
            marginRight: responsive.isMobile() ? '10px' : '0px'
          }}>
            <Sec1MobileSeaLevelHistory />
          </div>
          
          {/* Caption */}
          <p style={{
            fontSize: '0.9rem',
            color: '#9ca3af',
            fontStyle: 'italic',
            lineHeight: 1.4,
            margin: 0,
            marginTop: responsive.isMobile() ? '3rem' : '0px'
          }} dangerouslySetInnerHTML={{ __html: "<strong>Fig 1:</strong> Global mean sea level from the year 1000 to present, shown relative to the approximate year 2000 baseline (0 cm). The projection to 2050 assumes 1.5°C to 2.0°C of global warming. Data: Kopp <a href='https://www.pnas.org/doi/10.1073/pnas.1517056113' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a> and NASA <a href='http://podaac.jpl.nasa.gov/dataset/MERGED_TP_J1_OSTM_OST_ALL_V52' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a>" }} />
          
          {/* Projection Annotation */}
          <div style={{
            position: 'absolute',
            right: responsive.isMobile() ? '4rem' : '20px',
            top: responsive.isMobile() ? 'calc(50% - 50px)' : '50%',
            transform: 'translateY(-50%)',
            fontSize: responsive.isMobile() ? '0.8rem' : '1rem',
            fontFamily: 'Helvetica World, Arial, sans-serif',
            color: '#000000',
            fontWeight: 'normal',
            lineHeight: '1.4',
            maxWidth: responsive.isMobile() ? '180px' : '300px',
            textAlign: responsive.isMobile() ? 'right' : 'right',
            zIndex: 10001
          }}>
            <strong>Projection</strong><br/>
            Under 1.5°C to 2.0°C of global warming, sea level rise is expected to increase by <strong>~25 cm in 2050.</strong>
          </div>
        </div>
        

        

      </div>

      {/* Another test segment */}
      <div style={{position: 'relative', borderBottom: '1px solid #e5e7eb', minHeight: '175vh'}}>
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: responsive.isMobile() ? '2.5rem' : '20px',
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>2</div>
        
        {/* Simple consistent layout */}
        <div style={{
          paddingTop: '10rem',
          paddingLeft: responsive.isMobile() ? '2.5rem' : '20px',
          paddingRight: responsive.isMobile() ? '2.5rem' : '20px',
          maxWidth: '800px'
        }}>
          {/* Title */}
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'normal',
            fontFamily: 'Helvetica World, Arial, sans-serif',
            margin: '0 0 1rem 0',
            lineHeight: '1.0',
            color: '#000'
          }}>Sea level is rising,</h1>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            fontFamily: 'Times New Roman, serif',
            fontStyle: 'italic',
            margin: '0 0 2rem 0',
            lineHeight: '1.0',
            color: '#000'
          }}>but not at the same rate.</h2>
          
          {/* Text */}
          <p style={{
            fontSize: '1.1rem',
            color: '#000',
            lineHeight: 1.5,
            fontFamily: 'Helvetica World, Arial, sans-serif',
            margin: '0 0 2rem 0'
          }} dangerouslySetInnerHTML={{ __html: "Sea level rise is <strong>uneven</strong>. The Pacific is a <strong>hotspot</strong>. Driven by ocean patterns, melting ice, and land movement, some islands are seeing <strong>faster-than-average</strong> increases. For nations with limited land and elevation, these trends bring real and immediate threats." }} />
          
          {/* Chart */}
          <div style={{
            marginBottom: '1rem',
            marginTop: responsive.isMobile() ? '15rem' : '0px',
            width: '100%',
            overflow: 'visible',
            boxSizing: 'border-box',
            marginLeft: responsive.isMobile() ? '10px' : '0px',
            marginRight: responsive.isMobile() ? '10px' : '0px'
          }}>
            <Sec2MobileSeaLevelRise />
          </div>
          
          {/* Caption */}
          <p style={{
            fontSize: '0.9rem',
            color: '#9ca3af',
            fontStyle: 'italic',
            lineHeight: 1.4,
            margin: 0,
            marginTop: responsive.isMobile() ? '3rem' : '0px'
          }} dangerouslySetInnerHTML={{ __html: "<strong>Fig 2:</strong> Projected sea level rise scenarios, across selected Pacific Island nations. Data: Pacific Flooding Analysis Tool <a href='https://sealevel.nasa.gov/flooding-analysis-tool-pacific-islands/sea-level-rise?station-id=018&units=meters' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a>" }} />
        </div>
      </div>

      {/* Test segment with two-line title */}
      <div style={{position: 'relative', borderBottom: '1px solid #e5e7eb', minHeight: '200vh'}}>
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: responsive.isMobile() ? '2.5rem' : '20px',
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>3</div>
        
        {/* Simple consistent layout */}
        <div style={{
          paddingTop: '10rem',
          paddingLeft: responsive.isMobile() ? '2.5rem' : '20px',
          paddingRight: responsive.isMobile() ? '2.5rem' : '20px',
          maxWidth: '800px'
        }}>
          {/* Title */}
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'normal',
            fontFamily: 'Helvetica World, Arial, sans-serif',
            margin: '0 0 1rem 0',
            lineHeight: '1.0',
            color: '#000'
          }}>Impact varies across Pacific islands</h1>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            fontFamily: 'Times New Roman, serif',
            fontStyle: 'italic',
            margin: '0 0 2rem 0',
            lineHeight: '1.0',
            color: '#000'
          }}>low-laying islands are exposed more.</h2>
          
          {/* Text */}
          <p style={{
            fontSize: '1.1rem',
            color: '#000',
            lineHeight: 1.5,
            fontFamily: 'Helvetica World, Arial, sans-serif',
            margin: '0 0 2rem 0'
          }} dangerouslySetInnerHTML={{ __html: "Low elevation makes many Pacific islands especially vulnerable to sea level rise. When land sits just a few meters above the ocean, even small increases can <strong>overwhelm coastlines</strong>. With nowhere higher to go, communities face growing challenges to stay safe, maintain clean water, and protect their homes." }} />
          
          {/* Chart */}
          <div style={{
            marginBottom: '1rem',
            marginTop: responsive.isMobile() ? '5.25rem' : '0px',
            width: '100%',
            overflow: 'visible',
            boxSizing: 'border-box',
            marginLeft: responsive.isMobile() ? '10px' : '0px',
            marginRight: responsive.isMobile() ? '10px' : '0px'
          }}>
            <Sec3MobileElevation />
          </div>
          
          {/* Caption */}
          <p style={{
            fontSize: '0.9rem',
            color: '#9ca3af',
            fontStyle: 'italic',
            lineHeight: 1.4,
            margin: 0
          }} dangerouslySetInnerHTML={{ __html: "<strong>Fig 3:</strong> Average elevation of selected Pacific Island nations and territories. Data: Wikipedia <a href='https://en.wikipedia.org/wiki/List_of_elevation_extremes_by_country?utm_source=chatgpt.com' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a>" }} />
        </div>
      </div>

      {/* New Segment 6 */}
      <div style={{position: 'relative', borderBottom: '1px solid #e5e7eb', minHeight: '200vh'}}>
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: responsive.isMobile() ? '2.5rem' : '20px',
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>4</div>
        
        {/* Simple consistent layout */}
        <div style={{
          paddingTop: '10rem',
          paddingLeft: responsive.isMobile() ? '2.5rem' : '20px',
          paddingRight: responsive.isMobile() ? '2.5rem' : '20px',
          maxWidth: '800px'
        }}>
          {/* Title */}
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'normal',
            fontFamily: 'Helvetica World, Arial, sans-serif',
            margin: '0 0 1rem 0',
            lineHeight: '1.0',
            color: '#000'
          }}>Many islanders live just above sea level,</h1>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            fontFamily: 'Times New Roman, serif',
            fontStyle: 'italic',
            margin: '0 0 2rem 0',
            lineHeight: '1.0',
            color: '#000'
          }}>where sea rise is already felt.</h2>
          
          {/* Text */}
          <p style={{
            fontSize: '1.1rem',
            color: '#000',
            lineHeight: 1.5,
            fontFamily: 'Helvetica World, Arial, sans-serif',
            margin: '0 0 2rem 0'
          }} dangerouslySetInnerHTML={{ __html: "Many Pacific Island nations have significant <strong>populations living in low-lying coastal areas</strong>. These communities are <strong>particularly vulnerable</strong> to sea level rise and coastal flooding, as even small increases in sea level can have dramatic impacts on their daily lives and infrastructure." }} />
          
          {/* Chart */}
          <div style={{
            marginBottom: '1rem',
            marginTop: responsive.isMobile() ? '6rem' : '0px',
            width: '100%',
            overflow: 'visible',
            boxSizing: 'border-box',
            marginLeft: responsive.isMobile() ? '10px' : '0px',
            marginRight: responsive.isMobile() ? '10px' : '0px'
          }}>
            <Sec4MobilePopulationRisk />
          </div>
          
          {/* Caption */}
          <p style={{
            fontSize: '0.9rem',
            color: '#9ca3af',
            fontStyle: 'italic',
            lineHeight: 1.4,
            margin: 0
          }} dangerouslySetInnerHTML={{ __html: "<strong>Fig 4:</strong> Percentage of national populations living between 0–5 meters above sea level in selected Pacific Island nations. Data: Pacific Data Hub <a href='https://pacificdata.org/data/dataset/population-living-in-low-elevation-coastal-zones-0-10m-and-0-20m-above-sea-level-df-pop-lecz' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a>" }} />
        </div>
      </div>

            {/* Segment 7 */}
      <div style={{position: 'relative', borderBottom: '1px solid #e5e7eb', minHeight: '200vh'}}>
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: responsive.isMobile() ? '2.5rem' : '20px',
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>5</div>
        
        {/* Simple consistent layout */}
        <div style={{
          paddingTop: '10rem',
          paddingLeft: responsive.isMobile() ? '2.5rem' : '20px',
          paddingRight: responsive.isMobile() ? '2.5rem' : '20px',
          maxWidth: '800px'
        }}>
          {/* Title */}
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'normal',
            fontFamily: 'Helvetica World, Arial, sans-serif',
            margin: '0 0 1rem 0',
            lineHeight: '1.0',
            color: '#000'
          }}>Climate risks are rising in the Pacific.</h1>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            fontFamily: 'Times New Roman, serif',
            fontStyle: 'italic',
            margin: '0 0 2rem 0',
            lineHeight: '1.0',
            color: '#000'
          }}>So is human impact.</h2>
          
          {/* Text */}
          <p style={{
            fontSize: '1.1rem',
            color: '#000',
            lineHeight: 1.5,
            fontFamily: 'Helvetica World, Arial, sans-serif',
            margin: '0 0 2rem 0'
          }} dangerouslySetInnerHTML={{ __html: "Flooding is not the only threat. Cyclones, droughts, and heat extremes are also affecting more people across the Pacific. While impacts vary by island and year, some nations have seen sharp spikes in those affected. The trend points to growing vulnerability as the climate continues to change." }} />
          
          {/* Chart */}
          <div style={{
            marginBottom: '1rem',
            width: '100%',
            overflow: 'visible',
            boxSizing: 'border-box',
                          transform: responsive.isMobile() ? 'scale(0.9)' : 'scale(1)',
              transformOrigin: 'center top',
              marginLeft: '10px',
              marginRight: '0px',
              marginTop: responsive.isMobile() ? '6rem' : '0px'
          }}>
            <Sec5MobileDisasterImpact />
          </div>
          
          {/* Caption */}
          <p style={{
            fontSize: '0.9rem',
            color: '#9ca3af',
            fontStyle: 'italic',
            lineHeight: 1.4,
            margin: 0,
            marginTop: responsive.isMobile() ? '3rem' : '0px'
          }} dangerouslySetInnerHTML={{ __html: "<strong>Fig 5:</strong> Number of people affected by climate-related hazards in the Pacific, 2005–2023. Data: Pacific Data Hub <a href='https://blue-pacific-2050.pacificdata.org/climate-change-and-disasters/indicators?outcome=1.0' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a> and EM-DAT <a href='https://public.emdat.be/data' target='_blank' style='color: #9ca3af; text-decoration: underline;'>(link)</a>" }} />
        </div>
      </div>



             {/* New Segment */}
      {/* Section 9 - HIDDEN FOR NOW */}
      {/* <div style={{position: 'relative'}}>
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>9</div>
        <SegmentTemplate
          header="Placeholder Header"
          text="Placeholder text for the new segment that will be added here. This section will contain new content and potentially a new visualization."
          styles={{
            header: {
              fontSize: '2.5rem',
              fontWeight: 'normal',
              fontFamily: 'Helvetica World, Arial, sans-serif'
            }
          }}
        />
      </div> */}



      {/* Placeholder Segment 9 */}
      <div style={{position: 'relative', borderBottom: '1px solid #e5e7eb', minHeight: '200vh'}}>
                <div style={{
          position: 'absolute',
          top: '1rem',
          left: responsive.isMobile() ? '2.5rem' : '20px',
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>6</div>
        
        {/* Simple consistent layout */}
        <div style={{
          paddingTop: '10rem',
          paddingLeft: responsive.isMobile() ? '2.5rem' : '20px',
          paddingRight: responsive.isMobile() ? '2.5rem' : '20px',
          maxWidth: '800px'
        }}>
          {/* Title */}
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'normal',
            fontFamily: 'Helvetica World, Arial, sans-serif',
            margin: '0 0 1rem 0',
            lineHeight: '1.0',
            color: '#000'
          }}>Conclusion</h1>
          
          {/* Text */}
          <p style={{
            fontSize: '1.1rem',
            color: '#000',
            lineHeight: 1.5,
            fontFamily: 'Helvetica World, Arial, sans-serif',
            margin: '0 0 2rem 0'
          }} dangerouslySetInnerHTML={{ __html: "The Pacific is on the front lines of the climate crisis. While sea levels are rising globally, their impacts are not evenly distributed. Low-lying island nations such as <strong>Tuvalu</strong>, <strong>Kiribati</strong>, and the <strong>Marshall Islands</strong>, with an average elevation of just 2 meters, face an existential threat from even modest increases in sea level. These islands have little elevation to buffer rising tides and no higher ground for retreat.<br/><br/>But elevation alone does not tell the full story. <strong>Ocean currents</strong>, <strong>land movement</strong>, and <strong>storm exposure</strong> all contribute to risk, making some regions more vulnerable than others. Climate hazards that were once rare are becoming more frequent and disruptive.<br/><br/>In recent years, hundreds of thousands of people in the Pacific have been affected by floods, cyclones, and droughts, showing a sharp rise in human impact.<br/><br/>The data points to a clear trend: as the climate warms, the risks for Pacific communities are increasing. What is happening in these islands is not just a warning, but a preview of what coastal regions around the world may face if emissions and sea level rise are not brought under control.<br/><br/>And yet, these islands are not only sites of risk. They are also places of <strong>resilience</strong>. Across the region, communities are responding with <strong>deep-rooted knowledge</strong>, <strong>creative adaptation</strong>, and <strong>collective action</strong>. From youth-led campaigns to cultural expression and traditional practices, Pacific peoples are drawing on both <strong>heritage</strong> and <strong>innovation</strong> to protect what matters.<br/><br/>The rising sea threatens homes and homelands, but it cannot erase <strong>identity</strong>, <strong>memory</strong>, or the <strong>will to adapt</strong>.<br/><br/>This is not only a story of loss. It is also one of <strong>resilience</strong>." }} />
        </div>
      </div>





       {/* Final Section - Custom styled without chart */}
       <div style={{position: 'relative', borderBottom: '1px solid #e5e7eb'}}>
                 <div style={{
          position: 'absolute',
          top: '1rem',
          left: responsive.isMobile() ? '2.5rem' : '20px',
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>7</div>
                                                 <section style={{
          width: '100%',
          height: '360vh',
          background: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          scrollSnapAlign: 'start',
          borderBottom: '1px solid #e5e7eb',
        }}>


           {/* Star Globe in front of sunrise */}
             <div style={{
             position: 'absolute', 
             top: 0, 
             left: 0, 
               width: '100%',
             height: '100%', 
             zIndex: 20, 
             pointerEvents: 'auto'
           }}>
             <StarBackground variant="section7" platform="mobile" />
             </div>

             {/* Click for Story Button */}
                                 <button
              style={{
                position: 'absolute',
                bottom: responsive.isMobile() ? '1rem' : '4rem',
                left: responsive.isMobile() ? '1rem' : '4rem',
                width: responsive.isMobile() ? '280px' : '300px',
                height: responsive.isMobile() ? '280px' : '300px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                                 zIndex: 999999,
              }}
          onClick={() => {
            console.log('Click for Story button clicked!');
            setShowLepeyamTooltip(true);
          }}
          aria-label="Click for story"
        >
               <svg width={responsive.isMobile() ? "280" : "300"} height={responsive.isMobile() ? "280" : "300"} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
                 <defs>
                   <radialGradient id="pulse-section7" cx="50%" cy="50%" r="50%">
                     <stop offset="0%" stopColor="#cad6fa" stopOpacity="1" />
                     <stop offset="100%" stopColor="#cad6fa" stopOpacity="0.8" />
                   </radialGradient>
                   <filter id="glow-section7" x="-200%" y="-200%" width="500%" height="500%">
                     <feGaussianBlur stdDeviation="40" result="coloredBlur" />
                     <feMerge>
                       <feMergeNode in="coloredBlur" />
                       <feMergeNode in="SourceGraphic" />
                     </feMerge>
                   </filter>
                   <path id="circlePath-section7" d="M150,75 A75,75 0 1,1 149.99,75" />
                 </defs>
                 <circle cx="150" cy="150" r="40" fill="#cad6fa" style={{ filter: 'url(#glow-section7)' }} />
                 <circle cx="150" cy="150" r="50" fill="transparent" style={{ filter: 'url(#glow-section7)', animation: 'pulse 2s ease-in-out infinite', opacity: 0.2 }} />
                 <text fill="#94a0c4" fontSize="18" fontWeight="normal" letterSpacing="0.08em">
                   <textPath xlinkHref="#circlePath-section7" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                     Click for story!
                   </textPath>
                 </text>
               </svg>
             </button>

             {/* Click for Music Button */}
             <div
               style={{
                 position: 'absolute',
                 top: responsive.isMobile() ? '1rem' : '4rem',
                 right: responsive.isMobile() ? '2rem' : '4rem',
                 width: responsive.isMobile() ? '200px' : '240px',
                 height: responsive.isMobile() ? '200px' : '240px',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 pointerEvents: 'auto',
                 background: 'none',
                 cursor: 'pointer',
                 zIndex: 30,
               }}
               onClick={handleMusicToggle}
               aria-label="Play or pause music"
             >
               <AudioPlayer
                 id="music-audio"
                 src="/Leve Yam_compressed.mp3"
                 volume={0.3}
                 loop={true}
                 onEnded={() => setMusicPlaying(false)}
                 onStateChange={handleMusicStateChange}
                 onRef={handleMusicAudioRef}
               />
               <svg width={responsive.isMobile() ? "200" : "240"} height={responsive.isMobile() ? "200" : "240"} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
                 <defs>
                   <radialGradient id="pulseMusic" cx="50%" cy="50%" r="50%">
                     <stop offset="0%" stopColor="#3d557a" stopOpacity="1" />
                     <stop offset="100%" stopColor="#3d557a" stopOpacity="0" />
                   </radialGradient>
                   <filter id="glowMusic" x="-200%" y="-200%" width="500%" height="500%">
                     <feGaussianBlur stdDeviation="40" result="coloredBlur" />
                     <feMerge>
                       <feMergeNode in="coloredBlur" />
                       <feMergeNode in="SourceGraphic" />
                     </feMerge>
                   </filter>
                   <path id="circlePathMusicText" d="M60,130 A60,60 0 1,1 180,130" />
                 </defs>
                 <text fill="#3d557a" fontSize="15" fontWeight="normal" letterSpacing="0.08em">
                   <textPath xlinkHref="#circlePathMusicText" startOffset="0%" textAnchor="start" dominantBaseline="middle">
                     Click for music!
                   </textPath>
                 </text>
                 <circle cx="120" cy="120" r="48" fill="url(#pulseMusic)" style={{ animation: 'pulse 1.5s infinite', filter: 'url(#glowMusic)' }} />
                 <circle cx="120" cy="120" r="30" fill="#3d557a" style={{ filter: 'url(#glowMusic)' }} />
                 {!musicPlaying && (
                   <polygon points="115,112 131,120 115,128" fill="#b8c6e6" style={{ opacity: 1 }} />
                 )}
                 {musicPlaying && (
                   <g>
                     <rect x="112.5" y="113.5" width="5" height="12" rx="1.5" fill="#b8c6e6" style={{ opacity: 1 }} />
                     <rect x="120.5" y="113.5" width="5" height="12" rx="1.5" fill="#b8c6e6" style={{ opacity: 1 }} />
                   </g>
                 )}
               </svg>
               {musicAudioError && (
                 <div style={{ position: 'absolute', top: 10, left: 10, color: 'red', background: 'rgba(0,0,0,0.7)', padding: '8px 16px', borderRadius: 8, zIndex: 20 }}>
                   Audio failed to load.
                 </div>
               )}
               <style>{`
                 @keyframes pulse {
                   0% { r: 36; opacity: 0.7; }
                   50% { r: 48; opacity: 0.2; }
                   100% { r: 36; opacity: 0.7; }
                 }
               `}</style>
             </div>

             {/* Lepeyam Story Tooltip */}
             {showLepeyamTooltip && (
               <div                style={{
                 position: responsive.isMobile() ? 'absolute' : 'fixed',
                 top: responsive.isMobile() ? '2rem' : '50%',
                 left: responsive.isMobile() ? '2rem' : '50%',
                 right: responsive.isMobile() ? '2rem' : 'auto',
                 transform: responsive.isMobile() ? 'none' : 'translate(-50%, -50%)',
                 backgroundColor: 'rgba(255, 255, 255, 0.8)',
                 color: '#222',
                 ...responsive.container.modal(),
                 maxHeight: responsive.isMobile() ? '70vh' : '80vh',
                 overflowY: 'auto',
                 zIndex: 999999,
                 fontFamily: 'Helvetica World, Arial, sans-serif',
                 fontSize: responsive.size.fontSize.md(),
                 lineHeight: '1.6',
                 boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                 backdropFilter: 'blur(10px)',
                 border: '1px solid rgba(0,0,0,0.1)'
               }}>
                 <h2 style={{ 
                   marginBottom: responsive.size.spacing.md(), 
                   fontSize: responsive.size.fontSize.xl(), 
                   fontWeight: 'bold',
                   color: '#333'
                 }}>
                   Lepeyam
                 </h2>
                 
                 <div style={{ 
                   fontStyle: 'italic', 
                   fontSize: responsive.size.fontSize.sm(), 
                   opacity: 0.8,
                   marginBottom: responsive.size.spacing.md(),
                   color: '#666'
                 }}>
                   Translated from Tok Pisin
                 </div>
                 
                 <div style={{ marginBottom: responsive.size.spacing.md() }}>
                   Lepeyam was a woman from Htopolonu who lived with her children in the village. One day, people were preparing for a big cultural celebration with dancing, singing, and traditional food. Many women were fetching water from a tap at the park using plastic containers.
                 </div>
                 
                 <div style={{ marginBottom: responsive.size.spacing.md() }}>
                   Lepeyam told one of them, "You and your children should fetch water too." But when they got to the tap, a strange woman was already there. She was not from the village. She was a masalai meri, a spirit woman. She blocked Lepeyam and her children from collecting water. Then, without speaking, she filled their containers for them and disappeared.
                 </div>
                 
                 <div style={{ marginBottom: responsive.size.spacing.md() }}>
                   That night, the masalai came to Lepeyam in her sleep. She sang a chant in a language Lepeyam could not understand. In the chant, she mentioned the Chauka bird. In Manus, the Chauka is known as a signal bird, used to mark time or warn of changes. The dream left Lepeyam confused and unsettled.
                 </div>
                 
                 <div style={{ marginBottom: responsive.size.spacing.md() }}>
                   The next morning, she left the house without saying anything. She walked out of the village as if in a trance, following a voice that only she could hear. She was gone for days.
                 </div>
                 
                 <div style={{ marginBottom: responsive.size.spacing.md() }}>
                   While she was missing, a kind couple took in her children. They brought them home, gave them food, and looked after them. One of the grandmothers told the children not to worry. She cooked food from the garden and sat with them. When they were ready to eat, she asked gently, "Do you know how to eat properly with your hands like we do here?" Then she showed them how.
                 </div>
                 
                 <div style={{ marginBottom: responsive.size.spacing.md() }}>
                   Days later, Lepeyam returned. She was dirty and tired. People saw her drinking from puddles and chewing betelnut. Her body looked thin, and her behavior was strange. The masalai had taken her into the bush and taught her strange ways.
                 </div>
                 
                 <div style={{ marginBottom: responsive.size.spacing.md() }}>
                   When she came back to the village, people gathered and called her children. "Here is your mother," they said. But the children did not recognize her.
                 </div>
                 
                 <div style={{ marginBottom: responsive.size.spacing.md() }}>
                   Lepeyam sat quietly. Sometimes she took food from other people's plates. Her voice and movements were not her own. At one point, the real masalai woman appeared again, dancing and talking in riddles. She took food and spoke as if through Lepeyam.
                 </div>
                 
                 <div style={{ marginBottom: responsive.size.spacing.md() }}>
                   Eventually, the villagers brought Lepeyam back to her house. She sat down with her children and said softly, "I am still your mother, but I am not the same."
                 </div>
                 
                 <div style={{ 
                   fontStyle: 'italic', 
                   fontSize: responsive.size.fontSize.sm(), 
                   opacity: 0.8,
                   borderTop: '1px solid rgba(0,0,0,0.2)',
                   paddingTop: responsive.size.spacing.sm(),
                   marginTop: responsive.size.spacing.md()
                 }}>
                   This story was later turned into a traditional song and dance performance.
                 </div>
                 
                 <button 
                   onClick={() => setShowLepeyamTooltip(false)}
                   style={{
                     position: 'absolute',
                     top: responsive.size.spacing.sm(),
                     right: responsive.size.spacing.sm(),
                     background: 'none',
                     border: 'none',
                     color: '#333',
                     fontSize: responsive.size.fontSize.xl(),
                     cursor: 'pointer',
                     padding: responsive.size.spacing.xs(),
                     borderRadius: '50%',
                     width: responsive.size.icon.medium(),
                     height: responsive.size.icon.medium(),
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     transition: 'background-color 0.2s'
                   }}
                   onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.1)'}
                   onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                 >
                   ×
                 </button>
               </div>
             )}


             

         </section>
      </div>

      {/* Section 11 - Material and Method */}
      <div style={{position: 'relative', borderBottom: '1px solid #e5e7eb'}}>
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: responsive.isMobile() ? '2.5rem' : '20px',
          fontSize: '5rem',
          color: 'rgba(0,0,0,0.10)',
          fontWeight: 900,
          zIndex: 2000,
          pointerEvents: 'none',
        }}>8</div>
        {/* Simple consistent layout */}
        <div style={{
          paddingTop: '10rem',
          paddingLeft: responsive.isMobile() ? '2.5rem' : '20px',
          paddingRight: responsive.isMobile() ? '2.5rem' : '20px',
          maxWidth: '800px'
        }}>
          {/* Title */}
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'normal',
            fontFamily: 'Helvetica World, Arial, sans-serif',
            margin: '0 0 1rem 0',
            lineHeight: '1.0',
            color: '#000'
          }}>Material and Method</h1>
          
          {/* Text */}
          <p style={{
            fontSize: '1.1rem',
            color: '#000',
            lineHeight: 1.5,
            fontFamily: 'Helvetica World, Arial, sans-serif',
            margin: '0 0 2rem 0'
          }} dangerouslySetInnerHTML={{ __html: "This project is built with <strong>Next.js</strong>, <strong>React</strong>, and <strong>Three.js</strong>, combining interactive 3D mapping and data visualization. Charts are rendered using <strong>Recharts</strong> and <strong>D3.js</strong>, while styling is handled with <strong>Tailwind CSS</strong> and <strong>PostCSS</strong>. The source code is available on <a href='https://github.com/intendedsideeffects/Chauka' target='_blank' style='color: #000; text-decoration: underline;'><strong>GitHub</strong></a>.<br/><br/>The 3D star globe is based on data from the <strong>Hipparcos and Tycho Catalogues</strong>. Additional charts use data from the <strong>Pacific Data Hub</strong> and the <strong>EM-DAT public disaster database</strong>. Exact datasets are linked in the captions of each visualization.<br/><br/>The narrative is rooted in a story from <strong>Manus Island</strong>. It is woven into the experience alongside <strong>sound</strong> to create a layered, sensory way of engaging with the data.<br/><br/>Music: <a href='https://www.youtube.com/watch?v=9naA6Ji3QS0' target='_blank' style='color: #000; text-decoration: underline;'><strong>Leve Yam - Keni Lucas Ponyalou</strong></a><br/><br/>This project is a collaboration between <a href='https://www.linkedin.com/in/bertha-ngahan-a9b405145/' target='_blank' style='color: #000; text-decoration: underline;'><strong>Bertha Ngahan</strong></a> (Storytelling) and <a href='https://www.linkedin.com/in/j-grauel/' target='_blank' style='color: #000; text-decoration: underline;'><strong>Janina Grauel</strong></a> (Visualization) for the <a href='https://pacificdatavizchallenge.org/' target='_blank' style='color: #000; text-decoration: underline;'><strong>Pacific Data Challenge</strong></a>." }} />
        </div>
      </div>

    </div>
  );
}

// Add a robust, reusable AudioPlayer component
function AudioPlayer({ src, volume = 1, loop = false, onEnded, onStateChange, onRef, ...rest }) {
  const audioRef = React.useRef();
  const [playing, setPlaying] = React.useState(false);
  const [audioLoaded, setAudioLoaded] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);

  React.useEffect(() => {
    // Temporarily removed muting to debug audio issues
    console.log('AudioPlayer mounted for:', src);
  }, []);

  // Expose audio ref to parent
  React.useEffect(() => {
    if (onRef && audioRef.current) {
      onRef(audioRef.current);
    }
  }, [onRef]);

  // Debug logging
  React.useEffect(() => {
    console.log('AudioPlayer: Loading audio file:', src);
  }, [src]);

  // Notify parent of state changes
  React.useEffect(() => {
    if (onStateChange) {
      onStateChange({ playing, audioLoaded, audioError });
    }
  }, [playing, audioLoaded, audioError, onStateChange]);

  return (
    <audio
      ref={audioRef}
      src={src}
      onEnded={() => { setPlaying(false); if (onEnded) onEnded(); }}
      onCanPlayThrough={() => { 
        console.log('AudioPlayer: Audio loaded successfully:', src);
        setAudioLoaded(true); 
        setAudioError(false); 
      }}
      onPlay={() => {
        console.log('AudioPlayer: Playing audio:', src, 'with volume:', volume);
        setPlaying(true);
        if (audioRef.current) {
          audioRef.current.volume = volume;
          audioRef.current.muted = false;
        }
        // Force state update to parent
        if (onStateChange) {
          onStateChange({ playing: true, audioLoaded, audioError });
        }
      }}
      onPause={() => {
        setPlaying(false);
        // Force state update to parent
        if (onStateChange) {
          onStateChange({ playing: false, audioLoaded, audioError });
        }
      }}
      onError={e => { 
        console.error('AudioPlayer: Error loading audio:', src, e);
        setAudioError(true); 
      }}
      preload="auto"
      loop={loop}
      {...rest}
    />
  );
}

// Refactor YellowStarAudioPlayer to use AudioPlayer
function YellowStarAudioPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const [audioLoaded, setAudioLoaded] = React.useState(false);
  const [audioError, setAudioError] = React.useState(false);
  const [showButtons, setShowButtons] = React.useState(true);
  const [audioElement, setAudioElement] = React.useState(null);
  const [showTooltip, setShowTooltip] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowButtons(window.scrollY === 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggle = () => {
    setShowTooltip(!showTooltip);
  };

  const handleStateChange = ({ playing: newPlaying, audioLoaded: newAudioLoaded, audioError: newAudioError }) => {
    console.log('Yellow state change:', { newPlaying, newAudioLoaded, newAudioError });
    setPlaying(newPlaying);
    setAudioLoaded(newAudioLoaded);
    setAudioError(newAudioError);
  };

  const handleAudioRef = (audio) => {
    setAudioElement(audio);
  };

  return (
    <div
      style={{
        width: '300px',
        height: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: showButtons ? 'auto' : 'none',
        background: 'none',
        cursor: 'pointer',
        opacity: showButtons ? 1 : 0,
        transition: 'opacity 0.4s',
      }}
      onClick={handleToggle}
      aria-label="Play or pause story"
    >
      {/* AudioPlayer removed to eliminate missing file error */}
      <svg width="300" height="300" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="pulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cad6fa" stopOpacity="1" />
            <stop offset="100%" stopColor="#cad6fa" stopOpacity="0.8" />
          </radialGradient>
          <filter id="glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="40" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <path id="circlePath" d="M150,75 A75,75 0 1,1 149.99,75" />
        </defs>
        <circle cx="150" cy="150" r="40" fill="#cad6fa" style={{ filter: 'url(#glow)' }} />
        <circle cx="150" cy="150" r="50" fill="transparent" style={{ filter: 'url(#glow)', animation: 'pulse 2s ease-in-out infinite', opacity: 0.2 }} />
        <text fill="#94a0c4" fontSize="18" fontWeight="normal" letterSpacing="0.08em">
          <textPath xlinkHref="#circlePath" startOffset="0%" textAnchor="start" dominantBaseline="middle">
            Click for story!
          </textPath>
        </text>
        {/* Play/pause symbols hidden */}
              </svg>
      {/* Reset button removed */}
      {audioError && (
        <div style={{ position: 'absolute', top: 10, left: 10, color: 'red', background: 'rgba(0,0,0,0.7)', padding: '8px 16px', borderRadius: 8, zIndex: 20 }}>
          Audio failed to load.
        </div>
      )}
      
      {/* Tooltip */}
      {showTooltip && (
        <div style={{
          position: 'fixed',
          top: '15%',
          left: '70%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 10, 30, 0.8)',
          color: '#e0e0e0',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '400px',
          zIndex: 10000,
          fontFamily: 'Helvetica World, Arial, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            This video collage is inspired by the <strong>Chauka</strong>, a bird found only on <strong>Manus Island</strong> in Papua New Guinea. It plays a role in daily life and is deeply respected, appearing often in local stories. People say its calls help mark the passage of time, acting as a kind of <strong>timekeeper</strong>. But in many legends, the Chauka also appears as a <strong>warning</strong>.
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            The story behind this visualization is about a man who brings home a new wife. Not long after, the Chauka begins calling again and again. The villagers pay attention. They sense something is wrong. The woman is not who she says she is. She is a spirit in disguise. The villagers listen to the bird and decide to leave the island by boat.
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            Stories like this are still told on Manus. The Chauka is seen as a bird that notices things before people do. It speaks up when something is off, when something is coming.
          </div>
          
          <div style={{ 
            fontStyle: 'italic', 
            fontSize: '14px', 
            opacity: 0.8,
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '15px'
          }}>
            Note: We worked with local knowledge through Bertha, who is from Manus. While we couldn't capture the full version of the story in time for this release, we hope to return to it and share more when the moment is right.
          </div>
          
          <button 
            onClick={() => setShowTooltip(false)}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0% { 
            opacity: 0.8;
          }
          50% { 
            opacity: 0.4;
          }
          100% { 
            opacity: 0.8;
          }
        }
        @keyframes pointing {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          50% { transform: translateX(2px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

// Blue Circle Audio Player Component
function BlueCircleAudioPlayer() {
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
    <div
      style={{
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
      }}
      onClick={handleToggle}
      aria-label="Play or pause ocean sound"
    >
      {/* AudioPlayer removed to eliminate missing file error */}
      <svg width="240" height="240" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <defs>
          <radialGradient id="pulseBlue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3d557a" stopOpacity="1" />
            <stop offset="100%" stopColor="#3d557a" stopOpacity="0" />
          </radialGradient>
          <filter id="glowBlue" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="40" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Arc path for text wrapping around the top half of the dot */}
          <path id="circlePathBlueText" d="M60,120 A60,60 0 1,1 180,120" />
        </defs>
        {/* Wrapped text above the dot */}
        <text fill="#3d557a" fontSize="15" fontWeight="normal" letterSpacing="0.08em">
          <textPath xlinkHref="#circlePathBlueText" startOffset="0%" textAnchor="start" dominantBaseline="middle">
            Click for ocean sound!
          </textPath>
        </text>
        <circle cx="120" cy="120" r="48" fill="url(#pulseBlue)" style={{ animation: 'pulse 1.5s infinite', filter: 'url(#glowBlue)' }} />
        <circle cx="120" cy="120" r="30" fill="#3d557a" style={{ filter: 'url(#glowBlue)' }} />
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
        @keyframes pulse {
          0% { r: 36; opacity: 0.7; }
          50% { r: 48; opacity: 0.2; }
          100% { r: 36; opacity: 0.7; }
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
    <div
      style={{
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'none',
        cursor: 'pointer',
      }}
      onClick={handleToggle}
      aria-label="Play or pause Chauka call"
    >
      <svg width="80" height="80" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {!playing && (
          <polygon points="35,30 50,40 35,50" fill="#676b8b" style={{ opacity: 0.8 }} />
        )}
        {playing && (
          <g>
            <rect x="32.5" y="31.5" width="4" height="16" rx="1" fill="#676b8b" style={{ opacity: 0.8 }} />
            <rect x="40.5" y="31.5" width="4" height="16" rx="1" fill="#676b8b" style={{ opacity: 0.8 }} />
          </g>
        )}
      </svg>
        </div>
  );
}

// Music Audio Player Component
function MusicAudioPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const [audioElement, setAudioElement] = React.useState(null);
  const [audioLoaded, setAudioLoaded] = React.useState(false);

  React.useEffect(() => {
    const audio = new Audio();
    audio.src = '/chaukasound.mp3'; // Using same audio for now, can be changed later
    audio.volume = 0.4;
    audio.loop = true;
    audio.preload = 'metadata';
    
    audio.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
    });
    
    audio.addEventListener('error', (e) => {
      console.error('Music audio error:', e);
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
      console.error('Error playing music audio:', error);
    }
  };

  return (
    <div
      style={{
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#3d557a',
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(61, 85, 122, 0.3)',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
      onClick={handleToggle}
      onMouseEnter={(e) => {
        e.target.style.background = '#2a3f5f';
        e.target.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = '#3d557a';
        e.target.style.transform = 'scale(1)';
      }}
      aria-label="Play or pause music"
    >

      
      {/* Play/Pause Icon */}
      <svg width="80" height="80" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 2 }}>
        {!playing && (
          <polygon points="35,30 50,40 35,50" fill="white" style={{ opacity: 0.8 }} />
        )}
        {playing && (
          <g>
            <rect x="32.5" y="31.5" width="4" height="16" rx="1" fill="white" style={{ opacity: 0.8 }} />
            <rect x="40.5" y="31.5" width="4" height="16" rx="1" fill="white" style={{ opacity: 0.8 }} />
          </g>
        )}
      </svg>
    </div>
  );
}






