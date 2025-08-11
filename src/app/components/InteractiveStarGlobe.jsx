import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const InteractiveStarGlobe = ({ onStarsLoaded, disableControls = false }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const starPointsRef = useRef(null);
  const [showFallback, setShowFallback] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to handle controls enable/disable
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !disableControls;
    }
  }, [disableControls]);

  useEffect(() => {
    if (!mountRef.current) return;
    
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

    // WebGL context event handlers
    const handleContextLost = (event) => {
      console.warn('WebGL context lost:', event);
      event.preventDefault();
      // Mark renderer as lost
      rendererRef.current = null;
      setShowFallback(true);
      if (typeof onStarsLoaded === 'function') {
        onStarsLoaded();
      }
    };
    
    const handleContextRestored = () => {
      console.log('WebGL context restored');
      setShowFallback(false);
      // Reinitialize the entire scene
      if (mountRef.current) {
        // Force re-initialization by calling the effect again
        setTimeout(() => {
          if (mountRef.current && !rendererRef.current) {
            // Re-trigger the effect
            const event = new Event('resize');
            window.dispatchEvent(event);
          }
        }, 100);
      }
    };

    // Renderer setup with error handling
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: false,
        stencil: false,
        depth: false
      });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setClearColor(0x000000, 0); // Transparent background
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      
      // Add WebGL context event listeners
      renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
      renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);
      
    } catch (error) {
      console.warn('WebGL not supported or context creation failed:', error);
      setShowFallback(true);
      if (typeof onStarsLoaded === 'function') {
        onStarsLoaded();
      }
      return; // Exit early if WebGL fails
    }

    // Controls setup - allow rotation but no zoom
    let controls;
    try {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false; // Disable zoom
      controls.enablePan = false; // Disable pan
      controls.enableDamping = true; // Smooth rotation
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.5; // Adjust rotation speed
      controls.enableKeys = false; // Disable keyboard controls
      controlsRef.current = controls;
    } catch (error) {
      console.warn('OrbitControls creation failed:', error);
      controlsRef.current = null;
    }

    // Star configuration
    const starConfig = {
      maxMagnitude: 6.7,
      minMagnitude: -1.5,
      maxStarSize: 16.9,
      minStarSize: 3.0,
      fadeFactor: 2.0
    };

    const radius = 150; // Increased radius to make star map bigger

    // Optimized color conversion function
    function bvToColor(bv, brightness) {
      const rand = Math.random();
      let color;
      if (brightness < 2.0) {
        color = new THREE.Color(0xffffff);
        color.multiplyScalar(1.2);
      } else if (rand < 0.4) {
        color = new THREE.Color(0xffd700);
        color.multiplyScalar(1.1);
      } else if (rand < 0.7) {
        color = new THREE.Color(0x87ceeb);
        color.multiplyScalar(1.15);
      } else {
        color = new THREE.Color(0xf8f8ff);
        color.multiplyScalar(1.1);
      }
      const fadeFactor = Math.max(0.2, 1 - (brightness / starConfig.maxMagnitude));
      color.multiplyScalar(fadeFactor * 0.85 + 0.25);
      return color.getHex();
    }

    // Optimized star data loading with chunked processing
    async function loadStars() {
      try {
        console.log('Starting star data loading...');
        setIsLoading(true);
        setLoadingProgress(0);
        const startTime = performance.now();
        
        const response = await fetch('/stars.csv');
        const text = await response.text();
        
        console.log('CSV loaded, processing data...');
        const lines = text.split('\n');
        const dataLines = lines.slice(1);
        
        // Pre-allocate arrays for better performance
        const stars = [];
        const chunkSize = 1000; // Process in chunks to avoid blocking UI
        
        for (let i = 0; i < dataLines.length; i += chunkSize) {
          const chunk = dataLines.slice(i, i + chunkSize);
          
          // Process chunk
          for (let j = 0; j < chunk.length; j++) {
            const row = chunk[j];
            if (!row.trim()) continue;
            
            const values = row.split(',');
            if (values.length < 12) continue;
            
            const Vmag = parseFloat(values[5]);
            const B_V = parseFloat(values[11]);
            const RAdeg = parseFloat(values[8]);
            const DEdeg = parseFloat(values[9]);
            
            // Skip invalid data
            if (isNaN(Vmag) || isNaN(RAdeg) || isNaN(DEdeg)) continue;
            if (Vmag > starConfig.maxMagnitude || Vmag < starConfig.minMagnitude) continue;
            
            // Optimized coordinate calculation
            const raRad = RAdeg * (Math.PI / 180);
            const decRad = DEdeg * (Math.PI / 180);
            const cosDec = Math.cos(decRad);
            
            const x = radius * Math.cos(raRad) * cosDec;
            const y = radius * Math.sin(decRad);
            const z = radius * Math.sin(raRad) * cosDec;
            
            // Optimized size calculation
            const size = Math.max(
              starConfig.minStarSize * (1.1 - Vmag / starConfig.maxMagnitude),
              starConfig.maxStarSize * Math.pow(0.75, Vmag)
            ) * (Vmag > 5.0 ? 0.7 : 1.0);
            
            stars.push({
              id: i + j + 1,
              x, y, z,
              brightness: Vmag,
              color: bvToColor(B_V, Vmag),
              size: size,
            });
          }
          
          // Update progress
          const progress = Math.min(100, ((i + chunkSize) / dataLines.length) * 100);
          setLoadingProgress(progress);
          
          // Yield to main thread to prevent blocking
          if (i % (chunkSize * 5) === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }

        // Add Southern Cross constellation stars - more prominent
        const southernCrossStars = [
          {
            id: 'acrux',
            name: 'Acrux',
            ra: 186.6495,
            dec: -63.0991,
            brightness: 0.77,
            color: 0xffffff,
            size: starConfig.maxStarSize * 1.8 // More prominent
          },
          {
            id: 'mimosa',
            name: 'Mimosa',
            ra: 191.9303,
            dec: -59.6888,
            brightness: 1.25,
            color: 0x87ceeb,
            size: starConfig.maxStarSize * 1.6 // More prominent
          },
          {
            id: 'gacrux',
            name: 'Gacrux',
            ra: 187.7915,
            dec: -57.1138,
            brightness: 1.59,
            color: 0xffd700,
            size: starConfig.maxStarSize * 1.5 // More prominent
          },
          {
            id: 'imai',
            name: 'Imai',
            ra: 183.7863,
            dec: -58.7489,
            brightness: 2.79,
            color: 0xffffff,
            size: starConfig.maxStarSize * 1.4 // More prominent
          }
        ];

        // Convert Southern Cross stars to 3D coordinates
        const southernCross3D = southernCrossStars.map(star => {
          const raRad = star.ra * (Math.PI / 180);
          const decRad = star.dec * (Math.PI / 180);
          const cosDec = Math.cos(decRad);
          
          return {
            id: star.id,
            name: star.name,
            x: radius * Math.cos(raRad) * cosDec,
            y: radius * Math.sin(decRad),
            z: radius * Math.sin(raRad) * cosDec,
            brightness: star.brightness,
            color: star.color,
            size: star.size,
            isConstellation: true,
            constellation: 'southernCross'
          };
        });

        const allStars = [...stars, ...southernCross3D];
        const endTime = performance.now();
        console.log(`Star processing completed in ${(endTime - startTime).toFixed(2)}ms. Total stars: ${allStars.length}`);
        setIsLoading(false);
        
        return allStars;
             } catch (error) {
         console.error('Error loading stars:', error);
         setIsLoading(false);
         return [];
       }
    }

    // Optimized star field creation
    function createStarField(stars) {
      if (!sceneRef.current) {
        console.warn('Scene not available, cannot create star field');
        return;
      }

      console.log('Creating star field with', stars.length, 'stars...');
      const startTime = performance.now();

      // Pre-allocate typed arrays for better performance
      const positions = new Float32Array(stars.length * 3);
      const colors = new Float32Array(stars.length * 3);
      const sizes = new Float32Array(stars.length);
      
      // Batch process all stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const idx = i * 3;
        
        positions[idx] = star.x;
        positions[idx + 1] = star.y;
        positions[idx + 2] = star.z;
        
        // Convert hex color to RGB
        const color = new THREE.Color(star.color);
        colors[idx] = color.r;
        colors[idx + 1] = color.g;
        colors[idx + 2] = color.b;
        
        sizes[i] = star.size;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Optimized shader material
      const material = new THREE.ShaderMaterial({
        uniforms: {
          attenuation: { value: true },
          starMin: { value: starConfig.minStarSize },
          starMax: { value: starConfig.maxStarSize },
          starMinBrightnes: { value: starConfig.maxMagnitude },
          starFadeDactor: { value: starConfig.fadeFactor },
          pointTexture: { 
            value: new THREE.TextureLoader().load("https://threejs.org/examples/textures/sprites/circle.png") 
          }
        },
        vertexShader: `
          uniform float starMin;
          uniform float starMax;
          uniform float starMinBrightnes;
          uniform float starFadeDactor;
          uniform bool attenuation;
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vSize;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            float dist = length(mvPosition.xyz);
            float sizeScale = 1.0;
            if (attenuation) {
              sizeScale = 130.0 / dist;
            }
            float fadeSize = size * (1.0 + starFadeDactor * 0.08);
            gl_PointSize = fadeSize * sizeScale;
            vColor = color;
            vSize = fadeSize;
          }
        `,
        fragmentShader: `
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          varying float vSize;
          void main() {
            vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
            vec4 tex = texture2D(pointTexture, uv);
            float alpha = tex.a;
            alpha *= smoothstep(0.0, 0.45, alpha);
            vec3 finalColor = vColor * (1.0 + (1.0 - alpha) * 0.5);
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      const starPoints = new THREE.Points(geometry, material);
      sceneRef.current.add(starPoints);
      starPointsRef.current = starPoints;

      const endTime = performance.now();
      console.log(`Star field created in ${(endTime - startTime).toFixed(2)}ms`);
    }

    // Animation loop variable
    let animationId;
    
    // Initialize the star map
    async function init() {
      if (!rendererRef.current) {
        console.warn('Renderer not available, skipping star globe initialization');
        setShowFallback(true);
        if (typeof onStarsLoaded === 'function') {
          onStarsLoaded();
        }
        return;
      }

      const stars = await loadStars();
      if (stars.length > 0) {
        createStarField(stars);
        if (typeof onStarsLoaded === 'function') {
          onStarsLoaded();
        }
      } else if (typeof onStarsLoaded === 'function') {
        setShowFallback(true);
        onStarsLoaded();
      }
      
      // Animation loop
      function animate() {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) {
          console.log('Renderer not available, stopping animation');
          return;
        }
        
        if (controlsRef.current) {
          controlsRef.current.update();
        }
        
        try {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        } catch (error) {
          console.warn('Error rendering scene:', error);
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
          setShowFallback(true);
          return;
        }
        
        animationId = requestAnimationFrame(animate);
      }
      animate();
    }
    init();

    // Handle window resizing
    const handleResize = () => {
      if (mountRef.current && cameraRef.current && rendererRef.current) {
        try {
          cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        } catch (error) {
          console.warn('Error during resize:', error);
        }
      }
    };
    window.addEventListener('resize', handleResize);
    
    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Page became visible, checking WebGL context');
        if (!rendererRef.current || showFallback) {
          console.log('Reinitializing WebGL context after visibility change');
          setShowFallback(false);
          setTimeout(() => {
            if (mountRef.current) {
              const event = new Event('resize');
              window.dispatchEvent(event);
            }
          }, 300);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Periodic WebGL context health check
    const healthCheckInterval = setInterval(() => {
      if (rendererRef.current && rendererRef.current.getContext()) {
        const gl = rendererRef.current.getContext();
        if (gl.isContextLost()) {
          console.warn('WebGL context lost detected in health check');
          setShowFallback(true);
          rendererRef.current = null;
        }
      }
    }, 5000);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(healthCheckInterval);
      
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      if (rendererRef.current && rendererRef.current.domElement) {
        try {
          rendererRef.current.domElement.removeEventListener('webglcontextlost', handleContextLost);
          rendererRef.current.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
        } catch (error) {
          console.warn('Error removing WebGL event listeners:', error);
        }
      }
      
      if (mountRef.current && rendererRef.current && rendererRef.current.domElement) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement);
        } catch (error) {
          console.warn('Error removing renderer element:', error);
        }
      }
      
      if (rendererRef.current) {
        try {
          rendererRef.current.dispose();
          rendererRef.current = null;
        } catch (error) {
          console.warn('Error disposing renderer:', error);
        }
      }
      
      if (controlsRef.current) {
        try {
          controlsRef.current.dispose();
          controlsRef.current = null;
        } catch (error) {
          console.warn('Error disposing controls:', error);
        }
      }
      
      sceneRef.current = null;
      cameraRef.current = null;
      starPointsRef.current = null;
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'absolute',
                      top: 0,
              left: 0,
              zIndex: 2,
              cursor: disableControls ? 'default' : 'grab',
        overflow: 'hidden',
                        backgroundColor: showFallback ? '#000' : 'transparent',
                pointerEvents: disableControls ? 'none' : 'auto',
                clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 70%)',
              }} 
    >
             {isLoading && (
         <div style={{
           position: 'absolute',
           top: '50%',
           left: '50%',
           transform: 'translate(-50%, -50%)',
           color: 'white',
           fontSize: '16px',
           zIndex: 10,
           backgroundColor: 'rgba(0,0,0,0.7)',
           padding: '10px 20px',
           borderRadius: '5px'
         }}>
           {loadingProgress > 0 ? `Loading stars: ${Math.round(loadingProgress)}%` : 'Loading stars...'}
         </div>
       )}
    </div>
  );
};

export default InteractiveStarGlobe; 