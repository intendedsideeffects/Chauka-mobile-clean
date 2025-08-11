'use client';
import React, { useState, useEffect, useRef } from 'react';
import responsive from '../utils/responsive';

const HighestElevationChart = () => {
  const [highestElevationData, setHighestElevationData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const chartAreaRef = useRef(null);
  const [chartAreaWidth, setChartAreaWidth] = useState(0);

  useEffect(() => {
    if (chartAreaRef.current) {
      setChartAreaWidth(chartAreaRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (chartAreaRef.current) {
        setChartAreaWidth(chartAreaRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/pop_low_el.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const lines = csvText.split('\n');
        const data = lines.slice(1).filter(line => line.trim() !== '').map(line => {
          const values = line.split(';');
          // Handle both comma and dot decimal formats
          const elevationValue = values[5] ? parseFloat(values[5].replace(',', '.')) : 0;
          return {
            country: values[0],
            elevation: values[1],
            elevationDesc: values[2],
            timePeriod: values[3],
            obsValue: parseInt(values[4]) || 0,
            highestElevation: elevationValue
          };
        });

        // Get unique countries with their average elevation
        const averageElevation = data
          .filter(item => item.highestElevation > 0)
          .reduce((acc, item) => {
            if (!acc.find(c => c.country === item.country)) {
              acc.push({
                country: item.country,
                elevation: item.highestElevation
              });
            }
            return acc;
          }, [])
          .sort((a, b) => a.elevation - b.elevation)
          .slice(0, 9); // Only show the 9 lowest islands

        // Swap Tuvalu and Tokelau positions
        const swappedData = [...averageElevation];
        const tuvaluIndex = swappedData.findIndex(item => item.country === 'Tuvalu');
        const tokelauIndex = swappedData.findIndex(item => item.country === 'Tokelau');
        
        if (tuvaluIndex !== -1 && tokelauIndex !== -1) {
          [swappedData[tuvaluIndex], swappedData[tokelauIndex]] = [swappedData[tokelauIndex], swappedData[tuvaluIndex]];
        }

        // Mark the 4 lowest values after swapping
        const finalData = swappedData.map((item, index) => {
          // Get the 4 lowest elevation values
          const lowest4 = swappedData
            .sort((a, b) => a.elevation - b.elevation)
            .slice(0, 4)
            .map(item => item.elevation);
          
          return {
            ...item,
            isLowest: lowest4.includes(item.elevation)
          };
        });

        setHighestElevationData(finalData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, []);




  
  return (
    <div style={{ 
      width: responsive.isMobile() ? 'calc(100vw - 80px)' : '100%', 
      height: '450px', 
      position: 'relative',
      maxWidth: responsive.isMobile() ? 'calc(100vw - 80px)' : '100%'
    }}>



      {/* Blue gradient area below 0 (sea level) */}
      <div style={{
        position: 'absolute',
        left: '0px',
        right: responsive.isMobile() ? '0px' : '0px',
        top: '350px',  // Align with x-axis (chart bottom)
        height: '50px',
        background: 'linear-gradient(to top, transparent 0%, rgba(59, 130, 246, 0.1) 50%, rgba(59, 130, 246, 0.3) 100%)',
        zIndex: 0
      }} />

             {/* Y-axis annotation */}
       <div style={{
         position: 'absolute',
         left: responsive.isMobile() ? '0px' : '10px',
                   top: 'calc(50% - 178px)',
         transform: 'translateY(-50%)',
         fontSize: responsive.isMobile() ? '8px' : '14px',
         fontFamily: 'Helvetica World, Arial, sans-serif',
         color: '#666666',
         textAlign: 'left',
         pointerEvents: 'none',
         lineHeight: '1.2',
         width: responsive.isMobile() ? '120px' : '150px'
       }}>
         AVERAGE ELEVATION OF<br/>
         PACIFIC ISLANDS (M)
       </div>
      
      {/* Chart area with bars */}
             <div ref={chartAreaRef} className="flex items-end justify-between h-[350px] relative" style={{ 
         transition: 'height 1.5s ease',
         marginLeft: responsive.isMobile() ? '0px' : '0px',
         marginRight: responsive.isMobile() ? '0px' : '0px'
       }}>

        
        {/* Horizontal gridlines */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((value, index) => (
          <div 
            key={index}
            className="absolute left-0 right-0 z-10" 
            style={{ 
              top: `${350 - (value * 280)}px`,
              height: '1px',
              background: '#e5e7eb'
            }}
          />
        ))}
        
        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((value, index) => {
          const maxElevation = highestElevationData.length > 0 ? Math.max(...highestElevationData.map(d => d.elevation)) : 0;
          return (
            <div 
              key={index}
              className="absolute z-20" 
              style={{ 
                top: `${350 - (value * 280) - 8}px`,
                left: '-25px',
                fontSize: responsive.isMobile() ? '8px' : '12px',
                color: '#666666',
                fontFamily: 'Helvetica World, Arial, sans-serif'
              }}
            >
              {Math.round(value * maxElevation)}
            </div>
          );
        })}
        
        {/* Zero line positioned directly under bars */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-black"></div>
       
        {highestElevationData.map((item, index) => {
          // Use max elevation for scaling
          const maxElevation = highestElevationData.length > 0 ? Math.max(...highestElevationData.map(d => d.elevation)) : 1;
          // Simple linear scale - no minimum height to preserve true proportions
          const maxBarHeight = 280;
          const barHeight = (item.elevation / maxElevation) * maxBarHeight;
          const isHovered = hoveredIndex === index;
          const shouldReduceOpacity = hoveredIndex !== null && hoveredIndex !== index;
          return (
            <div 
              key={index} 
              className="flex flex-col items-center flex-1 mx-1"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transition: 'opacity 0.2s ease',
                opacity: shouldReduceOpacity ? 0.4 : 1,
                cursor: 'pointer',
                zIndex: isHovered ? 40 : 20
              }}
            >
              {/* Labels above bar */}
              <div style={{ 
                marginBottom: '5px',
                textAlign: 'center',
                fontSize: responsive.isMobile() ? '8px' : '10px',
                color: '#000'
              }}>
                <div>{item.country}</div>
                <div style={{ fontSize: responsive.isMobile() ? '7px' : '9px', color: '#666', marginTop: '1px' }}>{item.elevation.toString().replace('.', ',')}m</div>
              </div>
                             {/* Bar */}
               <div className="relative flex justify-center">
                 <div 
                   className="rounded-t-sm relative z-10"
                   style={{ 
                     height: `${barHeight}px`,
                                            width: responsive.isMobile() ? '15px' : '60px',
                     transition: 'height 1.5s ease, background-color 0.2s ease',
                     backgroundColor: isHovered ? (item.isLowest ? 'rgba(29, 78, 216, 0.9)' : 'rgba(55, 65, 81, 0.9)') : (item.isLowest ? 'rgba(59, 130, 246, 0.9)' : 'rgba(0, 0, 0, 0.9)')
                   }}
                 />
               </div>
            </div>
          );
        })}
      </div>
      

    </div>
  );
};

export default HighestElevationChart; 