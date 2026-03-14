"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sphere, Torus, RoundedBox } from "@react-three/drei"
import { useRef, useMemo } from "react"
import * as THREE from "three"

function GoldCoin({ position, scale = 1, rotationSpeed = 0.5 }: { position: [number, number, number], scale?: number, rotationSpeed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01 * rotationSpeed
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial 
          color="#D4A843" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#D4A843"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  )
}

function GlowingSphere({ position, color = "#D4A843", scale = 0.3 }: { position: [number, number, number], color?: string, scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale + Math.sin(state.clock.elapsedTime * 2) * 0.05)
    }
  })

  return (
    <Float speed={3} rotationIntensity={0.2} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 32, 32]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </Sphere>
    </Float>
  )
}

function FloatingRing({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.5
      meshRef.current.rotation.z += 0.005
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <Torus ref={meshRef} args={[0.6, 0.15, 16, 32]} position={position} scale={scale}>
        <meshStandardMaterial 
          color="#D4A843" 
          metalness={0.95} 
          roughness={0.05}
          emissive="#D4A843"
          emissiveIntensity={0.15}
        />
      </Torus>
    </Float>
  )
}

function FloatingCard({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.3
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <RoundedBox ref={meshRef} args={[1, 0.6, 0.05]} radius={0.05} position={position} scale={scale}>
        <meshStandardMaterial 
          color="#ffffff" 
          metalness={0.1} 
          roughness={0.8}
          transparent
          opacity={0.15}
        />
      </RoundedBox>
    </Float>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#D4A843" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#F0C96A" />
        
        {/* Floating coins */}
        <GoldCoin position={[-3.5, 2, -2]} scale={0.8} rotationSpeed={0.7} />
        <GoldCoin position={[4, 1.5, -3]} scale={0.6} rotationSpeed={0.5} />
        <GoldCoin position={[-4, -1.5, -1]} scale={0.5} rotationSpeed={0.9} />
        <GoldCoin position={[3.5, -2, -2]} scale={0.7} rotationSpeed={0.6} />
        
        {/* Glowing spheres */}
        <GlowingSphere position={[-2.5, 0.5, -1]} scale={0.25} />
        <GlowingSphere position={[3, 0, -2]} scale={0.2} color="#F0C96A" />
        <GlowingSphere position={[0, 2.5, -3]} scale={0.15} />
        
        {/* Floating rings (representing circles) */}
        <FloatingRing position={[-3, -0.5, -2]} scale={0.6} />
        <FloatingRing position={[4, 2.5, -4]} scale={0.5} />
        
        {/* Floating cards */}
        <FloatingCard position={[-4.5, 1, -3]} scale={0.8} />
        <FloatingCard position={[4.5, -1, -2.5]} scale={0.6} />
      </Canvas>
    </div>
  )
}

export function FeaturesScene() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#D4A843" />
        
        {/* Scattered coins */}
        <GoldCoin position={[-6, 3, -5]} scale={0.5} rotationSpeed={0.4} />
        <GoldCoin position={[6, -2, -4]} scale={0.4} rotationSpeed={0.6} />
        <GoldCoin position={[-5, -3, -3]} scale={0.35} rotationSpeed={0.5} />
        <GoldCoin position={[5, 4, -6]} scale={0.45} rotationSpeed={0.7} />
        
        {/* Rings */}
        <FloatingRing position={[0, 4, -5]} scale={0.4} />
        <FloatingRing position={[-6, -1, -4]} scale={0.35} />
        <FloatingRing position={[6, 1, -5]} scale={0.3} />
      </Canvas>
    </div>
  )
}
