'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const HistoricalSeaLevelRise = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/sealevelrise.csv');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const lines = csvText.trim().split('\n');
        
        const parsedData = lines.slice(1).map(line => {
          const values = line.split(';');
          return {
            year: parseFloat(values[0].replace(',', '.')),
            seaLevel: parseFloat(values[1].replace(',', '.'))
          };
        }).filter(item => !isNaN(item.year) && !isNaN(item.seaLevel));
        
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
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: '400px', boxSizing: 'border-box', pointerEvents: 'none' }}>
      <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              dataKey="year" 
              type="number"
              domain={[1970, 2025]}
              ticks={[1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020]}
            />
            <YAxis dx={-10} width={40} tickLine={false} />
            <Tooltip 
              formatter={(value, name) => [Math.round(value), name]}
              labelFormatter={(label) => Math.floor(label)}
            />
            <Line type="monotone" dataKey="seaLevel" stroke="#000000" />
          </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalSeaLevelRise; 