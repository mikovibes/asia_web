"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function InteractiveLogo() {
  const groupRef = useRef<THREE.Group>(null);

  // Load the AI-generated 3D model
  const { scene } = useGLTF('/logo_3d.glb');
  
  // Clone the scene and adjust materials if needed
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Optional: center the model using Box3 if it's not centered
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // The TRELLIS model might be huge or tiny, let's normalize scale
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = 15 / maxDim; // Target width ~15 units to fit viewport like before
    
    clone.position.sub(center).multiplyScalar(scaleFactor);
    clone.scale.setScalar(scaleFactor);

    // Ensure materials are double sided and catch light nicely
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          child.material.side = THREE.DoubleSide;
          child.material.needsUpdate = true;
          // You can also tweak roughness/metalness here if the AI textures need adjustment
        }
      }
    });
    
    return clone;
  }, [scene]);

  useFrame((state) => {
    if (groupRef.current) {
      // Stronger tilt so 3D depth is clearly visible
      const targetRotX = (state.pointer.y * Math.PI) / 8;
      const targetRotY = (state.pointer.x * Math.PI) / 8;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, targetRotX, 0.07
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, targetRotY, 0.07
      );
    }
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 8, 8]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, 4, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[0, -2, -6]} intensity={0.4} color="#ffffff" />

      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.8}>
        <group ref={groupRef} position={[0, 0, 0]}>
          <primitive object={clonedScene} />
        </group>
      </Float>

      <ContactShadows
        position={[0, -4.0, 0]}
        opacity={0.5}
        scale={35}
        blur={2.5}
        far={14}
        resolution={512}
        color="#1a1a2e"
      />
    </>
  );
}

// Preload the model so it doesn't pop in
useGLTF.preload('/logo_3d.glb');
