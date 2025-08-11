'use client';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DisasterByCountryChart = () => {
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
        const countryIndex = headers.indexOf('country');
        
        // Count disasters by country
        const disasterCountsByCountry = {};
        lines.slice(1).forEach(line => {
          if (line.trim()) {
            const values = line.split(';');
            const country = values[countryIndex];
            
            if (country && country.trim()) {
              disasterCountsByCountry[country] = (disasterCountsByCountry[country] || 0) + 1;
            }
          }
        });

        // Convert to array format and sort by count (highest to lowest)
        const chartData = Object.entries(disasterCountsByCountry)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count);

        setData(chartData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading disaster data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <div>Loading disaster by country data...</div>
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
        <BarChart
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="country" 
            stroke="#333"
            tick={{ fill: '#333' }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis 
            stroke="#333"
            tick={{ fill: '#333' }}
            label={{ value: 'Number of Events', angle: -90, position: 'insideLeft', fill: '#333' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              color: '#333'
            }}
          />
          <Bar dataKey="count" fill="#4361ee" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DisasterByCountryChart; 