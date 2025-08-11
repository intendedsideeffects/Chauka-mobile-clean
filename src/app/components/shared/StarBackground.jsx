import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Global WebGL context manager to prevent multiple contexts
class WebGLContextManager {
  constructor() {
    this.activeContexts = new Map();
    this.maxContexts = 2; // Limit to 2 contexts max
  }

  canCreateContext(id) {
    return this.activeContexts.size < this.maxContexts;
  }

  registerContext(id, renderer) {
    if (this.activeContexts.size >= this.maxContexts) {
      // Dispose oldest context
      const oldestId = this.activeContexts.keys().next().value;
      const oldestRenderer = this.activeContexts.get(oldestId);
      if (oldestRenderer) {
        oldestRenderer.dispose();
      }
      this.activeContexts.delete(oldestId);
    }
    this.activeContexts.set(id, renderer);
  }

  unregisterContext(id) {
    this.activeContexts.delete(id);
  }

  disposeAll() {
    this.activeContexts.forEach(renderer => {
      if (renderer) {
        renderer.dispose();
      }
    });
    this.activeContexts.clear();
  }
}

// Global instance
const webGLManager = new WebGLContextManager();

const StarBackground = ({ 
  variant = 'landing', // 'landing' | 'section7'
  platform = 'browser', // 'mobile' | 'browser'
  onStarsLoaded,
  disableControls = false 
}) => {
  console.log('StarBackground rendered with props:', { variant, platform, disableControls });
  
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const starPointsRef = useRef(null);
  const [showFallback, setShowFallback] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate unique ID for this instance
  const instanceId = useRef(`${variant}-${platform}-${Math.random().toString(36).substr(2, 9)}`);

  // Determine configuration based on variant and platform
  const isLanding = variant === 'landing';
  const isSection7 = variant === 'section7';
  const isMobile = platform === 'mobile';
  const isBrowser = platform === 'browser';

  // Configuration based on variant and platform
  const config = {
    background: isLanding ? '#000000' : '#ffffff',
    starColors: isLanding ? {
      brightest: 0xffffff,
      bright: 0xe6f0ff,
      normal: 0x87ceeb,
      warm: 0xffd700
    } : {
      brightest: 0x000000,
      bright: 0x333333,
      normal: 0x666666,
      warm: 0x444444
    },
    interactive: isLanding || (isSection7 && isBrowser),
    rotationSpeed: isLanding ? 0.5 : 0.3,
    starSize: isLanding ? { min: 3.0, max: 16.9 } : { min: 2.0, max: 12.0 }
  };

  // Effect to handle controls enable/disable
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !disableControls && config.interactive;
    }
  }, [disableControls, config.interactive]);

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Ensure cleanup when component unmounts
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      webGLManager.unregisterContext(instanceId.current);
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Prevent multiple initializations
    if (rendererRef.current) {
      console.log('Renderer already exists, skipping initialization');
      return;
    }
    
    // Clean up any existing renderer first
    if (rendererRef.current) {
      try {
        rendererRef.current.dispose();
        rendererRef.current = null;
      } catch (error) {
        console.warn('Error disposing existing renderer:', error);
      }
    }

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup - positioned at center of sphere
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 2000);
    camera.position.set(0, 0, 1); // Camera slightly away from center for OrbitControls
    cameraRef.current = camera;

    // WebGL context event handlers (only for landing page)
    const handleContextLost = (event) => {
      if (!isLanding) return;
      console.warn('WebGL context lost:', event);
      event.preventDefault();
      
      // Don't immediately show fallback, try to restore first
      if (rendererRef.current) {
        rendererRef.current = null;
      }
      
      // Only show fallback if we can't restore
      setTimeout(() => {
        if (!rendererRef.current) {
          setShowFallback(true);
          if (typeof onStarsLoaded === 'function') {
            onStarsLoaded();
          }
        }
      }, 1000);
    };
    
    const handleContextRestored = () => {
      if (!isLanding) return;
      console.log('WebGL context restored');
      setShowFallback(false);
      
      // Reinitialize the renderer
      if (mountRef.current && !rendererRef.current) {
        setTimeout(() => {
          if (mountRef.current && !rendererRef.current) {
            const event = new Event('resize');
            window.dispatchEvent(event);
          }
        }, 100);
      }
    };

    // Renderer setup with error handling
    let renderer;
    try {
      // Check if we can create a new WebGL context
      if (!webGLManager.canCreateContext(instanceId.current)) {
        console.warn('Too many WebGL contexts, disposing oldest and creating new one');
        // The manager will automatically dispose the oldest context
      }
      
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: false,
        stencil: false,
        depth: false
      });
      
      // Register this context with the manager
      webGLManager.registerContext(instanceId.current, renderer);
      
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setClearColor(0x000000, 0); // Transparent background
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      
      // Add WebGL context event listeners only for landing page
      if (isLanding) {
        renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
        renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);
      }
      
    } catch (error) {
      console.warn('WebGL not supported or context creation failed:', error);
      setShowFallback(true);
      if (typeof onStarsLoaded === 'function') {
        onStarsLoaded();
      }
      return;
    }

    // Controls setup - only if interactive
    if (config.interactive) {
      try {
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false; // Disable zoom
        controls.enablePan = false; // Disable pan
        controls.enableDamping = true; // Smooth rotation
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = config.rotationSpeed;
        controls.enableKeys = false; // Disable keyboard controls
        
        // Disable rotation for mobile devices in section 7
        if (isSection7 && isMobile) {
          controls.enableRotate = false;
        }
        
        controlsRef.current = controls;
      } catch (error) {
        console.warn('OrbitControls creation failed:', error);
        controlsRef.current = null;
      }
    }

    // Star configuration
    const starConfig = {
      maxMagnitude: 6.7,
      minMagnitude: -1.5,
      maxStarSize: config.starSize.max,
      minStarSize: config.starSize.min,
      baseStarSize: 4.5,
      brightestThreshold: 4.5,
      brightThreshold: 2.5,
      brightestStarColor: config.starColors.brightest,
      brightStarColor: config.starColors.bright,
      fadeFactor: 2.0
    };

    const radius = 150; // Increased radius to make star map bigger

    // Optimized color conversion function
    function bvToColor(bv, brightness) {
      const rand = Math.random();
      let color;
      
      if (brightness < 2.0) {
        color = new THREE.Color(config.starColors.brightest);
        color.multiplyScalar(1.2);
      } else if (rand < 0.4) {
        color = new THREE.Color(config.starColors.warm);
        color.multiplyScalar(1.1);
      } else if (rand < 0.7) {
        color = new THREE.Color(config.starColors.normal);
        color.multiplyScalar(1.15);
      } else {
        color = new THREE.Color(config.starColors.bright);
        color.multiplyScalar(1.1);
      }
      
      const fadeFactor = Math.max(0.2, 1 - (brightness / starConfig.maxMagnitude));
      color.multiplyScalar(fadeFactor * 0.85 + 0.25);
      
      return color.getHex();
    }

    // Function to load star data
    async function loadStars() {
      try {
        console.log('Attempting to load stars from /stars.csv');
        const response = await fetch('/stars.csv');
        console.log('Fetch response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('CSV text loaded, length:', text.length);
        console.log('First 200 characters:', text.substring(0, 200));
        
        const rows = text.split('\n').slice(1);
        console.log('Number of rows (excluding header):', rows.length);
        
        const stars = rows
          .map((row, index) => {
            const [, , , , , Vmag, , , RAdeg, DEdeg, , B_V] = row.split(',');
            const brightness = parseFloat(Vmag);
            const ra = parseFloat(RAdeg);
            const dec = parseFloat(DEdeg);
            const bv = parseFloat(B_V);

            if (isNaN(brightness) || isNaN(ra) || isNaN(dec) || isNaN(bv)) {
              return null;
            }

            return {
              index,
              brightness,
              ra,
              dec,
              bv,
              color: bvToColor(bv, brightness)
            };
          })
          .filter(star => star !== null)
          .sort((a, b) => a.brightness - b.brightness); // Sort by brightness

        console.log('Stars processed successfully:', stars.length);
        return stars;
      } catch (error) {
        console.error('Error loading stars:', error);
        return [];
      }
    }

    // Function to create star field
    function createStarField(stars) {
      if (starPointsRef.current) {
        scene.remove(starPointsRef.current);
        starPointsRef.current.geometry.dispose();
        starPointsRef.current.material.dispose();
      }

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(stars.length * 3);
      const colors = new Float32Array(stars.length * 3);
      const sizes = new Float32Array(stars.length);

      stars.forEach((star, index) => {
        // Convert RA/Dec to 3D position on sphere
        const phi = (90 - star.dec) * (Math.PI / 180);
        const theta = (star.ra + 90) * (Math.PI / 180);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        positions[index * 3] = x;
        positions[index * 3 + 1] = y;
        positions[index * 3 + 2] = z;

        // Convert hex color to RGB
        const color = new THREE.Color(star.color);
        colors[index * 3] = color.r;
        colors[index * 3 + 1] = color.g;
        colors[index * 3 + 2] = color.b;

        // Calculate star size based on brightness
        const normalizedBrightness = (star.brightness - starConfig.minMagnitude) / (starConfig.maxMagnitude - starConfig.minMagnitude);
        const size = starConfig.minStarSize + (starConfig.maxStarSize - starConfig.minStarSize) * (1 - normalizedBrightness);
        sizes[index] = size;
      });

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        alphaTest: 0.1,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const starPoints = new THREE.Points(geometry, material);
      scene.add(starPoints);
      starPointsRef.current = starPoints;

      // Call onStarsLoaded callback if provided
      if (typeof onStarsLoaded === 'function') {
        onStarsLoaded();
      }
    }

    // Initialize function
    async function init() {
      try {
        console.log('Initializing star field...');
        const stars = await loadStars();
        console.log('Stars loaded:', stars.length);
        
        if (stars.length > 0) {
          console.log('Creating star field with', stars.length, 'stars');
          createStarField(stars);
          setIsLoading(false);
        } else {
          console.warn('No stars loaded - showing fallback');
          setShowFallback(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing star field:', error);
        setShowFallback(true);
        setIsLoading(false);
      }
    }

    // Animation loop
    function animate() {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

      requestAnimationFrame(animate);

      // Update controls if they exist
      if (controlsRef.current && config.interactive) {
        controlsRef.current.update();
      }

      // Render the scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    // Start animation
    animate();

    // Initialize
    init();

    // Event listeners
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause animation when tab is not visible
        if (rendererRef.current) {
          rendererRef.current.setAnimationLoop(null);
        }
      } else {
        // Resume animation when tab becomes visible
        if (rendererRef.current) {
          rendererRef.current.setAnimationLoop(animate);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      
      if (starPointsRef.current) {
        starPointsRef.current.geometry.dispose();
        starPointsRef.current.material.dispose();
        starPointsRef.current = null;
      }
      
      // Safely remove the canvas element
      if (mountRef.current && rendererRef.current && rendererRef.current.domElement) {
        try {
          if (mountRef.current.contains(rendererRef.current.domElement)) {
            mountRef.current.removeChild(rendererRef.current.domElement);
          }
        } catch (error) {
          console.warn('Error removing canvas element during cleanup:', error);
        }
      }
      
      // Unregister this context from the manager
      webGLManager.unregisterContext(instanceId.current);
    };
  }, [variant, platform, disableControls, onStarsLoaded, config]);

  // Fallback for WebGL not supported
  if (showFallback) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: config.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isLanding ? '#ffffff' : '#000000'
      }}>
        <div>Stars not available</div>
      </div>
    );
  }

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        backgroundColor: config.background,
        position: 'relative'
      }}
    >
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: isLanding ? '#ffffff' : '#000000',
          zIndex: 10
        }}>
          Loading stars...
        </div>
      )}
    </div>
  );
};

export default StarBackground;
