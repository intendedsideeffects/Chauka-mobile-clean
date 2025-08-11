'use client';
import React, { useState, useEffect } from 'react';
import { voronoi } from 'd3-voronoi';
import { select } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

const DisasterVoronoiChart = () => {
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
        
        // Count disaster types
        const disasterCounts = {};
        lines.slice(1).forEach(line => {
          if (line.trim()) {
            const values = line.split(';');
            const disasterType = values[disasterTypeIndex];
            if (disasterType && disasterType.trim()) {
              disasterCounts[disasterType] = (disasterCounts[disasterType] || 0) + 1;
            }
          }
        });

        // Convert to array format for visualization with size-based positioning
        const chartData = Object.entries(disasterCounts).map(([type, count]) => {
          // Calculate position based on count - higher counts get more central positions
          const maxCount = Math.max(...Object.values(disasterCounts));
          const sizeRatio = count / maxCount;
          
          // Higher counts get positions closer to center, lower counts get edge positions
          const centerX = 500; // Center of canvas
          const centerY = 250;
          const maxRadius = 300;
          
          // Adjust radius based on count - higher counts get smaller radius (closer to center)
          // This will make their Voronoi cells larger
          const radius = maxRadius * (1 - sizeRatio * 0.8);
          const angle = Math.random() * 2 * Math.PI;
          
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          return {
            type,
            count,
            x: x,
            y: y
          };
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

  useEffect(() => {
    if (data.length === 0 || loading) return;

    // Clear previous chart
    select('#voronoi-container').selectAll('*').remove();

    const width = 1000;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };

    const svg = select('#voronoi-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', '#f8f9fa');

    // Create color scale inspired by the Pacific night scene
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

    // Create color scale
    const colorScale = scaleOrdinal()
      .domain(data.map(d => d.type))
      .range(pacificColors);

        // Create simple Voronoi diagram - one point per disaster type
    const voronoiDiagram = voronoi()
      .x(d => d.x)
      .y(d => d.y)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    const polygons = voronoiDiagram.polygons(data);

    // Draw Voronoi cells - one segment per disaster type
    svg.selectAll('path')
      .data(polygons)
      .enter()
      .append('path')
      .attr('d', d => d ? `M${d.join('L')}Z` : '')
      .attr('fill', (d, i) => colorScale(data[i].type))
      .attr('opacity', 0.8)
      .on('mouseover', function(event, d) {
        select(this)
          .attr('opacity', 1);
      })
      .on('mouseout', function(event, d) {
        select(this)
          .attr('opacity', 0.8);
      });

    // Add labels for each disaster type
    svg.selectAll('text')
      .data(polygons)
      .enter()
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('fill', '#fff')
      .attr('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)')
      .style('pointer-events', 'none')
      .each(function(d, i) {
        if (!d) return;
        
        const text = select(this);
        const disasterData = data[i];
        
        // Calculate the center of the polygon
        const centerX = d.reduce((sum, point) => sum + point[0], 0) / d.length;
        const centerY = d.reduce((sum, point) => sum + point[1], 0) / d.length;
        
        // Position the text at the polygon center
        text.attr('x', centerX).attr('y', centerY);
        
        const lines = disasterData.type.split(' ').length > 2 ? 
          [disasterData.type.split(' ').slice(0, Math.ceil(disasterData.type.split(' ').length / 2)).join(' '), 
           disasterData.type.split(' ').slice(Math.ceil(disasterData.type.split(' ').length / 2)).join(' ')] : 
          [disasterData.type];
        
        // Add each line
        lines.forEach((line, j) => {
          text.append('tspan')
            .attr('x', centerX)
            .attr('dy', j === 0 ? '-0.6em' : '1.2em')
            .text(line);
        });
        
        // Add count on a new line
        text.append('tspan')
          .attr('x', centerX)
          .attr('dy', '1.2em')
          .attr('font-size', '10px')
          .text(`(${disasterData.count})`);
      });



  }, [data, loading]);

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
        <div>Loading disaster data...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '1000px', 
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <div id="voronoi-container"></div>
    </div>
  );
};

export default DisasterVoronoiChart; 