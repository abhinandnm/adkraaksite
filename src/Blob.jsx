import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function Blob({ clickCoord }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;

    // Slow rotation
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;

    // Calculate overall scroll percentage of the window
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollRatio = docHeight > 0 ? window.scrollY / docHeight : 0;

    // Default target properties
    let scrollTargetX = 1.5;
    let scrollTargetY = 0;
    let targetScale = 1.6;
    let targetDistort = 0.35;
    let targetColor = new THREE.Color("#2BB381"); // mint green

    // Define positions/properties based on scroll depth
    if (scrollRatio < 0.22) {
      // Hero section: center-right
      scrollTargetX = 1.6 + (state.pointer.x * 0.4);
      scrollTargetY = 0.1 + (state.pointer.y * 0.4);
      targetScale = 1.8;
      targetDistort = 0.35;
      targetColor.set("#2BB381");
    } else if (scrollRatio < 0.58) {
      // Products section: shift to left
      scrollTargetX = -1.6 + (state.pointer.x * 0.4);
      scrollTargetY = -0.3 + (state.pointer.y * 0.4);
      targetScale = 1.4;
      targetDistort = 0.5;
      targetColor.set("#eae6df"); // warm cream color shift
    } else if (scrollRatio < 0.82) {
      // Founders section: small, centered at top
      scrollTargetX = 0 + (state.pointer.x * 0.4);
      scrollTargetY = 1.0 + (state.pointer.y * 0.4);
      targetScale = 1.1;
      targetDistort = 0.3;
      targetColor.set("#0d4631"); // dark green accent
    } else {
      // Contact section: large, bottom-right
      scrollTargetX = 1.7 + (state.pointer.x * 0.4);
      scrollTargetY = -0.8 + (state.pointer.y * 0.4);
      targetScale = 2.1;
      targetDistort = 0.4;
      targetColor.set("#2BB381");
    }

    // INTERACTION: If a recent click occurred, pull the blob to the click position!
    if (clickCoord) {
      const elapsed = (Date.now() - clickCoord.time) / 1000; // elapsed time in seconds
      if (elapsed < 2.5) {
        // Translate normalized screen coordinates (-1 to 1) into 3D viewport coordinates
        const clickX = clickCoord.x * (state.viewport.width / 2);
        const clickY = clickCoord.y * (state.viewport.height / 2);

        // Calculate a weight factor (starts at 1.0, decays to 0.0 at 2.5s)
        const weight = Math.pow(1 - elapsed / 2.5, 2);

        // Blend the target coordinates
        scrollTargetX = THREE.MathUtils.lerp(scrollTargetX, clickX, weight);
        scrollTargetY = THREE.MathUtils.lerp(scrollTargetY, clickY, weight);

        // Increase scale (pulse) and warp distortion (wobble) based on click impact
        targetScale = targetScale * (1 + 0.35 * weight);
        targetDistort = THREE.MathUtils.lerp(targetDistort, 0.75, weight);
        
        // Temporarily shift color to highlight the action
        const flashColor = new THREE.Color("#44F1A6");
        targetColor.lerp(flashColor, weight);
      }
    }

    // Smoothly interpolate (lerp) current properties to targets
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, scrollTargetX, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, scrollTargetY, 0.05);

    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.05);
    meshRef.current.scale.set(s, s, s);

    if (meshRef.current.material) {
      meshRef.current.material.color.lerp(targetColor, 0.05);
      meshRef.current.material.distort = THREE.MathUtils.lerp(meshRef.current.material.distort, targetDistort, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} position={[1.5, 0, 0]} scale={[1.8, 1.8, 1.8]}>
      <sphereGeometry args={[1, 64, 64]} />
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
