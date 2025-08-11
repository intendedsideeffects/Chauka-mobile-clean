"use client"
import { useState, useEffect, useRef } from 'react';
import PlotsScatterChart from './PlotsScatterChart';
import responsive from '../utils/responsive';

  const STATUS_HEIGHT = responsive.isMobile() ? 10000 : 7000; // Changed to 10000 for mobile
const STATUS_WIDTH = responsive.isMobile() ? 800 : 1600; // Reduced width for mobile to prevent huge margins
const CLIMATE_YEAR_MIN = 1990; // Climate resistance data starts from 1990
const CLIMATE_YEAR_MAX = 2025;
  const getYearPosition = (year, dataType = 'disaster') => {
    if (dataType === 'climate-resistance') {
      return ((CLIMATE_YEAR_MAX - year) / (CLIMATE_YEAR_MAX - CLIMATE_YEAR_MIN)) * STATUS_HEIGHT;
    }
    // For disaster data: map years 1900-2025 to the height
    return ((2025 - year) / (2025 - 1900)) * STATUS_HEIGHT;
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

const ExtinctSpeciesViz = () => {
  const [data, setData] = useState([]);
  const [timelineData, setTimelineData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const scatterSectionRef = useRef(null);

  // Load data from local CSV instead of Supabase
  const loadData = async () => {
    try {
      console.log('ExtinctSpeciesVizMobile - Starting data load...');
      const response = await fetch('/Disaster_Dataset_with_Summaries_fixed.csv');
      const csvText = await response.text();
      console.log('ExtinctSpeciesVizMobile - CSV loaded, length:', csvText.length);
      console.log('ExtinctSpeciesVizMobile - First 200 chars of CSV:', csvText.substring(0, 200));
      
      const stories = parseCSV(csvText);
      console.log('ExtinctSpeciesVizMobile - Parsed CSV, total stories:', stories.length);
      console.log('ExtinctSpeciesVizMobile - Sample story:', stories[0]);
      
      // Map stories to scatterplot points - show only flood disasters
      const points = stories
        .filter(row => {
          const isFlood = row.disaster_type && row.disaster_type.toLowerCase().includes('flood');
          const hasYear = row.start_year;
          console.log('Filtering row:', row.disaster_type, 'isFlood:', isFlood, 'hasYear:', hasYear);
          return isFlood && hasYear;
        })
        .map((row) => {
          const year = row.start_year ? parseInt(String(row.start_year).trim(), 10) : null;
          const point = {
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
          console.log('Created point:', point);
          return point;
        });
      console.log('Scatterplot points (flood disasters only):', points);
      console.log('Number of flood disasters found:', points.length);
      console.log('Sample flood disaster:', points[0]);
      setData(points);
      
                                                     // Timeline marks (every 25 years) - span from 1900 to 2025
         const timelineMarks = [];
         for (let year = 1900; year <= 2025; year += 25) {
          const mark = {
            x: STATUS_WIDTH / 2,
            y: getYearPosition(year),
            label: year.toString(),
            event: `Year ${year}`, // Add some content to the event field
          };
          timelineMarks.push(mark);
          console.log('Created timeline mark:', mark);
        }
      console.log('Timeline marks created:', timelineMarks);
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

  console.log('ExtinctSpeciesVizMobile - visibleData length:', visibleData.length);
  console.log('ExtinctSpeciesVizMobile - timelineData length:', timelineData.length);
  console.log('ExtinctSpeciesVizMobile - visibleData sample:', visibleData.slice(0, 3));
  console.log('ExtinctSpeciesVizMobile - timelineData sample:', timelineData.slice(0, 3));

  return (
    <div ref={scatterSectionRef} style={{ 
      width: '100%', 
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

export default ExtinctSpeciesViz; 






