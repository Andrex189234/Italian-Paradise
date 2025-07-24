import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Ground component
function Ground() {
  return (
    <mesh receiveShadow position={[0, -0.5, 0]}>
      <boxGeometry args={[100, 1, 100]} />
      <meshLambertMaterial color="#4a5d3a" />
    </mesh>
  );
}

// Roads component
function Roads() {
  return (
    <>
      {/* Main horizontal road */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[100, 0.1, 4]} />
        <meshLambertMaterial color="#2c2c2c" />
      </mesh>
      {/* Main vertical road */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.1, 100]} />
        <meshLambertMaterial color="#2c2c2c" />
      </mesh>
      {/* Cross roads */}
      <mesh position={[25, 0, 0]}>
        <boxGeometry args={[4, 0.1, 50]} />
        <meshLambertMaterial color="#2c2c2c" />
      </mesh>
      <mesh position={[-25, 0, 0]}>
        <boxGeometry args={[4, 0.1, 50]} />
        <meshLambertMaterial color="#2c2c2c" />
      </mesh>
    </>
  );
}

// Buildings component
function Buildings() {
  const buildings = [
    { position: [15, 2, 15], size: [8, 4, 8], color: '#8B4513' },
    { position: [-15, 3, 15], size: [10, 6, 10], color: '#CD853F' },
    { position: [25, 4, 25], size: [12, 8, 8], color: '#A0522D' },
    { position: [-25, 2.5, -15], size: [8, 5, 12], color: '#DEB887' },
    { position: [35, 3, -5], size: [10, 6, 10], color: '#F4A460' },
    { position: [-10, 2, 20], size: [6, 4, 6], color: '#D2691E' },
  ];

  return (
    <>
      {buildings.map((building, index) => (
        <mesh key={index} position={building.position} castShadow>
          <boxGeometry args={building.size} />
          <meshLambertMaterial color={building.color} />
        </mesh>
      ))}
    </>
  );
}

// Realistic Player component
function Player({ position, inVehicle, onPositionChange }) {
  const groupRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (groupRef.current && !inVehicle) {
      groupRef.current.position.set(position.x, position.y + 1, position.z);
      
      // Camera follows player
      camera.position.set(
        position.x + 10,
        position.y + 8,
        position.z + 10
      );
      camera.lookAt(position.x, position.y + 1, position.z);
    }
  });

  if (inVehicle) return null;

  return (
    <group ref={groupRef} castShadow>
      {/* Head */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.25]} />
        <meshLambertMaterial color="#FDBCB4" />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.28, 8, 6]} />
        <meshLambertMaterial color="#4A4A4A" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.6, 1.2, 0.3]} />
        <meshLambertMaterial color="#FF6B6B" />
      </mesh>
      
      {/* Left Arm */}
      <mesh position={[-0.4, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8]} />
        <meshLambertMaterial color="#FDBCB4" />
      </mesh>
      
      {/* Right Arm */}
      <mesh position={[0.4, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8]} />
        <meshLambertMaterial color="#FDBCB4" />
      </mesh>
      
      {/* Left Leg */}
      <mesh position={[-0.15, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.8]} />
        <meshLambertMaterial color="#4169E1" />
      </mesh>
      
      {/* Right Leg */}
      <mesh position={[0.15, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.8]} />
        <meshLambertMaterial color="#4169E1" />
      </mesh>
      
      {/* Left Shoe */}
      <mesh position={[-0.15, -0.65, 0.1]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.3]} />
        <meshLambertMaterial color="#000000" />
      </mesh>
      
      {/* Right Shoe */}
      <mesh position={[0.15, -0.65, 0.1]} castShadow>
        <boxGeometry args={[0.15, 0.1, 0.3]} />
        <meshLambertMaterial color="#000000" />
      </mesh>
    </group>
  );
}

// Vehicle component  
function Vehicle({ vehicle, isPlayerVehicle, onEnter }) {
  const vehicleRef = useRef();
  const [hovered, setHovered] = useState(false);

  const getVehicleGeometry = (type) => {
    switch (type) {
      case 'sports':
        return <boxGeometry args={[4, 1.2, 2]} />;
      case 'compact':
        return <boxGeometry args={[3, 1, 1.8]} />;
      case 'scooter':
        return <cylinderGeometry args={[0.3, 0.3, 1.5]} />;
      default:
        return <boxGeometry args={[3.5, 1.1, 2]} />;
    }
  };

  const getVehicleColor = (type) => {
    switch (type) {
      case 'sports':
        return '#ff0000';
      case 'compact':
        return '#00ff00';
      case 'scooter':
        return '#0080ff';
      default:
        return '#ffff00';
    }
  };

  return (
    <mesh
      ref={vehicleRef}
      position={[vehicle.position.x, vehicle.position.y + 0.6, vehicle.position.z]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onEnter}
      castShadow
    >
      {getVehicleGeometry(vehicle.type)}
      <meshLambertMaterial 
        color={hovered ? '#ffffff' : getVehicleColor(vehicle.type)}
      />
      {hovered && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {vehicle.name}
        </Text>
      )}
    </mesh>
  );
}

