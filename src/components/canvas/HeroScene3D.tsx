"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function FloatingLiquidMesh() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
      meshRef.current.rotation.y = t * 0.35;
      meshRef.current.rotation.z = Math.cos(t * 0.2) * 0.15;
    }
    if (materialRef.current) {
      // Subtle pulse in distortion for a fluid molten look
      materialRef.current.distort = 0.45 + Math.sin(t * 0.8) * 0.12;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.2}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]} scale={1.2}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#0d0f17"
          roughness={0.12}
          metalness={0.95}
          distort={0.48}
          speed={2.2}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>
    </Float>
  );
}

export default function HeroScene3D() {
  return (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#60a5fa" />
        <directionalLight position={[-10, -10, -5]} intensity={2} color="#a855f7" />
        <pointLight position={[0, 4, 2]} intensity={2.2} color="#38bdf8" />
        
        <FloatingLiquidMesh />

        <ContactShadows
          position={[0, -2.2, 0]}
          opacity={0.4}
          scale={10}
          blur={2.5}
          far={4}
        />
      </Canvas>
    </div>
  );
}
