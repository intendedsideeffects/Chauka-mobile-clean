'use client';

import React from 'react';
import SegmentTemplate from '../../components/sections/SegmentTemplate';
import PacificDisasterImpactChartMobile from './PacificDisasterImpactChartMobile';

const NewChartSegment = () => {
  return (
    <SegmentTemplate
      header=""
      text=""
              chartComponent={<PacificDisasterImpactChartMobile />}
      styles={{
        // You can override default styles here if needed
        container: {
          // Custom container styles
        },
        contentWrapper: {
          // Custom content wrapper styles
        },
        header: {
          // Custom header styles
        },
        text: {
          // Custom text styles
        },
        chartContainer: {
          // Custom chart container styles
        }
      }}
    />
  );
};

export default NewChartSegment; 