// NPC Component
function NPC({ position, color = '#FF6B6B', walkPath, speed = 0.02 }) {
  const groupRef = useRef();
  const [currentTarget, setCurrentTarget] = useState(0);
  const [currentPos, setCurrentPos] = useState(position);

  useFrame(() => {
    if (groupRef.current && walkPath && walkPath.length > 1) {
      const target = walkPath[currentTarget];
      const direction = {
        x: target.x - currentPos.x,
        z: target.z - currentPos.z
      };
      const distance = Math.sqrt(direction.x ** 2 + direction.z ** 2);

      if (distance < 0.5) {
        // Reached target, move to next point
        setCurrentTarget((prev) => (prev + 1) % walkPath.length);
      } else {
        // Move towards target
        const normalizedDir = {
          x: direction.x / distance,
          z: direction.z / distance
        };
        const newPos = {
          x: currentPos.x + normalizedDir.x * speed,
          z: currentPos.z + normalizedDir.z * speed
        };
        setCurrentPos(newPos);
        groupRef.current.position.set(newPos.x, position.y + 1, newPos.z);
      }
    }
  });

  return (
    <group ref={groupRef} castShadow>
      {/* Head */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.22]} />
        <meshLambertMaterial color="#FDBCB4" />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.85, 0]} castShadow>
        <sphereGeometry args={[0.25, 8, 6]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.5, 1.1, 0.25]} />
        <meshLambertMaterial color={color} />
      </mesh>
      
      {/* Left Arm */}
      <mesh position={[-0.35, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.7]} />
        <meshLambertMaterial color="#FDBCB4" />
      </mesh>
      
      {/* Right Arm */}
      <mesh position={[0.35, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.7]} />
        <meshLambertMaterial color="#FDBCB4" />
      </mesh>
      
      {/* Left Leg */}
      <mesh position={[-0.12, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.7]} />
        <meshLambertMaterial color="#000080" />
      </mesh>
      
      {/* Right Leg */}
      <mesh position={[0.12, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 0.7]} />
        <meshLambertMaterial color="#000080" />
      </mesh>
      
      {/* Left Shoe */}
      <mesh position={[-0.12, -0.6, 0.08]} castShadow>
        <boxGeometry args={[0.12, 0.08, 0.25]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
      
      {/* Right Shoe */}
      <mesh position={[0.12, -0.6, 0.08]} castShadow>
        <boxGeometry args={[0.12, 0.08, 0.25]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
    </group>
  );
}

// NPCs Component
function NPCs() {
  const npcs = [
    {
      id: 'npc1',
      position: { x: 8, y: 0, z: 8 },
      color: '#32CD32',
      walkPath: [
        { x: 8, z: 8 },
        { x: 15, z: 8 },
        { x: 15, z: 15 },
        { x: 8, z: 15 }
      ]
    },
    {
      id: 'npc2', 
      position: { x: -12, y: 0, z: 10 },
      color: '#FFD700',
      walkPath: [
        { x: -12, z: 10 },
        { x: -5, z: 10 },
        { x: -5, z: 5 },
        { x: -12, z: 5 }
      ]
    },
    {
      id: 'npc3',
      position: { x: 18, y: 0, z: -8 },
      color: '#9370DB',
      walkPath: [
        { x: 18, z: -8 },
        { x: 25, z: -8 },
        { x: 25, z: -15 },
        { x: 18, z: -15 }
      ]
    },
    {
      id: 'npc4',
      position: { x: -20, y: 0, z: -5 },
      color: '#FF69B4',
      walkPath: [
        { x: -20, z: -5 },
        { x: -15, z: -5 },
        { x: -15, z: -12 },
        { x: -20, z: -12 }
      ]
    },
    {
      id: 'npc5',
      position: { x: 5, y: 0, z: -20 },
      color: '#20B2AA',
      walkPath: [
        { x: 5, z: -20 },
        { x: 12, z: -20 },
        { x: 12, z: -25 },
        { x: 5, z: -25 }
      ]
    }
  ];

  return (
    <>
      {npcs.map(npc => (
        <NPC
          key={npc.id}
          position={npc.position}
          color={npc.color}
          walkPath={npc.walkPath}
        />
      ))}
    </>
  );
}

// Mission markers
function MissionMarker({ mission, onClick }) {
  const [hovered, setHovered] = useState(false);
  
  const getMarkerColor = (type) => {
    switch (type) {
      case 'delivery': return '#00ff00';
      case 'heist': return '#ff0000';
      case 'race': return '#ffff00';
      default: return '#0080ff';
    }
  };

  return (
    <group>
      <mesh
        position={[mission.location.x, mission.location.y + 2, mission.location.z]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <sphereGeometry args={[0.8]} />
        <meshLambertMaterial 
          color={getMarkerColor(mission.type)}
          emissive={getMarkerColor(mission.type)}
          emissiveIntensity={0.3}
        />
      </mesh>
      {hovered && (
        <Text
          position={[mission.location.x, mission.location.y + 4, mission.location.z]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {mission.title}
        </Text>
      )}
    </group>
  );
}

export default function GameWorld({ 
  player, 
  vehicles, 
  missions, 
  onPlayerMove, 
  onVehicleEnter, 
  onMissionStart 
}) {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas shadows camera={{ position: [10, 8, 10], fov: 75 }}>
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        {/* World elements */}
        <Ground />
        <Roads />
        <Buildings />
        
        {/* Player */}
        <Player 
          position={player.position} 
          inVehicle={player.in_vehicle}
          onPositionChange={onPlayerMove}
        />
        
        {/* Vehicles */}
        {vehicles.map(vehicle => (
          <Vehicle
            key={vehicle.id}
            vehicle={vehicle}
            isPlayerVehicle={player.current_vehicle === vehicle.id}
            onEnter={() => onVehicleEnter(vehicle)}
          />
        ))}
        
        {/* Mission markers */}
        {missions.map(mission => (
          <MissionMarker
            key={mission.id}
            mission={mission}
            onClick={() => onMissionStart(mission)}
          />
        ))}
        
        <OrbitControls enablePan={false} maxDistance={20} minDistance={5} />
      </Canvas>
    </div>
  );
}