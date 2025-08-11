// SeaLevelRiseChart Button Positioning Constants
// DO NOT MODIFY THESE VALUES WITHOUT EXPLICIT APPROVAL

export const BUTTON_POSITIONS = {
  // Main controls container
  CONTAINER: {
    left: '100%',
    top: '-150px',
    height: '200px'
  },
  
  // Select Parameter Image
  SELECT_PARAMETER: {
    left: '6px',
    top: '-120px',
    width: '400px',
    height: '200px'
  },
  
  // Temperature buttons
  TEMP_2C: {
    left: '8px', // 65px - 57px = 8px
    top: '82px', // 120px - 38px = 82px
    width: '80px',
    height: '80px'
  },
  
  TEMP_4C: {
    left: '108px', // 165px - 57px = 108px
    top: '122px', // 160px - 38px = 122px
    width: '80px',
    height: '80px'
  },
  
  // Year buttons
  YEAR_2050: {
    left: '8px', // 65px - 57px = 8px
    top: '-58px', // -20px - 38px = -58px
    width: '120px',
    height: '120px'
  },
  
  YEAR_2100: {
    left: '128px', // 185px - 57px = 128px
    top: '-38px', // 0px - 38px = -38px
    width: '120px',
    height: '120px'
  }
};

// Chart dimensions
export const CHART_DIMENSIONS = {
  container: {
    width: '100%',
    height: '400px'
  },
  chartArea: {
    height: '350px'
  }
};

// Global sea level rise predictions
export const GLOBAL_SEA_LEVEL_RISE = {
  '2050': {
    '2': 0.22,
    '4': 0.22
  },
  '2100': {
    '2': 0.47,
    '4': 0.63
  }
}; 