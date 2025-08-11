import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Label, ReferenceArea } from 'recharts';
import getRegionColor from '../data/colorPointsData';
import CustomTooltip from './CustomTooltip';
import { FloatingDot } from './FloatingDot';
import responsive from '../utils/responsive';


// Helper: avoid overlaps for dots
function avoidOverlaps(dots, minDistance = 30, maxTries = 20) {
  const placed = [];
  for (let dot of dots) {
    let tries = 0;
    let newDot = { ...dot };
    while (
      placed.some(
        d => Math.hypot(d.x - newDot.x, d.y - newDot.y) < minDistance
      ) &&
      tries < maxTries
    ) {
      newDot.x += (Math.random() - 0.5) * minDistance;
      tries++;
    }
    placed.push(newDot);
  }
  return placed;
}

  const STATUS_HEIGHT = responsive.isMobile() ? 10000 : 7000; // Changed to 10000 for mobile
const STATUS_WIDTH = responsive.isMobile() ? 800 : 1600; // Reduced width for mobile to prevent huge margins
const YEAR_MIN = 1900;
const YEAR_MAX = 2025;
const CLIMATE_YEAR_MIN = 1990; // Climate resistance data starts from 1990
const CLIMATE_YEAR_MAX = 2025;
const getYearPosition = (year, dataType = 'disaster') => {
  if (dataType === 'climate-resistance') {
    // For climate resistance data, map 1990-2025 to the same Y positions as 1900-2025
    // This ensures yellow dots align properly with the blue dots timeline
    const normalizedYear = Math.max(CLIMATE_YEAR_MIN, Math.min(year, CLIMATE_YEAR_MAX));
    return ((YEAR_MAX - normalizedYear) / (YEAR_MAX - YEAR_MIN)) * STATUS_HEIGHT;
  }
  return ((YEAR_MAX - year) / (YEAR_MAX - YEAR_MIN)) * STATUS_HEIGHT;
};

