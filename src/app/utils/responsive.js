import { useState, useEffect } from 'react';

// SSR-safe responsive utility
export const responsive = {
  // Screen breakpoints
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },

  // SSR-safe check functions - return consistent values during SSR
  isMobile: () => {
    if (typeof window === 'undefined') return false; // Default to desktop during SSR
    return window.innerWidth < 768;
  },
  isTablet: () => {
    if (typeof window === 'undefined') return false; // Default to desktop during SSR
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  },
  isDesktop: () => {
    if (typeof window === 'undefined') return true; // Default to desktop during SSR
    return window.innerWidth >= 1024;
  },

  // Responsive sizing utilities
  size: {
    // Width utilities
    width: {
      small: () => responsive.isMobile() ? '80px' : '200px',
      medium: () => responsive.isMobile() ? '120px' : '300px',
      large: () => responsive.isMobile() ? '200px' : '400px',
      full: () => '100%',
      container: () => responsive.isMobile() ? '90vw' : '600px',
      chart: () => responsive.isMobile() ? '280px' : '300px',
    },

    // Height utilities
    height: {
      small: () => responsive.isMobile() ? '80px' : '200px',
      medium: () => responsive.isMobile() ? '120px' : '300px',
      large: () => responsive.isMobile() ? '200px' : '400px',
      full: () => '100%',
      chart: () => responsive.isMobile() ? '280px' : '300px',
    },

    // Icon sizes
    icon: {
      tiny: () => responsive.isMobile() ? '16px' : '19px',
      small: () => responsive.isMobile() ? '20px' : '25px',
      medium: () => responsive.isMobile() ? '24px' : '30px',
      large: () => responsive.isMobile() ? '32px' : '40px',
    },

    // Spacing utilities
    spacing: {
      xs: () => responsive.isMobile() ? '8px' : '10px',
      sm: () => responsive.isMobile() ? '12px' : '15px',
      md: () => responsive.isMobile() ? '16px' : '20px',
      lg: () => responsive.isMobile() ? '24px' : '30px',
      xl: () => responsive.isMobile() ? '32px' : '40px',
      xxl: () => responsive.isMobile() ? '48px' : '60px',
    },

    // Font sizes
    fontSize: {
      xs: () => responsive.isMobile() ? '10px' : '12px',
      sm: () => responsive.isMobile() ? '12px' : '14px',
      md: () => responsive.isMobile() ? '14px' : '16px',
      lg: () => responsive.isMobile() ? '16px' : '18px',
      xl: () => responsive.isMobile() ? '18px' : '24px',
    },
    
    // Text size function
    text: (size) => {
      if (typeof window === 'undefined') return `${size}px`; // Default to desktop during SSR
      return responsive.isMobile() ? `${size * 0.8}px` : `${size}px`;
    },
  },

  // Positioning utilities
  position: {
    // Absolute positioning with responsive values
    absolute: {
      topRight: () => ({
        position: 'absolute',
        top: responsive.isMobile() ? '20px' : '120px',
        right: responsive.isMobile() ? '20px' : '120px',
      }),
      topLeft: () => ({
        position: 'absolute',
        top: responsive.isMobile() ? '20px' : '120px',
        left: responsive.isMobile() ? '20px' : '120px',
      }),
      bottomRight: () => ({
        position: 'absolute',
        bottom: responsive.isMobile() ? '20px' : '50px',
        right: responsive.isMobile() ? '20px' : '50px',
      }),
      bottomLeft: () => ({
        position: 'absolute',
        bottom: responsive.isMobile() ? '20px' : '50px',
        left: responsive.isMobile() ? '20px' : '50px',
      }),
      center: () => ({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }),
    },

    // Chart positioning
    chart: {
      topRight: () => ({
        position: 'absolute',
        top: responsive.isMobile() ? 'calc(25vh - 100px)' : 'calc(35vh - 125px)',
        right: responsive.isMobile() ? '10px' : 'calc(80vw - 30px)',
      }),
      bottomLeft: () => ({
        position: 'absolute',
        bottom: responsive.isMobile() ? '20px' : '50px',
        left: responsive.isMobile() ? '20px' : '50px',
      }),
    },

    // Simple positioning functions
    top: (value) => {
      if (typeof window === 'undefined') return `${value}px`; // Default to desktop during SSR
      return responsive.isMobile() ? `${value * 0.5}px` : `${value}px`;
    },
    right: (value) => {
      if (typeof window === 'undefined') return `${value}px`; // Default to desktop during SSR
      return responsive.isMobile() ? `${value * 0.5}px` : `${value}px`;
    },
    left: (value) => {
      if (typeof window === 'undefined') return `${value}px`; // Default to desktop during SSR
      return responsive.isMobile() ? `${value * 0.5}px` : `${value}px`;
    },
    bottom: (value) => {
      if (typeof window === 'undefined') return `${value}px`; // Default to desktop during SSR
      return responsive.isMobile() ? `${value * 0.5}px` : `${value}px`;
    },
  },

  // Container styles
  container: {
    modal: () => ({
      padding: responsive.isMobile() ? '20px' : '40px',
      borderRadius: '12px',
      maxWidth: responsive.isMobile() ? '90vw' : '600px',
      width: responsive.isMobile() ? '90vw' : '600px',
    }),
    chart: () => ({
      width: responsive.isMobile() ? '280px' : '300px',
      height: responsive.isMobile() ? '280px' : '300px',
    }),
    mobile: {
      padding: '1rem',
      fontSize: '14px',
      maxWidth: '100%',
    },
    desktop: {
      padding: '4rem',
      fontSize: '16px',
      maxWidth: '1200px',
    },
  },

  // Get responsive value based on screen size
  getValue: (mobile, tablet, desktop) => {
    if (responsive.isMobile()) return mobile;
    if (responsive.isTablet()) return tablet || mobile;
    return desktop || tablet || mobile;
  },
};

// Hook for responsive values (client-side only)
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop,
    responsive,
  };
};

export default responsive; 