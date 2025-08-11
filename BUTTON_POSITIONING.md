# SeaLevelRiseChart Button Positioning Documentation

## ⚠️ CRITICAL: DO NOT MODIFY BUTTON POSITIONS WITHOUT EXPLICIT APPROVAL

This document records the final working button positions for the SeaLevelRiseChart component. These positions were carefully calibrated over multiple iterations and should not be changed without thorough testing.

## Final Button Positions (as of latest commit)

### Main Controls Container
- **Position**: `left: '100%', top: '-150px', height: '200px'`
- **Purpose**: Positions the entire button container just outside the right edge of the chart area
- **Critical**: Prevents horizontal scrollbar issues

### Select Parameter Image
- **Position**: `left: '6px', top: '-120px', width: '400px', height: '200px'`
- **Purpose**: Curved text image positioned outside chart area but close enough to be clearly associated
- **Rotation**: `-20deg` for visual appeal

### Temperature Buttons (2°C and 4°C)
- **2°C Button**: `left: '140px', top: '120px', width: '80px', height: '80px'`
- **4°C Button**: `left: '240px', top: '160px', width: '80px', height: '80px'`
- **Purpose**: Small circular buttons positioned to avoid overlapping with chart or text

### Year Buttons (2050 and 2100)
- **2050 Button**: `left: '140px', top: '-20px', width: '120px', height: '120px'`
- **2100 Button**: `left: '260px', top: '0px', width: '120px', height: '120px'`
- **Purpose**: Larger circular buttons positioned above the temperature buttons

## Why These Positions Were Chosen

1. **No Horizontal Scrollbar**: Using `left: '100%'` for container prevents negative positioning that causes scrollbars
2. **Clear Association**: Buttons are positioned close enough to the chart to be clearly associated but outside the main content area
3. **No Overlap**: Careful spacing prevents buttons from overlapping with chart bars, text, or each other
4. **Visual Hierarchy**: Larger year buttons positioned above smaller temperature buttons
5. **Responsive Design**: Positions work well across different screen sizes

## Protection Measures

1. **Constants File**: All positions stored in `SeaLevelRiseChartConstants.js`
2. **Clear Warnings**: "DO NOT MODIFY" comments in constants file
3. **Documentation**: This file serves as permanent record
4. **Git History**: Complete history of positioning iterations preserved

## How to Modify (If Absolutely Necessary)

1. **Create Backup Branch**: `git checkout -b button-positioning-backup`
2. **Update Constants**: Modify values in `SeaLevelRiseChartConstants.js`
3. **Test Thoroughly**: Check on multiple screen sizes and browsers
4. **Update Documentation**: Modify this file with new positions and reasoning
5. **Get Approval**: Ensure changes are approved before merging

## File Locations

- **Constants**: `src/app/components/SeaLevelRiseChartConstants.js`
- **Component**: `src/app/components/SeaLevelRiseChart.jsx`
- **Documentation**: `BUTTON_POSITIONING.md`

## Last Updated

- **Date**: Current session
- **Reason**: Final positioning after extensive iterative adjustments
- **Status**: ✅ Working perfectly, no further changes needed 