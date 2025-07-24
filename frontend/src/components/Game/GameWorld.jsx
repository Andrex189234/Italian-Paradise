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

// Player component
function Player({ position, inVehicle, onPositionChange }) {
  const playerRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (playerRef.current && !inVehicle) {
      playerRef.current.position.set(position.x, position.y + 1, position.z);
      
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
    <mesh ref={playerRef} castShadow>
      <cylinderGeometry args={[0.5, 0.5, 2]} />
      <meshLambertMaterial color="#FFB347" />
    </mesh>
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