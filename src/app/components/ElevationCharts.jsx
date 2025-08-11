'use client';
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ElevationCharts = () => {
  const [lowElevationData, setLowElevationData] = useState([]);
  const [highestElevationData, setHighestElevationData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/pop_low_el.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const lines = csvText.split('\n');
        const headers = lines[0].split(';');
        const data = lines.slice(1).filter(line => line.trim() !== '').map(line => {
          const values = line.split(';');
          return {
            country: values[0],
            elevation: values[1],
            elevationDesc: values[2],
            timePeriod: values[3],
            obsValue: parseInt(values[4]) || 0,
            highestElevation: parseInt(values[5]) || 0
          };
        });

        // Filter for 0-5 meters elevation data
        const lowElevation = data
          .filter(item => item.elevation === '5M')
          .map(item => ({
            country: item.country,
            population: item.obsValue
          }))
          .sort((a, b) => b.population - a.population);

        // Get unique countries with their highest elevation
        const highestElevation = data
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
          .sort((a, b) => a.elevation - b.elevation);

        setLowElevationData(lowElevation);
        setHighestElevationData(highestElevation);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '100px', width: '100%' }}>
      {/* Chart 1: Population at 0-5 meters elevation */}
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={lowElevationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid horizontal={true} vertical={false} />
            <XAxis 
              dataKey="country" 
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip 
              labelFormatter={(label) => `Country: ${label}`}
              formatter={(value, name) => [value, 'Population']}
            />
            <Bar dataKey="population" fill="#000000" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2: Island highest elevation */}
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={highestElevationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid horizontal={true} vertical={false} />
            <XAxis 
              dataKey="country" 
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip 
              labelFormatter={(label) => `Country: ${label}`}
              formatter={(value, name) => [value, 'Elevation (m)']}
            />
            <Bar dataKey="elevation" fill="#000000" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ElevationCharts; 