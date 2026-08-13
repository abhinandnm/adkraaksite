import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Cache scroll ratio via passive listener — avoids DOM reads every frame
const scrollCache = { ratio: 0 };

function updateScroll() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollCache.ratio = docHeight > 0 ? window.scrollY / docHeight : 0;
}

// Attach once at module load
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
}

export default function Blob({ clickCoord, selectedProduct }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();

    // Slow rotation — cheap, GPU-only
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.y = t * 0.10;

    const scrollRatio = scrollCache.ratio;

    let targetX = 1.5;
    let targetY = 0;
    let targetScale = 1.6;
    let targetDistort = 0.35;
    let targetColor = new THREE.Color("#2BB381");

    if (scrollRatio < 0.22) {
      targetX = 1.6 + (state.pointer.x * 0.3);
      targetY = 0.1 + (state.pointer.y * 0.3);
      targetScale = 1.8;
      targetDistort = 0.35;
      targetColor.set("#2BB381");
    } else if (scrollRatio < 0.64) {
      targetX = 1.6 + (state.pointer.x * 0.3);
      targetY = -0.3 + (state.pointer.y * 0.3);
      targetScale = 1.6;
      targetDistort = 0.38;
      targetColor.set("#2BB381");
    } else if (scrollRatio < 0.82) {
      targetX = 0;
      targetY = 1.2;
      targetScale = 1.1;
      targetDistort = 0.3;
      targetColor.set("#0d4631");
    } else {
      targetX = 1.7 + (state.pointer.x * 0.3);
      targetY = -0.8 + (state.pointer.y * 0.3);
      targetScale = 2.1;
      targetDistort = 0.4;
      targetColor.set("#2BB381");
    }

    // Click-drift override
    if (clickCoord) {
      const elapsed = (Date.now() - clickCoord.time) / 1000;
      if (elapsed < 2.5) {
        const clickX = clickCoord.x * (state.viewport.width / 2);
        const clickY = clickCoord.y * (state.viewport.height / 2);
        const weight = Math.pow(1 - elapsed / 2.5, 2);
        targetX = THREE.MathUtils.lerp(targetX, clickX, weight);
        targetY = THREE.MathUtils.lerp(targetY, clickY, weight);
        targetScale = targetScale * (1 + 0.35 * weight);
        targetDistort = THREE.MathUtils.lerp(targetDistort, 0.75, weight);
        targetColor.lerp(new THREE.Color("#44F1A6"), weight);
      }
    }

    // Lerp position/scale
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 0, 0.05);

    // Deflate slowly, inflate quickly
    const currentScale = meshRef.current.scale.x;
    const scaleLerp = currentScale > targetScale ? 0.012 : 0.05;
    const s = THREE.MathUtils.lerp(currentScale, targetScale, scaleLerp);
    meshRef.current.scale.set(s, s, s);

    if (meshRef.current.material) {
      meshRef.current.material.color.lerp(targetColor, 0.05);
      meshRef.current.material.distort = THREE.MathUtils.lerp(
        meshRef.current.material.distort, targetDistort, 0.05
      );
    }
  });

  return (
    <mesh ref={meshRef} position={[1.5, 0, 0]} scale={[1.8, 1.8, 1.8]}>
      <sphereGeometry args={[1, 48, 48]} />
      <MeshDistortMaterial
        color="#2BB381"
        attach="material"
        distort={0.35}
        speed={1.8}
        roughness={0.1}
        metalness={0.15}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}
