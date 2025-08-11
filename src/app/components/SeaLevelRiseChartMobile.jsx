'use client';

import React, { useState, useEffect } from 'react';
import { BUTTON_POSITIONS, CHART_DIMENSIONS, GLOBAL_SEA_LEVEL_RISE } from './SeaLevelRiseChartConstants';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { responsive } from '../utils/responsive';

// ⚠️ CRITICAL: Button positioning has been carefully calibrated
// DO NOT modify BUTTON_POSITIONS without testing on multiple screen sizes
// Current positions: Select Parameter (6px), 2°C (140px), 4°C (240px), 2050 (140px), 2100 (260px)
// See BUTTON_POSITIONING.md for complete documentation
const SeaLevelRiseChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDegree, setSelectedDegree] = useState('2');
  const [selectedYear, setSelectedYear] = useState('2050');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/Coastal_Elevation_Exposure__Comma_Format_.csv');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        
        // Parse CSV with semicolon separator
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(';');
        
        const parsedData = lines.slice(1).map(line => {
          const values = line.split(';');
          return {
            country: values[0],
            threshold: parseFloat(values[1].replace(',', '.')),
            seaLevelRise2Degree2050: parseFloat(values[2].replace(',', '.')),
            seaLevelRise2Degree2100: parseFloat(values[3].replace(',', '.')),
            seaLevelRise4Degree2050: parseFloat(values[4].replace(',', '.')),
            seaLevelRise4Degree2100: parseFloat(values[5].replace(',', '.'))
          };
        }).filter(item => !isNaN(item.seaLevelRise2Degree2050));
        
        setData(parsedData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading sea level rise data...</div>
      </div>
    );
  }

  // Get the selected data based on user choices
  const getSelectedData = () => {
    const columnName = `seaLevelRise${selectedDegree}Degree${selectedYear}`;
    return data.map(item => ({
      ...item,
      selectedValue: item[columnName]
    }));
  };

  const selectedData = getSelectedData();
  const currentGlobalRise = GLOBAL_SEA_LEVEL_RISE[selectedYear][selectedDegree];

  // CustomBarLabel SVG component (copied from section 5 style)
  const CustomBarLabel = (props) => {
    const { x, y, width, value, payload } = props;
    if (!payload || !value) return null;
    
    return (
      <g>
        {/* Island name above bar */}
        <text
          x={x + width / 2}
          y={y - 20}
          textAnchor="middle"
          fill="#000"
          fontSize={12}
        >
          {payload.country}
        </text>
        {/* Value below island name */}
        <text
          x={x + width / 2}
          y={y - 5}
          textAnchor="middle"
          fill="#666"
          fontSize={11}
        >
          {value.toFixed(2)}m
        </text>
      </g>
    );
  };

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               return (
                 <div className="w-full bg-transparent relative" style={{
                   ...CHART_DIMENSIONS.container, 
                   pointerEvents: 'auto', 
                   padding: responsive.isMobile() ? '0 0px' : '0 30px',
                                                           maxWidth: responsive.isMobile() ? 'calc(100vw - 80px)' : '100%',
                     overflow: 'visible',
                     width: responsive.isMobile() ? 'calc(100vw - 80px)' : '100%',
                                                                               marginLeft: responsive.isMobile() ? '0px' : '0px',
                                           marginRight: responsive.isMobile() ? '40px' : '0px'
                 }}>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   {/* Controls - Scattered in top-right corner of page */}
                    <div className="absolute z-50" style={{
                      ...BUTTON_POSITIONS.CONTAINER,
                                             left: responsive.isMobile() ? '0px' : '100%',
                      transform: responsive.isMobile() ? 'none' : 'none'
                    }}>
                   
                                                                          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       {/* 2°C Button - positioned randomly in top-right */}
                        <div 
                          className="absolute"
                                                  style={{
                                                                                                                                                                                                                                       ...BUTTON_POSITIONS.TEMP_2C,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                                                                                      left: responsive.isMobile() ? '-20px' : BUTTON_POSITIONS.TEMP_2C.left,
                                                             top: responsive.isMobile() ? '-60px' : BUTTON_POSITIONS.TEMP_2C.top,
                          }}
                          onClick={() => setSelectedDegree('2')}
                        >
                  <svg width="80" height="80" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
                    <defs>
                      <path id="circlePath2C" d="M40,10 A30,30 0 1,1 39.99,10" />
                    </defs>
                     <circle cx="40" cy="40" r="25" fill={selectedDegree === '2' ? "rgba(0, 0, 0, 0.9)" : "#ffffff"} stroke={selectedDegree === '2' ? "rgba(0, 0, 0, 0.9)" : "#000000"} strokeWidth={selectedDegree === '2' ? "0.5" : "1"} />
                                           <text fill={selectedDegree === '2' ? "#fff" : "#000"} fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" x="40" y="40">
                        2°C
                    </text>
                  </svg>
                </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       {/* 4°C Button - positioned randomly in top-right */}
                        <div 
                          className="absolute"
                                                  style={{
                                                                                                                                                                                                                                     ...BUTTON_POSITIONS.TEMP_4C,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                                                                                      left: responsive.isMobile() ? '60px' : BUTTON_POSITIONS.TEMP_4C.left,
                                                             top: responsive.isMobile() ? '-60px' : BUTTON_POSITIONS.TEMP_4C.top,
                          }}
                          onClick={() => setSelectedDegree('4')}
                        >
                  <svg width="140" height="140" style={{ position: 'absolute', left: -30, top: -30, pointerEvents: 'none' }}>
                    <defs>
                      <path id="circlePath4C" d="M60,30 A30,30 0 1,1 59.99,30" />
                      <path id="circlePathText4C" d="M60,30 A30,30 0 1,1 60,90" />
                    </defs>
                    {/* Wrapped text above the dot */}
                    <text fill="#666" fontSize="10" fontWeight="normal" letterSpacing="0.05em">
                      <textPath xlinkHref="#circlePathText4C" startOffset="50%" textAnchor="middle">
                        Select warming
                      </textPath>
                    </text>
                     <circle cx="60" cy="60" r="25" fill={selectedDegree === '4' ? "rgba(0, 0, 0, 0.9)" : "#ffffff"} stroke={selectedDegree === '4' ? "rgba(0, 0, 0, 0.9)" : "#000000"} strokeWidth={selectedDegree === '4' ? "0.5" : "1"} />
                                           <text fill={selectedDegree === '4' ? "#fff" : "#000"} fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" x="60" y="60">
                        4°C
                    </text>
                  </svg>
                </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               {/* 2050 Button - positioned randomly in top-right */}
                       <div 
                         className="absolute"
                                                style={{
                                                                                                                                                                                                                                                                                                                                                                                                                                              ...BUTTON_POSITIONS.YEAR_2050,
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           cursor: 'pointer',
                                                                                                                                                                                                                               left: responsive.isMobile() ? '20px' : BUTTON_POSITIONS.YEAR_2050.left,
                              top: responsive.isMobile() ? '20px' : BUTTON_POSITIONS.YEAR_2050.top,
                         }}
                         onClick={() => setSelectedYear('2050')}
                       >
                  <svg width="120" height="120" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
                    <defs>
                      <path id="circlePath2050" d="M60,15 A45,45 0 1,1 59.99,15" />
                    </defs>
                     <circle cx="60" cy="60" r="40" fill={selectedYear === '2050' ? "rgba(0, 0, 0, 0.9)" : "#ffffff"} stroke={selectedYear === '2050' ? "rgba(0, 0, 0, 0.9)" : "#000000"} strokeWidth={selectedYear === '2050' ? "0.5" : "1"} />
                                           <text fill={selectedYear === '2050' ? "#fff" : "#000"} fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" x="60" y="60">
                        2050
                    </text>
                  </svg>
                </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               {/* 2100 Button - positioned randomly in top-right */}
                     <div 
                       className="absolute"
                                            style={{
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          ...BUTTON_POSITIONS.YEAR_2100,
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         cursor: 'pointer',
                                                                                                                                                                                                                       left: responsive.isMobile() ? '140px' : BUTTON_POSITIONS.YEAR_2100.left,
                              top: responsive.isMobile() ? '20px' : BUTTON_POSITIONS.YEAR_2100.top,
                       }}
                       onClick={() => setSelectedYear('2100')}
                     >
                  <svg width="120" height="120" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
                    <defs>
                      <path id="circlePath2100" d="M60,15 A45,45 0 1,1 59.99,15" />
                      <path id="circlePathText2100" d="M60,10 A55,55 0 0,1 115,60" />
                    </defs>
                    {/* Wrapped text above the dot */}
                    <text fill="#666" fontSize="12" fontWeight="normal" letterSpacing="0.05em">
                      <textPath xlinkHref="#circlePathText2100" startOffset="50%" textAnchor="middle">
                        Select year
                      </textPath>
                    </text>
                    <circle cx="60" cy="60" r="40" fill={selectedYear === '2100' ? "rgba(0, 0, 0, 0.9)" : "#ffffff"} stroke={selectedYear === '2100' ? "rgba(0, 0, 0, 0.9)" : "#000000"} strokeWidth={selectedYear === '2100' ? "0.5" : "1"} />
                    <text fill={selectedYear === '2100' ? "#fff" : "#000"} fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" x="60" y="60">
                      2100
                    </text>
                  </svg>
                </div>
                
                                 {/* Simple rectangular buttons - HIDDEN FOR NOW */}
                 {/* <div style={{
                  display: 'flex',
                   flexDirection: 'row',
                   gap: '10px',
                   justifyContent: 'center',
                   marginTop: '20px',
                   marginBottom: '20px'
                 }}>
                   <button>2°C</button>
                   <button>4°C</button>
                   <button>2050</button>
                   <button>2100</button>
                 </div> */}
              </div>

                                                           <div>

                             <div className="relative" style={{ width: '100%', height: '100%' }}>
                                                                                                                                                               {/* Y-axis label - positioned ON THE RIGHT SIDE of y-axis like section 1 */}
                                             <div style={{
                         position: 'absolute',
                         top: '40px',
                         left: responsive.isMobile() ? '0px' : '10px',
                         fontSize: responsive.isMobile() ? '8px' : '14px',
                         fontFamily: 'Helvetica World, Arial, sans-serif',
                         color: '#666666',
                         textAlign: 'left',
                         pointerEvents: 'none',
                         lineHeight: '1.2',
                         zIndex: 1001,
                         width: responsive.isMobile() ? '120px' : '150px'
                       }}>
                        SEA LEVEL RISE<br/>
                        IN METERS (M)
                      </div>
                       
                       {/* Global sea level rise annotation - REMOVED */}
                   
                   {/* Extended line across the chart */}
                    <div className="absolute left-0 right-0 z-25" style={{ 
                       top: `${350 - (currentGlobalRise / 1.0) * 280}px`
                    }}>
                      <div className="border-t border-gray-400" style={{ height: '1px' }}></div>
                    </div>

                   {/* Horizontal gridlines */}
                   {[0, 0.5, 1.0].map((value, index) => (
                     <div 
                       key={index}
                       className="absolute left-0 right-0 z-15" 
                       style={{ 
                         top: `${350 - (value / 1.0) * 280}px`
                       }}
                     >
                       <div className="border-t border-gray-200" style={{ height: '1px' }}></div>
                     </div>
                   ))}

                                                                               {/* Y-axis labels - positioned to the right of y-axis */}
                     {[0, 0.5, 1.0].map((value, index) => (
                       <div 
                         key={index}
                         style={{ 
                           position: 'absolute',
                           top: `${350 - (value / 1.0) * 280 - 8}px`,
                           left: responsive.isMobile() ? '-25px' : '-30px',
                           fontSize: responsive.isMobile() ? '8px' : '12px',
                           color: '#666666',
                           fontFamily: 'Helvetica World, Arial, sans-serif',
                           zIndex: 1001,
                           pointerEvents: 'none'
                         }}
                       >
                         {value.toFixed(1)}
                       </div>
                     ))}

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               {/* Chart area with bars */}
                <div className="flex items-end justify-between h-[350px] relative" style={{ 
                  transition: 'height 1.5s ease',
                  width: '100%',
                  maxWidth: '100%'
                }}>
        {/* Dynamic blue gradient rectangle behind bars */}
        <div 
                                     className="absolute left-0 right-0 z-20"
          style={{
            top: `${350 - (currentGlobalRise / 1.0) * 280}px`,
            height: `${(currentGlobalRise / 1.0) * 280}px`,
            background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)',
            border: 'none'
          }}
        />
        {/* Zero line positioned directly under bars */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-black"></div>
       
        {selectedData.map((item, index) => {
          const barHeight = (item.selectedValue / 1.0) * 280;
          const globalLineHeight = (currentGlobalRise / 1.0) * 280;
          const isAboveGlobal = item.selectedValue > currentGlobalRise;
          const isHovered = hoveredIndex === index;
          const shouldReduceOpacity = hoveredIndex !== null && hoveredIndex !== index;
          
          return (
                                                   <div 
                key={index} 
                className="flex flex-col items-center flex-1"
                style={{
                                     marginLeft: responsive.isMobile() ? '2px' : '4px',
                   marginRight: responsive.isMobile() ? '2px' : '4px',
                  transition: 'opacity 0.2s ease',
                  opacity: shouldReduceOpacity ? 0.4 : 1,
                  cursor: 'pointer',
                  zIndex: isHovered ? 40 : 20
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >

              
              {/* Bar */}
              <div className="relative flex justify-center">
                {isAboveGlobal ? (
                  <div 
                    className="bg-blue-500 rounded-t-sm hover:bg-blue-600 relative z-10"
                                         style={{ 
                       height: `${barHeight}px`,
                       minHeight: '30px',
                       width: responsive.isMobile() ? '20px' : '60px',
                       transition: 'height 1.5s ease, background-color 0.2s ease',
                       backgroundColor: isHovered ? 'rgba(29, 78, 216, 0.9)' : 'rgba(59, 130, 246, 0.9)'
                     }}
                  />
                ) : (
                  <div 
                    className="bg-blue-500 rounded-t-sm hover:bg-blue-600 relative z-10"
                                         style={{ 
                       height: `${barHeight}px`,
                       minHeight: '30px',
                       width: responsive.isMobile() ? '20px' : '60px',
                       opacity: '0.5',
                       transition: 'height 1.5s ease, background-color 0.2s ease',
                       backgroundColor: isHovered ? 'rgba(29, 78, 216, 0.9)' : 'rgba(59, 130, 246, 0.9)'
                     }}
                  />
                )}
              </div>
              

            </div>
          );
        })}
      </div>
      
             {/* Labels positioned above bars */}
       {selectedData.map((item, index) => {
         const barHeight = (item.selectedValue / 1.0) * 280;
         const isHovered = hoveredIndex === index;
         const shouldReduceOpacity = hoveredIndex !== null && hoveredIndex !== index;
         
         // Adjust label position for Marshall Islands and Cook Islands to prevent overlap
         const isMarshallIslands = item.country.toLowerCase().includes('marshall');
         const isCookIslands = item.country.toLowerCase().includes('cook');
         const labelOffset = (isMarshallIslands || isCookIslands) ? 60 : 40;
         
         return (
           <div 
             key={`label-${index}`}
             style={{
               position: 'absolute',
               top: `${350 - barHeight - labelOffset}px`,
               left: `${(index / selectedData.length) * 100}%`,
               width: `${100 / selectedData.length}%`,
               textAlign: 'center',
               transition: 'opacity 0.2s ease',
               opacity: 1,
               zIndex: 200,
               pointerEvents: 'none'
             }}
           >
             <div style={{ fontSize: '8px', color: '#000', fontWeight: '500' }}>{item.country}</div>
                             <div style={{ fontSize: '7px', color: '#666', marginTop: '2px', fontWeight: '500' }}>{item.selectedValue.toFixed(2)}m</div>
           </div>
         );
       })}
        
        {/* Country labels below the chart - REMOVED since names are now above bars */}
             </div>
      </div>
    </div>
  );
};

export default SeaLevelRiseChart; 