function PlotsScatterChart({ timelineData, visibleData }) {
    const PRESENT_YEAR = new Date().getFullYear();
    // For demo/fixed: const PRESENT_YEAR = 2025;
    const audioRef = useRef(null);
    const purpleDotAudioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hoveredDot, setHoveredDot] = useState(null);
    const [hoveredBlueDot, setHoveredBlueDot] = useState(null);
    const tooltipTimeoutRef = useRef(null);
    const [isHoveringPurpleDot, setIsHoveringPurpleDot] = useState(false);
    const [isPurpleAudioPlaying, setIsPurpleAudioPlaying] = useState(false);
    const purpleDotAudio = useRef(null);

    const [showYAxis, setShowYAxis] = useState(false);
    const [climateResistanceData, setClimateResistanceData] = useState([]);

    // Debug: log when showYAxis changes
    useEffect(() => {
        console.log('showYAxis state changed to:', showYAxis);
    }, [showYAxis]);

    useEffect(() => {
        const enableAudio = () => {
            console.log('Enabling audio...');
            if (!audioRef.current) {
                audioRef.current = new Audio();
                console.log('audioRef initialized');
            }
        };

        // Enable audio immediately
        enableAudio();
    }, []);



    // Load climate resistance data
    useEffect(() => {
      async function fetchClimateResistanceData() {
        try {
          const response = await fetch('/Climate_Resistance_Tooltips.csv');
          const text = await response.text();
          const lines = text.split('\n').slice(1); // Skip header
          const data = lines
            .filter(line => line.trim())
            .map((line, index) => {
              // Find the first comma to separate year from the rest
              const firstCommaIndex = line.indexOf(',');
              if (firstCommaIndex === -1) return null;
              
              const year = line.substring(0, firstCommaIndex);
              const tooltipText = line.substring(firstCommaIndex + 1); // Everything after the first comma
              
              const yearNum = parseInt(year);
              if (isNaN(yearNum)) return null;
              
              // Filter out data before 1990 for climate resistance
              if (yearNum < CLIMATE_YEAR_MIN) return null;
              
              // Calculate position using same logic as blue dots
              const yBase = getYearPosition(yearNum, 'climate-resistance');
              console.log(`Climate dot ${yearNum}: yBase=${yBase}, STATUS_HEIGHT=${STATUS_HEIGHT}, CLIMATE_YEAR_MIN=${CLIMATE_YEAR_MIN}, CLIMATE_YEAR_MAX=${CLIMATE_YEAR_MAX}`);
              const yOffset = (Math.random() - 0.5) * 2 * 19; // Same offset as blue dots
              const y = yBase + yOffset;
              
              // Spread dots to the sides like blue dots
              const x = Math.round((Math.random() - 0.5) * STATUS_WIDTH * 0.8);
              
              return {
                id: `climate-${index}`,
                year: yearNum,
                tooltipText: tooltipText.replace(/"/g, ''), // Remove quotes
                x: x,
                y: y,
                type: 'climate-resistance'
              };
            })
            .filter(item => item !== null);
          
          console.log('Loaded climate resistance data:', data);
          setClimateResistanceData(data);
        } catch (error) {
          console.error('Error loading climate resistance data:', error);
        }
      }
      fetchClimateResistanceData();
    }, []);

    const handleMouseEnter = (dot) => {
        if (dot.highlighted && !isPlaying) {
            setIsPlaying(true);
            setHoveredDot(dot);

            if (!audioRef.current) {
                audioRef.current = new Audio(dot.sound);
            } else {
                audioRef.current.src = dot.sound;
            }

            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => console.log("🎵 Playing audio"))
                    .catch((error) => console.warn("⚠️ Autoplay prevented:", error));
            }
        }
    };

    const handleYellowDotMouseEnter = (dot, event) => {
        // Clear any existing timeout
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = null;
        }
        
        // Clear any existing blue dot tooltip to prevent multiple tooltips
        setHoveredBlueDot(null);
        
        // Store mouse position for tooltip positioning
        dot.mouseX = event.clientX;
        dot.mouseY = event.clientY;
        setHoveredDot(dot);
    };

    const handleYellowDotMouseLeave = () => {
        console.log('Yellow dot mouse leave, clearing tooltip');
        // Set a timeout to clear the tooltip after a short delay
        tooltipTimeoutRef.current = setTimeout(() => {
            setHoveredDot(null);
            tooltipTimeoutRef.current = null;
        }, 200); // Increased delay to allow hover effect to be more visible
    };

    const handleBlueDotMouseEnter = (dot, event) => {
        // Clear any existing timeout
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = null;
        }
        
        // Clear any existing yellow dot tooltip to prevent multiple tooltips
        setHoveredDot(null);
        
        // Store mouse position for tooltip positioning
        dot.mouseX = event.clientX;
        dot.mouseY = event.clientY;
        
        setHoveredBlueDot(dot);
    };

    const handleBlueDotMouseLeave = () => {
        console.log('Blue dot mouse leave, clearing tooltip');
        // Set a timeout to clear the tooltip after a short delay
        tooltipTimeoutRef.current = setTimeout(() => {
            setHoveredBlueDot(null);
            tooltipTimeoutRef.current = null;
        }, 200); // Increased delay to allow hover effect to be more visible
    };

    // Function to calculate smart tooltip positioning
    const getTooltipPosition = (mouseX, mouseY, tooltipWidth = 400, tooltipHeight = 200) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Default offset from mouse
        let left = mouseX + 20;
        let top = mouseY - 100;
        
        // Check if tooltip would go off the right edge
        if (left + tooltipWidth > viewportWidth - 20) {
            left = mouseX - tooltipWidth - 20;
        }
        
        // Check if tooltip would go off the left edge
        if (left < 20) {
            left = 20;
        }
        
        // Additional check for mobile: ensure tooltip doesn't go off the right edge even after repositioning
        if (responsive.isMobile() && left + tooltipWidth > viewportWidth - 20) {
            left = viewportWidth - tooltipWidth - 20;
        }
        
        // Check if tooltip would go off the bottom edge
        if (top + tooltipHeight > viewportHeight - 20) {
            top = mouseY - tooltipHeight - 20;
        }
        
        // Check if tooltip would go off the top edge
        if (top < 20) {
            top = 20;
        }
        
        return { left, top };
    };

    // Add scroll event listener to clear tooltip when scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (hoveredDot) {
                setHoveredDot(null);
            }
            if (hoveredBlueDot) {
                setHoveredBlueDot(null);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hoveredDot, hoveredBlueDot]);

    // Add click handler to close tooltips when clicking on empty space (especially for mobile)
    const handleContainerClick = (event) => {
        // Only handle clicks on the container itself, not on dots or tooltips
        if (event.target.id === 'plot-container' || event.target.classList.contains('scatter-container')) {
            if (hoveredDot || hoveredBlueDot) {
                console.log('Container clicked, clearing all tooltips');
                setHoveredDot(null);
                setHoveredBlueDot(null);
                // Clear any pending timeout
                if (tooltipTimeoutRef.current) {
                    clearTimeout(tooltipTimeoutRef.current);
                    tooltipTimeoutRef.current = null;
                }
            }
        }
    };

    // Add touch handler for mobile devices to close tooltips when tapping on empty space
    const handleContainerTouch = (event) => {
        if (responsive.isMobile()) {
            // Only handle touches on the container itself, not on dots or tooltips
            if (event.target.id === 'plot-container' || event.target.classList.contains('scatter-container')) {
                if (hoveredDot || hoveredBlueDot) {
                    console.log('Container touched, clearing all tooltips');
                    setHoveredDot(null);
                    setHoveredBlueDot(null);
                    // Clear any pending timeout
                    if (tooltipTimeoutRef.current) {
                        clearTimeout(tooltipTimeoutRef.current);
                        tooltipTimeoutRef.current = null;
                    }
                }
            }
        }
    };

    // Add global mouse move listener to clear tooltips when mouse is not over dots
    useEffect(() => {
        const handleGlobalMouseMove = (event) => {
            // Check if mouse is over the plot container
            const plotContainer = document.getElementById('plot-container');
            if (plotContainer && !plotContainer.contains(event.target)) {
                // Mouse is outside the plot container, clear all tooltips immediately
                if (hoveredDot || hoveredBlueDot) {
                    console.log('Mouse outside plot container, clearing all tooltips');
                    setHoveredDot(null);
                    setHoveredBlueDot(null);
                    // Clear any pending timeout
                    if (tooltipTimeoutRef.current) {
                        clearTimeout(tooltipTimeoutRef.current);
                        tooltipTimeoutRef.current = null;
                    }
                }
            }
        };

        window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            // Clear any pending timeout
            if (tooltipTimeoutRef.current) {
                clearTimeout(tooltipTimeoutRef.current);
                tooltipTimeoutRef.current = null;
            }
        };
    }, [hoveredDot, hoveredBlueDot]);

    const handleMouseLeave = (dot) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setHoveredDot(null);
    };

    const getStableColor = useCallback((status) => {
        return getRegionColor(status);
    }, []);

    const stabilizedData = useMemo(() => {
        return timelineData
            .filter(d => {
                const year = d.year || d.event_year || d.ext_date || d.xYear;
                return year >= YEAR_MIN && year <= YEAR_MAX;
            })
            .map(d => {
            // Calculate y-coordinate for extinct birds without dates
            let yCoord = d.y;
            if (d.status === "Extinct" && !d.ext_date) {
                const scale = STATUS_HEIGHT / (YEAR_MAX - YEAR_MIN);
                yCoord = (YEAR_MAX - 2024) * scale;
            }
            // Determine year for this dot
            const year = d.year || d.event_year || d.ext_date || d.xYear;
            const isFuture = year && year > PRESENT_YEAR;
            return {
                ...d,
                fill: isFuture ? '#e0b800' : (d.fill || getStableColor(d.status)),
                future: !!isFuture,
                size: d.size || 5,
                x: Math.round(d.x),
                y: yCoord
            };
        });
    }, [timelineData, getStableColor]);

    const MIN_DOT_SIZE = 4; // smaller minimum size
    const MAX_DOT_SIZE = 20; // smaller maximum size

    const affectedValues = visibleData
      .map(d => typeof d.total_affected === 'number' && !isNaN(d.total_affected) ? d.total_affected : 0)
      .filter(v => v > 0);
    const minAffected = Math.min(...affectedValues, 1); // avoid 0
    const maxAffected = Math.max(...affectedValues, 1);

    const PIXELS_PER_CM = 37.8; // 1cm ≈ 37.8px at 96dpi, so 0.5cm ≈ 19px
    const MAX_Y_OFFSET = PIXELS_PER_CM * 0.5;

    const stabilizedVisibleData = useMemo(() => {
        console.log('PlotsScatterChart - visibleData received:', visibleData);
        console.log('PlotsScatterChart - YEAR_MIN:', YEAR_MIN, 'YEAR_MAX:', YEAR_MAX);
        
        const filtered = visibleData.filter(d => {
            const year = d.start_year;
            const isValid = year >= YEAR_MIN && year <= YEAR_MAX;
            if (!isValid) {
                console.log('Filtered out:', d, 'year:', year, 'valid:', isValid);
            }
            return isValid;
        });
        
        console.log('PlotsScatterChart - filtered data length:', filtered.length);
        
        return filtered.map((d, i) => {
            const year = d.start_year;
            const isFuture = year && year > PRESENT_YEAR;
            let size = MIN_DOT_SIZE;
            if (typeof d.total_affected === 'number' && !isNaN(d.total_affected)) {
                if (maxAffected > minAffected) {
                    size = MIN_DOT_SIZE + ((d.total_affected - minAffected) / (maxAffected - minAffected)) * (MAX_DOT_SIZE - MIN_DOT_SIZE);
                }
            }
            // Add a small random y offset (up to ±MAX_Y_OFFSET)
            const yBase = year ? getYearPosition(year) : 0;
            const yOffset = (Math.random() - 0.5) * 2 * MAX_Y_OFFSET;
            const y = yBase + yOffset;
            // Debug log
            // console.log('Dot size for', d.disaster_type, d.country, 'affected:', d.total_affected, 'size:', size, 'y:', y);
            return {
                ...d,
                fill: '#0066cc', // blue
                opacity: 1, // full opacity
                future: !!isFuture,
                size,
                // Spread dots to the sides, avoiding the center
                x: Math.round(d.x < 0 ? d.x - 300 : d.x + 300),
                y,
            };
        });
    }, [visibleData, minAffected, maxAffected]);

    // Debug: log status values for visible dots
    useEffect(() => {
        if (stabilizedVisibleData.length > 0) {
            console.log('Dot statuses:', stabilizedVisibleData.map(d => d.status));
            console.log('First 5 dots:', stabilizedVisibleData.slice(0, 5));
        }
    }, [stabilizedVisibleData]);

    // Calculate the y position for the NOW line and future background
    const yearMin = 1922;
    const yearMax = 2025;
    const nowY = ((yearMax - PRESENT_YEAR) / (yearMax - yearMin)) * STATUS_HEIGHT;
    const futureHeight = ((yearMax - PRESENT_YEAR) / (yearMax - yearMin)) * STATUS_HEIGHT;
    const futureY = nowY;

    // Generate y-axis ticks for 1900, 1910, ..., 2020
    const yAxisTicks = [];
    const yAxisTickLabels = [];
    for (let year = 1900; year <= YEAR_MAX; year += 10) {
      yAxisTicks.push(((YEAR_MAX - year) / (YEAR_MAX - YEAR_MIN)) * STATUS_HEIGHT);
      yAxisTickLabels.push(year);
    }



    return (
        <div
            id="plot-container"
            style={{
                width: '100%',
                height: STATUS_HEIGHT + 'px',
                position: 'relative',
                backgroundColor: 'transparent',
                color: 'black',
                overflow: 'visible',
                zIndex: responsive.isMobile() ? 10 : 10, // Reduced from 99995 to prevent z-index conflicts
                pointerEvents: 'none' // Don't capture pointer events for the container itself
            }}
            onClick={handleContainerClick}
            onTouchStart={handleContainerTouch}
        >
            
            {/* Hidden audio element for purple dots */}
            <audio 
                ref={purpleDotAudio}
                src="/chaukasound.mp3"
                preload="auto"
                style={{ display: 'none' }}
                onEnded={() => {
                    console.log('Audio ended, resetting flag');
                    setIsPurpleAudioPlaying(false);
                }}
            />
            
            {/* Y-Axis Background (shows only when y-axis is visible) */}
            {showYAxis && (
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: '50px',
                        height: '100%',
                        background: 'transparent',
                        zIndex: 999,
                        pointerEvents: 'none',
                    }}
                />
            )}

                         {/* Y-Axis Toggle Button - Hidden on mobile */}
             {!responsive.isMobile() && (
                 <button
                     onClick={() => {
                         console.log('Toggle clicked, current showYAxis:', showYAxis);
                         setShowYAxis(!showYAxis);
                     }}
                     style={{
                         position: 'absolute',
                         right: '-10px',
                         top: '0px',
                         background: showYAxis ? '#ffffff' : '#ffffff',
                         border: '1px solid #666666',
                         borderRadius: '0px',
                         width: '20px',
                         height: '100%',
                         cursor: 'pointer',
                         zIndex: 1001,
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         fontSize: '12px',
                         fontWeight: 'bold',
                         color: '#000000',
                         boxShadow: 'none',
                         transition: 'background-color 0.3s ease',
                         pointerEvents: 'auto'
                     }}
                     onMouseEnter={(e) => {
                         e.target.style.background = showYAxis ? '#f0f0f0' : '#f0f0f0';
                     }}
                     onMouseLeave={(e) => {
                         e.target.style.background = showYAxis ? '#ffffff' : '#ffffff';
                     }}
                 >
                     {showYAxis ? '−' : '+'}
                 </button>
             )}





            {/* Custom tooltip for memory dots and climate resistance dots */}
            {hoveredDot && (hoveredDot.type === 'memory' || hoveredDot.type === 'climate-resistance') && (() => {
              const tooltipWidth = responsive.isMobile() ? 280 : (hoveredDot.type === 'climate-resistance' ? 400 : 384);
              const tooltipHeight = 200; // Estimated height
              let position;
              
              if (hoveredDot.mouseX && hoveredDot.mouseY) {
                position = getTooltipPosition(hoveredDot.mouseX, hoveredDot.mouseY, tooltipWidth, tooltipHeight);
                
                // Additional mobile-specific positioning to ensure tooltip is always fully visible
                if (responsive.isMobile()) {
                  const viewportWidth = window.innerWidth;
                  const viewportHeight = window.innerHeight;
                  
                  // Ensure tooltip doesn't go off the right edge
                  if (position.left + tooltipWidth > viewportWidth - 20) {
                    position.left = viewportWidth - tooltipWidth - 20;
                  }
                  
                  // Ensure tooltip doesn't go off the left edge
                  if (position.left < 20) {
                    position.left = 20;
                  }
                  
                  // Ensure tooltip doesn't go off the bottom edge
                  if (position.top + tooltipHeight > viewportHeight - 20) {
                    position.top = viewportHeight - tooltipHeight - 20;
                  }
                  
                  // Ensure tooltip doesn't go off the top edge
                  if (position.top < 20) {
                    position.top = 20;
                  }
                }
              } else {
                position = { left: '50%', top: '200px' };
              }
              
              return (
                <div
                  style={{
                    position: 'fixed',
                    left: typeof position.left === 'number' ? `${position.left}px` : position.left,
                    top: typeof position.top === 'number' ? `${position.top}px` : position.top,
                    transform: typeof position.left === 'number' ? 'none' : 'translateX(-50%)',
                    background: 'rgba(255, 255, 255, 1)',
                    color: 'black',
                    padding: '16px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    width: `${tooltipWidth}px`,
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '16px',
                    zIndex: responsive.isMobile() ? 99999 : 99999,
                  }}
                >
                  {hoveredDot.type === 'memory' ? (
                    <>
                      <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                        {hoveredDot.type === 'image' ? 'Image Memory' : 'Memory'}
                      </p>
                      <div style={{ marginBottom: '8px' }}>
                        {hoveredDot.type === 'image' ? (
                          <img src={hoveredDot.content} alt="memory" style={{ maxWidth: 180 }} />
                        ) : (
                          <div>{hoveredDot.content}</div>
                        )}
                      </div>
                      <p style={{ fontStyle: 'italic', marginBottom: '8px' }}>
                        {hoveredDot.author} ({hoveredDot.year})
                      </p>
                      {/* Show delete button for all non-sound memories */}
                      {hoveredDot.type !== 'sound' && (
                        <button
                          style={{
                            marginTop: 12,
                            background: 'transparent',
                            color: '#808080',
                            border: 'none',
                            borderRadius: 4,
                            padding: '6px 12px',
                            cursor: 'pointer'
                          }}
                          
                        >
                          Delete
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                        Resistance
                      </p>
                      <p style={{ fontStyle: 'italic', marginBottom: '8px' }}>
                        {hoveredDot.year}
                      </p>
                      <p style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                        {hoveredDot.tooltipText}
                      </p>
                      {/* Close button for mobile */}
                      {responsive.isMobile() && (
                        <button
                          onClick={() => {
                            setHoveredDot(null);
                            if (tooltipTimeoutRef.current) {
                              clearTimeout(tooltipTimeoutRef.current);
                              tooltipTimeoutRef.current = null;
                            }
                          }}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'transparent',
                            color: '#808080',
                            border: 'none',
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                            fontSize: '20px',
                            fontWeight: '100',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 1
                          }}
                        >
                          ×
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
                         })()}
             
                                       {/* Cross indicator for blue dots - spans entire screen */}
              {hoveredBlueDot && (
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: responsive.isMobile() ? 99998 : 99998,
                  }}
                >
                  {/* Horizontal line spanning entire width */}
                  <line
                    x1="0"
                    y1={hoveredBlueDot.cy || 0}
                    x2="100%"
                    y2={hoveredBlueDot.cy || 0}
                    stroke="#808080"
                    strokeWidth="0.5"
                    opacity="0.8"
                  />
                  {/* Vertical line spanning entire height */}
                  <line
                    x1={hoveredBlueDot.cx || 0}
                    y1="0"
                    x2={hoveredBlueDot.cx || 0}
                    y2="100%"
                    stroke="#808080"
                    strokeWidth="0.5"
                    opacity="0.8"
                  />
                </svg>
              )}

             {/* Cross indicator for yellow dots (climate resistance) - spans entire screen */}
              {hoveredDot && hoveredDot.type === 'climate-resistance' && (
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: responsive.isMobile() ? 99998 : 99998,
                  }}
                >
                  {/* Horizontal line spanning entire width */}
                  <line
                    x1="0"
                    y1={hoveredDot.cy || 0}
                    x2="100%"
                    y2={hoveredDot.cy || 0}
                    stroke="#808080"
                    strokeWidth="0.5"
                    opacity="0.8"
                  />
                  {/* Vertical line spanning entire height */}
                  <line
                    x1={hoveredDot.cx || 0}
                    y1="0"
                    x2={hoveredDot.cx || 0}
                    y2="100%"
                    stroke="#808080"
                    strokeWidth="0.5"
                    opacity="0.8"
                  />
                </svg>
              )}

             {/* Custom tooltip for blue dots (disaster data) */}
              {hoveredBlueDot && (() => {
                const tooltipWidth = responsive.isMobile() ? 280 : 384;
                const tooltipHeight = 200; // Estimated height
                let position;
                
                if (hoveredBlueDot.mouseX && hoveredBlueDot.mouseY) {
                  position = getTooltipPosition(hoveredBlueDot.mouseX, hoveredBlueDot.mouseY, tooltipWidth, tooltipHeight);
                  
                  // Additional mobile-specific positioning to ensure tooltip is always fully visible
                  if (responsive.isMobile()) {
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;
                    
                    // Ensure tooltip doesn't go off the right edge
                    if (position.left + tooltipWidth > viewportWidth - 20) {
                      position.left = viewportWidth - tooltipWidth - 20;
                    }
                    
                    // Ensure tooltip doesn't go off the left edge
                    if (position.left < 20) {
                      position.left = 20;
                    }
                    
                    // Ensure tooltip doesn't go off the bottom edge
                    if (position.top + tooltipHeight > viewportHeight - 20) {
                      position.top = viewportHeight - tooltipHeight - 20;
                    }
                    
                    // Ensure tooltip doesn't go off the top edge
                    if (position.top < 20) {
                      position.top = 20;
                    }
                  }
                } else {
                  position = { left: '50%', top: '200px' };
                }
                
                return (
                  <div
                    style={{
                      position: 'fixed',
                      left: typeof position.left === 'number' ? `${position.left}px` : position.left,
                      top: typeof position.top === 'number' ? `${position.top}px` : position.top,
                      transform: typeof position.left === 'number' ? 'none' : 'translateX(-50%)',
                      background: 'rgba(255, 255, 255, 1)',
                      color: 'black',
                      padding: '16px',
                      borderRadius: '4px',
                      border: '1px solid #d1d5db',
                      width: `${tooltipWidth}px`,
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '18px',
                      zIndex: responsive.isMobile() ? 99999 : 99999,
                    }}
                  >
                    <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
                      {hoveredBlueDot.disaster_type} in {hoveredBlueDot.country}
                    </p>
                    <p style={{ fontStyle: 'italic', marginBottom: '8px' }}>
                      Start year: {hoveredBlueDot.start_year}
                    </p>
                    {hoveredBlueDot.summary && (
                      <p style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                        {hoveredBlueDot.summary}
                      </p>
                    )}
                    {/* Close button for mobile */}
                    {responsive.isMobile() && (
                      <button
                        onClick={() => {
                          setHoveredBlueDot(null);
                          if (tooltipTimeoutRef.current) {
                            clearTimeout(tooltipTimeoutRef.current);
                            tooltipTimeoutRef.current = null;
                          }
                        }}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'transparent',
                          color: '#808080',
                          border: 'none',
                          width: '32px',
                          height: '32px',
                          cursor: 'pointer',
                          fontSize: '20px',
                          fontWeight: '100',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })()}
            
             
                <ResponsiveContainer 
                    width="100%" 
                    height={STATUS_HEIGHT}
                    className="scatter-container"
                    style={{
                        zIndex: responsive.isMobile() ? 99996 : 99996,
                        position: 'relative',
                        pointerEvents: 'none'
                    }}
                    onTouchStart={handleContainerTouch}
                >
                <ScatterChart
                    key="main-scatter-chart"
                    style={{ 
                        background: 'transparent', 
                        overflow: 'visible', 
                        pointerEvents: 'none',
                        zIndex: responsive.isMobile() ? 99997 : 99997
                    }}
                                         margin={{ top: 113, right: responsive.isMobile() ? 20 : 80, bottom: 113, left: responsive.isMobile() ? 10 : 10 }}
                    width={STATUS_WIDTH}
                    height={STATUS_HEIGHT}
                >
                                         <XAxis
                         type="number"
                         dataKey="x"
                         domain={[-STATUS_WIDTH, STATUS_WIDTH]}
                         hide
                     />
                          <YAxis
                            type="number"
                            dataKey="y"
                            domain={[0, STATUS_HEIGHT]}
                            orientation="right"
                            ticks={yAxisTicks}
                            position="right"
                            tickLine={{ stroke: '#000', strokeWidth: 1 }}
                            tickSize={6}
                            hide={!showYAxis}
                            tick={({ x, y, payload }) => {
                              console.log('YAxis tick rendering, showYAxis:', showYAxis);
                              // payload.value is the y position, find its index
                              const idx = yAxisTicks.findIndex(tick => Math.abs(tick - payload.value) < 2);
                              const year = yAxisTickLabels[idx];
                              return (
                                <text
                                  x={x - 12}
                                  y={y + 4}
                                  fontSize={16}
                                  fill={'#000'}
                                  textAnchor="end"
                                >
                                  {year || ''}
                                </text>
                              );
                            }}
                            axisLine={(props) => {
                              console.log('YAxis axisLine rendering, showYAxis:', showYAxis);
                              // Calculate the y-pixel for PRESENT_YEAR (2025) using the same formula as the NOW line
                              const yearMin = 1900;
                              const yearMax = 2025;
                              const nowY = ((yearMax - PRESENT_YEAR) / (yearMax - yearMin)) * STATUS_HEIGHT;
                              return (
                                  <g>
                                      {/* Black line from top to NOW */}
                                      <line
                                          x1={props.x}
                                          y1={0}
                                          x2={props.x}
                                          y2={nowY}
                                          stroke="#000"
                                          strokeWidth={2}
                                      />
                                      {/* Yellow line from NOW to bottom */}
                                      <line
                                          x1={props.x}
                                          y1={nowY}
                                          x2={props.x}
                                          y2={STATUS_HEIGHT}
                                          stroke="#e0b800"
                                          strokeWidth={2}
                                      />
                                      {/* Tick marks */}
                                      {yAxisTicks.map((tick, i) => (
                                          <line
                                              key={tick}
                                              x1={props.x}
                                              y1={tick}
                                              x2={props.x - 6}  // 6px tick length to the left
                                              y2={tick}
                                              stroke="#000"
                                              strokeWidth={1}
                                          />
                                      ))}
                                  </g>
                              );
                            }}
                            tickLine={false}  // Disable default tick marks
                          />


                    <Scatter
                        data={stabilizedData}
                        shape={(props) => {
                            const text = String(props.payload.event);
                            const words = text.split(' ');
                            let lines = [];
                            let currentLine = '';
                            const maxWidth = 30;

                            words.forEach((word) => {
                                if ((currentLine + ' ' + word).length <= maxWidth) {
                                    currentLine += (currentLine ? ' ' : '') + word;
                                } else {
                                    lines.push(currentLine);
                                    currentLine = word;
                                }
                            });
                            if (currentLine) {
                                lines.push(currentLine);
                            }

                            // Only make the specific event yellow
                            const isSpecialEvent =
                                props.payload.event ===
                                    'Conservative predictions expect 12.5% of all global bird species to go extinct by 2100. Many scientists expect the real number to be significantly higher.';
                            const textColor = isSpecialEvent ? '#e0b800' : '#222';

                            return (
                                <g style={{ pointerEvents: 'none' }}>
                                    {lines.map((line, i) => (
                                        <text
                                            key={i}
                                            x={props.cx + 100}
                                            y={props.cy + i * 18}
                                            textAnchor="start"
                                            fill={textColor}
                                            fontSize="16"
                                            style={{ pointerEvents: 'none' }}>
                                            {line}
                                        </text>
                                    ))}
                                </g>
                            );
                        }}
                    />

                                                                                   <Scatter
                          data={stabilizedVisibleData}
                          shape={(props) => (
                              <g style={{ pointerEvents: 'auto' }}>
                                  <FloatingDot
                                      cx={props.cx}
                                      cy={props.cy}
                                      r={props.payload.size}
                                      payload={props.payload}
                                      fill={props.payload.fill}
                                      opacity={props.payload.opacity}
                                      onMouseEnter={(e) => {
                                          // Store the coordinates for the cross indicator
                                          props.payload.cx = props.cx;
                                          props.payload.cy = props.cy;
                                          handleBlueDotMouseEnter(props.payload, e);
                                      }}
                                      onMouseLeave={handleBlueDotMouseLeave}
                                  />
                              </g>
                          )}
                      />

                                         <Scatter
                         data={climateResistanceData}
                         shape={(props) => {
                             const isHovered = hoveredDot?.id === props.payload.id;
                             const baseSize = 15;
                             const hitboxSize = baseSize * 3;
                             
                             return (
                                 <g 
                                     style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                                     onMouseEnter={(e) => {
                                         // Store the coordinates for the cross indicator
                                         props.payload.cx = props.cx;
                                         props.payload.cy = props.cy;
                                         handleYellowDotMouseEnter(props.payload, e);
                                     }}
                                     onMouseLeave={handleYellowDotMouseLeave}
                                 >
                                    {/* Glow filter */}
                                    <defs>
                                        <filter id={`yellow-glow-${props.payload.id}`}>
                                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                    </defs>

                                    {/* Blurry outline with glow */}
                                    <circle
                                        cx={props.cx}
                                        cy={props.cy}
                                        r={isHovered ? baseSize * 3 + 6 : baseSize + 6}
                                        fill="#edf551"
                                        style={{
                                            opacity: isHovered ? 0.6 : 0.4,
                                            filter: `url(#yellow-glow-${props.payload.id})`,
                                            transition: 'all 0.3s ease',
                                        }}
                                    />

                                                                         {/* Main dot with glow */}
                                     <circle
                                         cx={props.cx}
                                         cy={props.cy}
                                         r={isHovered ? baseSize * 3 : baseSize}
                                         fill="#edf551"
                                         style={{
                                             opacity: isHovered ? 1 : 0.8,
                                             filter: `url(#yellow-glow-${props.payload.id})`,
                                             transition: 'all 0.3s ease',
                                         }}
                                     />

                                    {/* Hitbox (invisible but handles hover) */}
                                    <circle
                                        cx={props.cx}
                                        cy={props.cy}
                                        r={hitboxSize}
                                        fill="transparent"
                                        style={{ pointerEvents: 'all' }}
                                    />
                                </g>
                            );
                        }}
                    />

                                         {/* Custom tooltips are handled above, no need for default Recharts Tooltip */}

                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}

export default PlotsScatterChart;








