import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface ModelViewer3DProps {
  modelType: string;
  color?: string;
}

function RotatingModel({ modelType, color = '#0EA5E9' }: ModelViewer3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame(() => {
    const target = meshRef.current || groupRef.current;
    if (target && !isHovered) {
      target.rotation.y += 0.01;
    }
  });

  const getGeometry = () => {
    switch (modelType) {
      case 'gear':
        return <torusGeometry args={[1, 0.3, 16, 32]} />;
      case 'vase':
        return <cylinderGeometry args={[0.5, 0.8, 2, 32]} />;
      case 'robot':
        return (
          <group>
            <boxGeometry args={[1, 1.5, 0.5]} />
          </group>
        );
      case 'phone-stand':
        return <boxGeometry args={[1.2, 0.8, 0.3]} />;
      case 'house':
        return (
          <group>
            <mesh position={[0, -0.5, 0]}>
              <boxGeometry args={[1.5, 1, 1.5]} />
              <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[1.2, 1, 4]} />
              <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
            </mesh>
          </group>
        );
      case 'dragon':
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.6, 32, 32]} />
              <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh position={[0.5, 0.3, 0]}>
              <coneGeometry args={[0.3, 0.8, 8]} />
              <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
            </mesh>
          </group>
        );
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  if (modelType === 'house' || modelType === 'dragon') {
    return (
      <group
        ref={groupRef}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        scale={isHovered ? 1.1 : 1}
      >
        {getGeometry()}
      </group>
    );
  }

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      scale={isHovered ? 1.1 : 1}
    >
      {getGeometry()}
      <meshStandardMaterial 
        color={color} 
        metalness={0.4} 
        roughness={0.3}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function Scene({ modelType, color }: ModelViewer3DProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls 
        enableZoom={true} 
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        autoRotate={false}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#0EA5E9" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#8B5CF6" />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#fff" />
      
      <RotatingModel modelType={modelType} color={color} />
      
      <gridHelper args={[10, 10, '#0EA5E9', '#1A1F2C']} position={[0, -2, 0]} />
    </>
  );
}

export default function ModelViewer3D({ modelType, color }: ModelViewer3DProps) {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden glass-effect">
      <Canvas>
        <Suspense fallback={null}>
          <Scene modelType={modelType} color={color} />
        </Suspense>
      </Canvas>
    </div>
  );
}