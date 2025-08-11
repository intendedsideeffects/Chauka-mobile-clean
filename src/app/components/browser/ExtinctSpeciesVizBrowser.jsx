"use client"
import { useState, useEffect, useMemo, useCallback, useLayoutEffect, useRef } from 'react';
import { debounce } from 'lodash';
import historicalEvents from "../../data/historicalPoints"
import birdArr from '../../data/birdArray';
import PlotsScatterChart from '../PlotsScatterChart';

const STATUS_HEIGHT = 7000; // Reduced to match segments 3-9 height
const STATUS_WIDTH = 1600;
const getYearPosition = (year) => {
  return ((2200 - year) / (2200 - 1400)) * STATUS_HEIGHT;
};

// Utility function to parse CSV data
const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(';');
  
  return lines.slice(1) // Skip header
    .filter(line => line.trim()) // Remove empty lines
    .map(line => {
      const values = line.split(';');
      const row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index] ? values[index].trim() : '';
      });
      return row;
    });
};

const ExtinctSpeciesVizBrowser = () => {
  const [data, setData] = useState([]);
  const [timelineData, setTimelineData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const scatterSectionRef = useRef(null);

  // Load data from local CSV instead of Supabase
  const loadData = async () => {
    try {
      const response = await fetch('/Disaster_Dataset_with_Summaries_fixed.csv');
      const csvText = await response.text();
      const stories = parseCSV(csvText);
      
      // Map stories to scatterplot points - show only flood disasters
      const points = stories
        .filter(row => row.disaster_type && row.disaster_type.toLowerCase().includes('flood') && row.start_year) // Show only flood disasters with valid years
        .map((row) => {
          const year = row.start_year ? parseInt(String(row.start_year).trim(), 10) : null;
          return {
            x: Math.random() * STATUS_WIDTH - STATUS_WIDTH / 2 + (Math.random() - 0.5) * 100,
            y: year !== null ? getYearPosition(year) : null,
            disaster_type: row.disaster_type,
            country: row.country,
            start_year: year,
            summary: row.summary,
            total_affected: row.total_affected ? Number(row.total_affected) : 0,
            total_injured: row.total_injured ? Number(row.total_injured) : 0,
            total_homeless: row.total_homeless ? Number(row.total_homeless) : 0,
            total_deaths: row.total_deaths ? Number(row.total_deaths) : 0,
          };
        });
      console.log('Browser Scatterplot points (flood disasters only):', points);
      setData(points);
      
      // Timeline marks (every 100 years)
      const timelineMarks = [];
      for (let year = 1400; year <= 2200; year += 100) {
        timelineMarks.push({
          x: STATUS_WIDTH / 2,
          y: getYearPosition(year),
          label: year.toString(),
          event: '',
        });
      }
      setTimelineData(timelineMarks);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height: '100vh' }} />;
  }

  const visibleData = data;

  return (
    <div ref={scatterSectionRef} style={{ 
      width: '100vw', 
      maxWidth: '100%', 
      overflow: 'visible',
      position: 'relative',
      zIndex: 9999
    }}>
      {isLoading ? (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading chart data...</div>
      ) : (
        <PlotsScatterChart timelineData={timelineData} visibleData={visibleData} />
      )}
    </div>
  );
};

export default ExtinctSpeciesVizBrowser; 


