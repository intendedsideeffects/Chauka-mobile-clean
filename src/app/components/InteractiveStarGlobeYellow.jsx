import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const InteractiveStarGlobeYellow = ({ onStarsLoaded }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const starPointsRef = useRef(null);


  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup - positioned at center of sphere
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 2000);
    camera.position.set(0, 0, 1); // Camera slightly away from center for OrbitControls
    cameraRef.current = camera;

    // Renderer setup with error handling
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false
      });
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setClearColor(0x000000, 0); // Transparent background
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (error) {
      console.warn('WebGL not supported or context creation failed:', error);
      // Create a fallback div instead
      const fallbackDiv = document.createElement('div');
      fallbackDiv.style.width = '100%';
      fallbackDiv.style.height = '100%';
      fallbackDiv.style.backgroundColor = 'transparent';
      mountRef.current.appendChild(fallbackDiv);
      // Call onStarsLoaded to prevent infinite loading
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
      
      // Disable rotation for mobile devices
      if (window.innerWidth <= 768) { // Mobile breakpoint
        controls.enableRotate = false; // Disable rotation on mobile
      }
      
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
        const startTime = performance.now();
        
        const response = await fetch('/stars.csv');
        if (!response.ok) {
          throw new Error(`Failed to fetch stars.csv: ${response.status}`);
        }
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
        
        return allStars;
      } catch (error) {
        console.error('Error loading stars:', error);
        return [];
      }
    }

    // Optimized star field creation
    function createStarField(stars) {
      // Double-check that scene and renderer are available
      if (!sceneRef.current || !rendererRef.current) {
        console.warn('Scene or renderer not available, cannot create star field');
        return false;
      }

      try {
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
        return true;
      } catch (error) {
        console.error('Error creating star field:', error);
        return false;
      }
    }

    // Initialize the star map
    async function init() {
      try {
        // Check if renderer was successfully created
        if (!rendererRef.current) {
          console.warn('Renderer not available, skipping star globe initialization');
          if (typeof onStarsLoaded === 'function') {
            onStarsLoaded();
          }
          return;
        }

        const stars = await loadStars();
        if (stars.length > 0) {
          const success = createStarField(stars);
          if (success) {
            if (typeof onStarsLoaded === 'function') {
              onStarsLoaded();
            }
          } else {
            console.warn('Failed to create star field, but calling onStarsLoaded to prevent infinite loading');
            if (typeof onStarsLoaded === 'function') {
              onStarsLoaded();
            }
          }
        } else {
          console.warn('No stars loaded, calling onStarsLoaded to prevent infinite loading');
          if (typeof onStarsLoaded === 'function') {
            onStarsLoaded();
          }
        }
        
        // Animation loop
        function animate() {
          if (controlsRef.current) {
            controlsRef.current.update();
          }
          if (rendererRef.current && sceneRef.current && cameraRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current);
          }
          requestAnimationFrame(animate);
        }
        animate();
      } catch (error) {
        console.error('Error during star globe initialization:', error);
        // Always call onStarsLoaded to prevent infinite loading
        if (typeof onStarsLoaded === 'function') {
          onStarsLoaded();
        }
      }
    }
    
    // Start initialization
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
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
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
        } catch (error) {
          console.warn('Error disposing renderer:', error);
        }
      }
      if (controlsRef.current) {
        try {
          controlsRef.current.dispose();
        } catch (error) {
          console.warn('Error disposing controls:', error);
        }
      }
    };
  }, [onStarsLoaded]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100vw', 
        height: '100%', // Changed from '100vh' to '100%' to cover full section height
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        cursor: 'default', // Changed from 'grab' to 'default' to remove grab cursor
        overflow: 'hidden',
        pointerEvents: 'none', // Changed from 'auto' to 'none' to disable interactivity
        touchAction: 'none',
      }} 
    >
      
    </div>
  );
};

export default InteractiveStarGlobeYellow; 