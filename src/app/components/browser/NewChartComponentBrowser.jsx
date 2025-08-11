'use client';

import React, { useState, useEffect } from 'react';


const NewChartComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [currentImageData, setCurrentImageData] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Function to format numbers as K
  const formatAsK = (value) => {
    if (value >= 1000) {
      return `${Math.round(value / 1000)}K`;
    }
    return value.toString();
  };

  // Function to hide 0 label on Y-axis and show whole numbers
  const hideZeroLabel = (value) => {
    if (value === 0) return '';
    if (value >= 1000) {
      return `${Math.round(value / 1000)}K`;
    }
    return value.toString();
  };

  // Handle bar hover
  const handleBarMouseEnter = (data, index) => {
    setHoveredBar(index);
    setHoveredIndex(index);
    setCurrentImageData({
      year: data.year,
      affectedPeople: data.affectedPeople,
      index: index
    });
  };

  const handleBarMouseLeave = () => {
    setHoveredBar(null);
    setHoveredIndex(null);
    setCurrentImageData(null);
  };

  const handleBarClick = () => {
    if (currentImageData) {
      setShowFullscreenImage(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/pacific_disaster_impact_cleaned.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const lines = csvText.trim().split('\n');
        
        // Parse CSV data
        const rawData = lines.slice(1).map(line => {
          const values = line.split(';');
          return {
            year: parseInt(values[0]),
            country: values[1],
            affectedPeople: parseInt(values[2])
          };
        }).filter(item => !isNaN(item.year) && !isNaN(item.affectedPeople));
        
        console.log('Raw data sample:', rawData.slice(0, 5));
        
        // Sum affected people per year
        const yearTotals = {};
        rawData.forEach(item => {
          if (yearTotals[item.year]) {
            yearTotals[item.year] += item.affectedPeople;
          } else {
            yearTotals[item.year] = item.affectedPeople;
          }
        });
        
        console.log('Year totals:', yearTotals);
        
        // Convert to array format for chart
        const chartData = Object.keys(yearTotals)
          .map(year => ({
            year: parseInt(year),
            affectedPeople: yearTotals[year]
          }))
          .sort((a, b) => a.year - b.year);
        
        console.log('Chart data:', chartData);
        setData(chartData);
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
      <div style={{ 
        width: '100%', 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: '8px'
      }}>
        <div style={{ fontSize: '1.2rem', color: '#6b7280' }}>Loading disaster data...</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '450px', position: 'relative' }}>
      <style>
        {`
          .recharts-bar-rectangle:hover {
            opacity: 0.8 !important;
            transition: opacity 0.2s ease !important;
          }
        `}
      </style>
      {/* Chart area with bars */}
      <div className="flex items-end justify-between h-[350px] relative" style={{ 
        transition: 'height 1.5s ease',
        marginLeft: '80px',
        marginRight: '20px'
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
          const maxValue = data.length > 0 ? Math.max(...data.map(d => d.affectedPeople)) : 1;
          return (
            <div 
              key={index}
              className="absolute z-20" 
              style={{ 
                top: `${350 - (value * 280) - 8}px`,
                left: '-25px',
                fontSize: '12px',
                color: '#666666',
                fontFamily: 'Helvetica World, Arial, sans-serif'
              }}
            >
              {formatAsK(Math.round(value * maxValue))}
            </div>
          );
        })}
        
        {/* Zero line positioned directly under bars */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-black"></div>
       
        {data.map((item, index) => {
          // Use max value for scaling
          const maxValue = data.length > 0 ? Math.max(...data.map(d => d.affectedPeople)) : 1;
          
          // Simple linear scale
          const maxBarHeight = 280;
          const barHeight = (item.affectedPeople / maxValue) * maxBarHeight;
          const isHovered = hoveredIndex === index;
          const shouldReduceOpacity = hoveredIndex !== null && hoveredIndex !== index;
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center flex-1"
              style={{ margin: '0 1px' }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleBarClick(item, index)}
                              style={{
                  transition: 'opacity 0.2s ease',
                  opacity: shouldReduceOpacity ? 0.6 : 1,
                  cursor: 'pointer',
                  zIndex: isHovered ? 40 : 20
                }}
            >

              
              {/* Bar */}
              <div className="relative flex justify-center" style={{ alignSelf: 'flex-end' }}>
                {/* Label above bar - only for blue bars */}
                {[2016, 2018, 2020].includes(item.year) && (
                  <div 
                    className="absolute z-30"
                    style={{ 
                      bottom: `${Math.max(barHeight, 1) + 10}px`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '11px',
                      color: '#000',
                      textAlign: 'center'
                    }}
                  >
                    {formatAsK(item.affectedPeople)}
                  </div>
                )}
                <div 
                  className="rounded-t-sm relative z-10"
                  style={{ 
                    height: `${Math.max(barHeight, 1)}px`,
                    width: 'calc(100% - 2px)',
                    minWidth: '30px',
                    maxWidth: '120px',
                    minHeight: '1px',
                    transition: 'height 1.5s ease, background-color 0.2s ease, width 0.3s ease',
                    backgroundColor: isHovered ? 
                      ([2016, 2018, 2020].includes(item.year) ? 'rgba(29, 78, 216, 0.9)' : 'rgba(55, 65, 81, 0.9)') : 
                      ([2016, 2018, 2020].includes(item.year) ? 'rgba(59, 130, 246, 0.9)' : 'rgba(0, 0, 0, 0.9)')
                  }}
                />
              </div>
            </div>
          );
        })}
        
        {/* X-axis year labels */}
        {[2005, 2016, 2018, 2020, 2023].map((year, index) => {
          const yearIndex = data.findIndex(item => item.year === year);
          if (yearIndex === -1) return null; // Skip if year not in data
          
          return (
            <div 
              key={year}
              className="absolute z-20" 
              style={{ 
                bottom: '-30px',
                left: `${(yearIndex / (data.length - 1)) * 100}%`,
                transform: 'translateX(-50%)',
                fontSize: '12px',
                color: '#666666',
                fontFamily: 'Helvetica World, Arial, sans-serif',
                textAlign: 'center',
                width: '40px'
              }}
            >
              {year}
            </div>
          );
        })}
          
      </div>
      
      {/* Y-axis label - positioned outside chart area */}
      <div style={{
        position: 'absolute',
        left: '-155px',
        top: 'calc(50% - 145px)',
        transform: 'translateY(-50%)',
        fontSize: '14px',
        fontFamily: 'Helvetica World, Arial, sans-serif',
        color: '#666666',
        textAlign: 'right',
        pointerEvents: 'none',
        lineHeight: '1.2',
        width: '200px'
      }}>
        PEOPLE AFFECTED BY<br/>
        CLIMATE-RELATED HAZARDS
      </div>
      

      
      {/* Fullscreen image overlay */}
      {showFullscreenImage && currentImageData && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            cursor: 'pointer'
          }}
          onClick={() => setShowFullscreenImage(false)}
        >
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            textAlign: 'center'
          }}>
            {/* Placeholder for the image - you can replace this with actual image paths */}
            <div style={{
              width: '800px',
              height: '600px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '2px dashed rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              borderRadius: '8px'
            }}>
              <div>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>
                  {currentImageData.year}
                </div>
                <div style={{ fontSize: '18px', marginBottom: '20px' }}>
                  {formatAsK(currentImageData.affectedPeople)} People Affected
                </div>
                <div style={{ fontSize: '14px', opacity: 0.7 }}>
                  Image placeholder - Click to close
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewChartComponent; 