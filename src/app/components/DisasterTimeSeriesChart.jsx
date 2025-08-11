'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DisasterTimeSeriesChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/Disaster_Dataset_with_Summaries_fixed.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const lines = csvText.split('\n');
        const headers = lines[0].split(';');
        const disasterTypeIndex = headers.indexOf('disaster_type');
        const startYearIndex = headers.indexOf('start_year');
        
        // Count disaster types by year
        const disasterCountsByYear = {};
        lines.slice(1).forEach(line => {
          if (line.trim()) {
            const values = line.split(';');
            const disasterType = values[disasterTypeIndex];
            const startYear = values[startYearIndex];
            
            if (disasterType && disasterType.trim() && startYear && startYear.trim()) {
              const year = parseInt(startYear);
              if (!isNaN(year) && year >= 1900 && year <= 2024) {
                if (!disasterCountsByYear[year]) {
                  disasterCountsByYear[year] = {};
                }
                disasterCountsByYear[year][disasterType] = (disasterCountsByYear[year][disasterType] || 0) + 1;
              }
            }
          }
        });

        // Convert to array format for visualization
        const chartData = Object.keys(disasterCountsByYear)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(year => {
            const yearData = { year: parseInt(year) };
            Object.keys(disasterCountsByYear[year]).forEach(disasterType => {
              yearData[disasterType] = disasterCountsByYear[year][disasterType];
            });
            return yearData;
          });

        setData(chartData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading disaster data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get all unique disaster types for legend
  const disasterTypes = new Set();
  data.forEach(yearData => {
    Object.keys(yearData).forEach(key => {
      if (key !== 'year') {
        disasterTypes.add(key);
      }
    });
  });

  // Pacific night scene colors
  const pacificColors = [
    '#0a0a0a', // Deep black night sky
    '#1a1a2e', // Dark blue-black
    '#16213e', // Deep ocean blue
    '#0f3460', // Stormy blue
    '#533483', // Purple night
    '#7209b7', // Deep purple
    '#3a0ca3', // Royal blue
    '#4361ee', // Ocean blue
    '#4cc9f0', // Light blue
    '#4895ef', // Sky blue
    '#f72585', // Pink highlight
    '#b5179e'  // Magenta
  ];

  if (loading) {
    return (
      <div style={{ 
        width: '100%', 
        height: '500px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div>Loading disaster time series data...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '1200px', 
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="year" 
            stroke="#fff"
            tick={{ fill: '#fff' }}
            label={{ value: 'Year', position: 'insideBottom', offset: -10, fill: '#fff' }}
          />
          <YAxis 
            stroke="#fff"
            tick={{ fill: '#fff' }}
            label={{ value: 'Number of Events', angle: -90, position: 'insideLeft', fill: '#fff' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a1a2e', 
              border: '1px solid #4361ee',
              color: '#fff'
            }}
          />
          <Legend 
            wrapperStyle={{ color: '#fff' }}
          />
          {Array.from(disasterTypes).map((disasterType, index) => (
            <Line
              key={disasterType}
              type="monotone"
              dataKey={disasterType}
              stroke={pacificColors[index % pacificColors.length]}
              strokeWidth={2}
              dot={{ fill: pacificColors[index % pacificColors.length], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DisasterTimeSeriesChart; 