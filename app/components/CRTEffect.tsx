'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useViewMode } from '../contexts/view-mode-context';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Pseudo-random noise
  float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;

    // --- Barrel distortion (subtle CRT screen curvature) ---
    vec2 centered = uv - 0.5;
    float dist = dot(centered, centered);
    uv = uv + centered * dist * 0.06;

    // If UV goes out of bounds after distortion, darken fully
    float outsideMask = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);

    // --- Scanlines ---
    float scanlineFreq = uResolution.y * 0.5;
    float scanline = sin(uv.y * scanlineFreq + uTime * 0.5) * 0.5 + 0.5;
    // Map to a subtle darkening: mostly transparent, slight darkening on scan lines
    float scanlineAlpha = (1.0 - scanline) * 0.06;

    // --- Vignette (darkened edges) ---
    vec2 vigUv = uv * (1.0 - uv.yx);
    float vignette = vigUv.x * vigUv.y * 20.0;
    vignette = clamp(pow(vignette, 0.4), 0.0, 1.0);
    float vignetteAlpha = (1.0 - vignette) * 0.25;

    // --- Noise / static ---
    float noise = random(uv + fract(uTime * 0.3)) * 0.025;

    // --- Subtle flicker ---
    float flicker = 1.0 + sin(uTime * 12.0) * 0.003 + sin(uTime * 3.7) * 0.002;

    // --- Phosphor RGB separation (very subtle chromatic aberration) ---
    // This gives a slight color fringe at the edges, like a real CRT
    float aberrationAmount = dist * 0.003;

    // Combine all effects into alpha
    float alpha = (scanlineAlpha + vignetteAlpha + noise) * flicker;
    alpha *= outsideMask;

    // Slight warm tint to match the beige/amber terminal aesthetic
    // The overlay is mostly transparent black with very slight warm color at edges
    vec3 color = mix(
      vec3(0.0, 0.0, 0.0),
      vec3(0.15, 0.05, 0.0),
      vignetteAlpha * 0.5
    );

    // Chromatic aberration: add subtle red/blue fringe at edges
    float redShift = random(uv + vec2(aberrationAmount, 0.0) + fract(uTime * 0.1)) * aberrationAmount * 2.0;
    float blueShift = random(uv - vec2(aberrationAmount, 0.0) + fract(uTime * 0.1)) * aberrationAmount * 2.0;
    color.r += redShift;
    color.b += blueShift;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function CRTEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { viewMode } = useViewMode();
  const animationRef = useRef<number>(0);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (viewMode !== 'terminal') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Skip on mobile (screen width < 768px) - CRT effects feel wrong on phones
    if (window.innerWidth < 768) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    const animate = () => {
      if (prefersReducedMotion) {
        // Render once with static effects (no animation)
        uniforms.uTime.value = 0;
        renderer.render(scene, camera);
        return;
      }

      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      // Disable on mobile if resized down
      if (window.innerWidth < 768) {
        renderer.setSize(0, 0);
        return;
      }
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [viewMode]);

  if (viewMode !== 'terminal') return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      aria-hidden="true"
    />
  );
}
