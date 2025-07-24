import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Ground component - Expanded world
function Ground() {
  return (
    <>
      {/* Main ground */}
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[300, 1, 300]} />
        <meshLambertMaterial color="#4a5d3a" />
      </mesh>
      {/* Grass patches */}
      <mesh receiveShadow position={[50, -0.4, 50]}>
        <boxGeometry args={[40, 0.2, 40]} />
        <meshLambertMaterial color="#5a7a4a" />
      </mesh>
      <mesh receiveShadow position={[-70, -0.4, -30]}>
        <boxGeometry args={[50, 0.2, 35]} />
        <meshLambertMaterial color="#5a7a4a" />
      </mesh>
    </>
  );
}

// Enhanced Roads network
function Roads() {
  return (
    <>
      {/* Main horizontal highways */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[300, 0.1, 8]} />
        <meshLambertMaterial color="#2c2c2c" />
      </mesh>
      <mesh position={[0, 0, 60]}>
        <boxGeometry args={[200, 0.1, 6]} />
        <meshLambertMaterial color="#2c2c2c" />
      </mesh>
      <mesh position={[0, 0, -60]}>
        <boxGeometry args={[200, 0.1, 6]} />
        <meshLambertMaterial color="#2c2c2c" />
      </mesh>
      
      {/* Main vertical highways */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8, 0.1, 300]} />
        <meshLambertMaterial color="#2c2c2c" />
      </mesh>
      <mesh position={[80, 0, 0]}>
        <boxGeometry args={[6, 0.1, 200]} />
        <meshLambertMaterial color="#2c2c2c" />
      </mesh>
      <mesh position={[-80, 0, 0]}>
        <boxGeometry args={[6, 0.1, 200]} />
        <meshLambertMaterial color="#2c2c2c" />
      </mesh>
      
      {/* Secondary roads */}
      <mesh position={[40, 0, 30]}>
        <boxGeometry args={[4, 0.1, 60]} />
        <meshLambertMaterial color="#3c3c3c" />
      </mesh>
      <mesh position={[-40, 0, -30]}>
        <boxGeometry args={[4, 0.1, 80]} />
        <meshLambertMaterial color="#3c3c3c" />
      </mesh>
      <mesh position={[20, 0, -70]}>
        <boxGeometry args={[60, 0.1, 4]} />
        <meshLambertMaterial color="#3c3c3c" />
      </mesh>
      
      {/* Road lines */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[300, 0.05, 0.3]} />
        <meshLambertMaterial color="#ffff00" />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.3, 0.05, 300]} />
        <meshLambertMaterial color="#ffff00" />
      </mesh>
    </>
  );
}

// Realistic Buildings component
function Buildings() {
  // Residential Houses
  const ResidentialHouse = ({ position, color = '#CD853F', roofColor = '#8B0000' }) => (
    <group position={position}>
      {/* Main house structure */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[12, 4, 10]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[8, 2, 4]} />
        <meshLambertMaterial color={roofColor} />
      </mesh>
      {/* Front door */}
      <mesh position={[0, 1, 5.1]} castShadow>
        <boxGeometry args={[1.5, 3, 0.2]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
      {/* Windows */}
      <mesh position={[-3, 2.5, 5.1]} castShadow>
        <boxGeometry args={[2, 1.5, 0.15]} />
        <meshLambertMaterial color="#87CEEB" />
      </mesh>
      <mesh position={[3, 2.5, 5.1]} castShadow>
        <boxGeometry args={[2, 1.5, 0.15]} />
        <meshLambertMaterial color="#87CEEB" />
      </mesh>
      {/* Side windows */}
      <mesh position={[-6.1, 2.5, 0]} castShadow>
        <boxGeometry args={[0.15, 1.5, 2]} />
        <meshLambertMaterial color="#87CEEB" />
      </mesh>
      <mesh position={[6.1, 2.5, 0]} castShadow>
        <boxGeometry args={[0.15, 1.5, 2]} />
        <meshLambertMaterial color="#87CEEB" />
      </mesh>
    </group>
  );

  // Office Buildings
  const OfficeBuilding = ({ position, height = 15, color = '#696969' }) => (
    <group position={position}>
      {/* Main building */}
      <mesh position={[0, height/2, 0]} castShadow>
        <boxGeometry args={[15, height, 12]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Windows grid */}
      {[...Array(Math.floor(height/3))].map((_, floor) => 
        [...Array(4)].map((_, window) => (
          <mesh key={`${floor}-${window}`} position={[-6 + window * 4, 2 + floor * 3, 6.1]} castShadow>
            <boxGeometry args={[1.5, 1.2, 0.1]} />
            <meshLambertMaterial color="#B0E0E6" />
          </mesh>
        ))
      )}
      {/* Entrance */}
      <mesh position={[0, 2, 6.1]} castShadow>
        <boxGeometry args={[4, 4, 0.2]} />
        <meshLambertMaterial color="#2F4F4F" />
      </mesh>
    </group>
  );

  // Skyscraper
  const Skyscraper = ({ position }) => (
    <group position={position}>
      {/* Main tower */}
      <mesh position={[0, 20, 0]} castShadow>
        <boxGeometry args={[12, 40, 12]} />
        <meshLambertMaterial color="#4682B4" />
      </mesh>
      {/* Top section */}
      <mesh position={[0, 42, 0]} castShadow>
        <boxGeometry args={[8, 4, 8]} />
        <meshLambertMaterial color="#36648B" />
      </mesh>
      {/* Windows pattern */}
      {[...Array(13)].map((_, floor) => 
        [...Array(3)].map((_, window) => (
          <mesh key={`sky-${floor}-${window}`} position={[-4 + window * 4, 2 + floor * 3, 6.1]} castShadow>
            <boxGeometry args={[1.2, 1, 0.05]} />
            <meshLambertMaterial color="#E6F3FF" />
          </mesh>
        ))
      )}
    </group>
  );

  // Shopping Center
  const ShoppingCenter = ({ position }) => (
    <group position={position}>
      {/* Main structure */}
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[25, 6, 15]} />
        <meshLambertMaterial color="#DDA0DD" />
      </mesh>
      {/* Store fronts */}
      <mesh position={[-8, 2, 7.6]} castShadow>
        <boxGeometry args={[6, 4, 0.2]} />
        <meshLambertMaterial color="#FF69B4" />
      </mesh>
      <mesh position={[0, 2, 7.6]} castShadow>
        <boxGeometry args={[6, 4, 0.2]} />
        <meshLambertMaterial color="#FFB6C1" />
      </mesh>
      <mesh position={[8, 2, 7.6]} castShadow>
        <boxGeometry args={[6, 4, 0.2]} />
        <meshLambertMaterial color="#FFA0C1" />
      </mesh>
      {/* Parking area indicator */}
      <mesh position={[0, 0.1, -10]} receiveShadow>
        <boxGeometry args={[20, 0.1, 8]} />
        <meshLambertMaterial color="#4C4C4C" />
      </mesh>
    </group>
  );

  return (
    <>
      {/* Residential Area */}
      <ResidentialHouse position={[25, 0, 25]} color="#F4A460" roofColor="#8B0000" />
      <ResidentialHouse position={[45, 0, 25]} color="#DEB887" roofColor="#A0522D" />
      <ResidentialHouse position={[25, 0, 45]} color="#D2B48C" roofColor="#CD853F" />
      <ResidentialHouse position={[45, 0, 45]} color="#BC8F8F" roofColor="#8B4513" />
      
      <ResidentialHouse position={[-25, 0, 25]} color="#FFEFD5" roofColor="#800000" />
      <ResidentialHouse position={[-45, 0, 25]} color="#FFE4B5" roofColor="#B22222" />
      <ResidentialHouse position={[-25, 0, 45]} color="#FFDAB9" roofColor="#DC143C" />
      
      {/* Office District */}
      <OfficeBuilding position={[60, 0, -30]} height={18} color="#708090" />
      <OfficeBuilding position={[80, 0, -30]} height={22} color="#696969" />
      <OfficeBuilding position={[100, 0, -30]} height={16} color="#778899" />
      
      <OfficeBuilding position={[-60, 0, -30]} height={20} color="#2F4F4F" />
      <OfficeBuilding position={[-80, 0, -30]} height={24} color="#696969" />
      
      {/* Downtown Skyscrapers */}
      <Skyscraper position={[30, 0, -70]} />
      <Skyscraper position={[-30, 0, -70]} />
      <Skyscraper position={[0, 0, -90]} />
      
      {/* Shopping Areas */}
      <ShoppingCenter position={[-70, 0, 40]} />
      <ShoppingCenter position={[70, 0, 40]} />
      
      {/* Mixed Buildings */}
      <OfficeBuilding position={[120, 0, 20]} height={12} color="#BDB76B" />
      <ResidentialHouse position={[120, 0, 60]} color="#F0E68C" roofColor="#DAA520" />
      <OfficeBuilding position={[-120, 0, 20]} height={14} color="#9ACD32" />
      <ResidentialHouse position={[-120, 0, 60]} color="#ADFF2F" roofColor="#32CD32" />
      
      {/* Industrial Area */}
      <mesh position={[0, 4, 120]} castShadow>
        <boxGeometry args={[40, 8, 20]} />
        <meshLambertMaterial color="#A9A9A9" />
      </mesh>
      <mesh position={[50, 3, 120]} castShadow>
        <boxGeometry args={[30, 6, 15]} />
        <meshLambertMaterial color="#808080" />
      </mesh>
    </>
  );
}

// Enhanced Player component with better camera
function Player({ position, inVehicle, onPositionChange }) {
  const groupRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (groupRef.current && !inVehicle) {
      groupRef.current.position.set(position.x, position.y + 1, position.z);
      
      // Smooth camera follow with better positioning
      const targetX = position.x + 12;
      const targetY = position.y + 10;
      const targetZ = position.z + 12;
      
      camera.position.lerp({ x: targetX, y: targetY, z: targetZ }, 0.1);
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

// Player in Vehicle component  
function PlayerVehicle({ vehicle, player }) {
  const vehicleRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (vehicleRef.current && vehicle) {
      vehicleRef.current.position.set(player.position.x, player.position.y + 0.6, player.position.z);
      
      // Camera follows vehicle smoothly
      const targetX = player.position.x + 15;
      const targetY = player.position.y + 8;
      const targetZ = player.position.z + 15;
      
      camera.position.lerp({ x: targetX, y: targetY, z: targetZ }, 0.1);
      camera.lookAt(player.position.x, player.position.y + 1, player.position.z);
    }
  });

  if (!vehicle) return null;

  // Get the vehicle component based on type
  const getVehicleComponent = (type) => {
    const SportsCar = ({ color = '#ff0000' }) => (
      <group>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[4, 0.8, 1.8]} />
          <meshLambertMaterial color={color} />
        </mesh>
        <mesh position={[1.5, 0.5, 0]} castShadow>
          <boxGeometry args={[1, 0.4, 1.6]} />
          <meshLambertMaterial color={color} />
        </mesh>
        <mesh position={[-0.5, 0.9, 0]} castShadow>
          <boxGeometry args={[2, 0.8, 1.4]} />
          <meshLambertMaterial color={color} />
        </mesh>
        <mesh position={[0.3, 1, 0]} castShadow>
          <boxGeometry args={[0.8, 0.6, 1.45]} />
          <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
        {/* Wheels */}
        <mesh position={[1.2, -0.2, 1]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3]} rotation={[0, 0, Math.PI/2]} />
          <meshLambertMaterial color="#2F2F2F" />
        </mesh>
        <mesh position={[1.2, -0.2, -1]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3]} rotation={[0, 0, Math.PI/2]} />
          <meshLambertMaterial color="#2F2F2F" />
        </mesh>
        <mesh position={[-1.2, -0.2, 1]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3]} rotation={[0, 0, Math.PI/2]} />
          <meshLambertMaterial color="#2F2F2F" />
        </mesh>
        <mesh position={[-1.2, -0.2, -1]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3]} rotation={[0, 0, Math.PI/2]} />
          <meshLambertMaterial color="#2F2F2F" />
        </mesh>
      </group>
    );

    const CompactCar = ({ color = '#00ff00' }) => (
      <group>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[3, 1, 1.6]} />
          <meshLambertMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <sphereGeometry args={[1.2, 8, 6]} />
          <meshLambertMaterial color={color} />
        </mesh>
        <mesh position={[0.8, 0.7, 0]} castShadow>
          <boxGeometry args={[0.6, 0.5, 1.5]} />
          <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
        <mesh position={[-0.8, 0.7, 0]} castShadow>
          <boxGeometry args={[0.6, 0.5, 1.5]} />
          <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
        </mesh>
        {/* Wheels */}
        <mesh position={[1, -0.1, 0.9]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25]} rotation={[0, 0, Math.PI/2]} />
          <meshLambertMaterial color="#2F2F2F" />
        </mesh>
        <mesh position={[1, -0.1, -0.9]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25]} rotation={[0, 0, Math.PI/2]} />
          <meshLambertMaterial color="#2F2F2F" />
        </mesh>
        <mesh position={[-1, -0.1, 0.9]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25]} rotation={[0, 0, Math.PI/2]} />
          <meshLambertMaterial color="#2F2F2F" />
        </mesh>
        <mesh position={[-1, -0.1, -0.9]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25]} rotation={[0, 0, Math.PI/2]} />
          <meshLambertMaterial color="#2F2F2F" />
        </mesh>
      </group>
    );

    switch (type) {
      case 'sports':
        return <SportsCar color="#ff0000" />;
      case 'compact':
        return <CompactCar color="#00ff00" />;
      default:
        return <CompactCar color="#ffff00" />;
    }
  };

  return (
    <group ref={vehicleRef} castShadow>
      {getVehicleComponent(vehicle.type)}
    </group>
  );
}

// Realistic Vehicle component  
function Vehicle({ vehicle, isPlayerVehicle, onEnter }) {
  const vehicleRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Sports Car (Ferrari-like)
  const SportsCar = ({ color = '#ff0000' }) => (
    <group>
      {/* Main body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[4, 0.8, 1.8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Hood */}
      <mesh position={[1.5, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 0.4, 1.6]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Roof/Cabin */}
      <mesh position={[-0.5, 0.9, 0]} castShadow>
        <boxGeometry args={[2, 0.8, 1.4]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0.3, 1, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 1.45]} />
        <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
      </mesh>
      {/* Wheels */}
      <mesh position={[1.2, -0.2, 1]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} rotation={[0, 0, Math.PI/2]} />
        <meshLambertMaterial color="#2F2F2F" />
      </mesh>
      <mesh position={[1.2, -0.2, -1]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} rotation={[0, 0, Math.PI/2]} />
        <meshLambertMaterial color="#2F2F2F" />
      </mesh>
      <mesh position={[-1.2, -0.2, 1]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} rotation={[0, 0, Math.PI/2]} />
        <meshLambertMaterial color="#2F2F2F" />
      </mesh>
      <mesh position={[-1.2, -0.2, -1]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} rotation={[0, 0, Math.PI/2]} />
        <meshLambertMaterial color="#2F2F2F" />
      </mesh>
      {/* Headlights */}
      <mesh position={[2.1, 0.4, 0.6]} castShadow>
        <sphereGeometry args={[0.2]} />
        <meshLambertMaterial color="#FFFACD" emissive="#FFFACD" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[2.1, 0.4, -0.6]} castShadow>
        <sphereGeometry args={[0.2]} />
        <meshLambertMaterial color="#FFFACD" emissive="#FFFACD" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );

  // Compact Car (Fiat 500-like)
  const CompactCar = ({ color = '#00ff00' }) => (
    <group>
      {/* Main body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[3, 1, 1.6]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Rounded roof */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[1.2, 8, 6]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0.8, 0.7, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 1.5]} />
        <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
      </mesh>
      {/* Rear window */}
      <mesh position={[-0.8, 0.7, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 1.5]} />
        <meshLambertMaterial color="#87CEEB" transparent opacity={0.7} />
      </mesh>
      {/* Wheels */}
      <mesh position={[1, -0.1, 0.9]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.25]} rotation={[0, 0, Math.PI/2]} />
        <meshLambertMaterial color="#2F2F2F" />
      </mesh>
      <mesh position={[1, -0.1, -0.9]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.25]} rotation={[0, 0, Math.PI/2]} />
        <meshLambertMaterial color="#2F2F2F" />
      </mesh>
      <mesh position={[-1, -0.1, 0.9]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.25]} rotation={[0, 0, Math.PI/2]} />
        <meshLambertMaterial color="#2F2F2F" />
      </mesh>
      <mesh position={[-1, -0.1, -0.9]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.25]} rotation={[0, 0, Math.PI/2]} />
        <meshLambertMaterial color="#2F2F2F" />
      </mesh>
    </group>
  );

  // Scooter (Vespa-like)
  const Scooter = ({ color = '#0080ff' }) => (
    <group>
      {/* Main body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.6, 1.5]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Seat */}
      <mesh position={[-0.3, 0.7, 0]} castShadow>
        <boxGeometry args={[0.8, 0.2, 0.6]} />
        <meshLambertMaterial color="#654321" />
      </mesh>
      {/* Handlebars */}
      <mesh position={[0.5, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8]} rotation={[0, 0, Math.PI/2]} />
        <meshLambertMaterial color="#2F2F2F" />
      </mesh>
      {/* Front wheel */}
      <mesh position={[0.7, -0.1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} rotation={[0, 0, Math.PI/2]} />
        <meshLambertMaterial color="#2F2F2F" />
      </mesh>
      {/* Rear wheel */}
      <mesh position={[-0.7, -0.1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} rotation={[0, 0, Math.PI/2]} />
        <meshLambertMaterial color="#2F2F2F" />
      </mesh>
      {/* Headlight */}
      <mesh position={[0.8, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.15]} />
        <meshLambertMaterial color="#FFFACD" emissive="#FFFACD" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );

  const getVehicleComponent = (type) => {
    switch (type) {
      case 'sports':
        return <SportsCar color="#ff0000" />;
      case 'compact':
        return <CompactCar color="#00ff00" />;
      case 'scooter':
        return <Scooter color="#0080ff" />;
      default:
        return <CompactCar color="#ffff00" />;
    }
  };

  return (
    <group
      ref={vehicleRef}
      position={[vehicle.position.x, vehicle.position.y + 0.6, vehicle.position.z]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onEnter}
      castShadow
    >
      {getVehicleComponent(vehicle.type)}
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
    </group>
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
      position: { x: 20, y: 0, z: 20 },
      color: '#32CD32',
      walkPath: [
        { x: 20, z: 20 },
        { x: 35, z: 20 },
        { x: 35, z: 35 },
        { x: 20, z: 35 }
      ]
    },
    {
      id: 'npc2', 
      position: { x: -30, y: 0, z: 25 },
      color: '#FFD700',
      walkPath: [
        { x: -30, z: 25 },
        { x: -15, z: 25 },
        { x: -15, z: 10 },
        { x: -30, z: 10 }
      ]
    },
    {
      id: 'npc3',
      position: { x: 50, y: 0, z: -20 },
      color: '#9370DB',
      walkPath: [
        { x: 50, z: -20 },
        { x: 65, z: -20 },
        { x: 65, z: -35 },
        { x: 50, z: -35 }
      ]
    },
    {
      id: 'npc4',
      position: { x: -50, y: 0, z: -15 },
      color: '#FF69B4',
      walkPath: [
        { x: -50, z: -15 },
        { x: -35, z: -15 },
        { x: -35, z: -30 },
        { x: -50, z: -30 }
      ]
    },
    {
      id: 'npc5',
      position: { x: 15, y: 0, z: -60 },
      color: '#20B2AA',
      walkPath: [
        { x: 15, z: -60 },
        { x: 30, z: -60 },
        { x: 30, z: -75 },
        { x: 15, z: -75 }
      ]
    },
    {
      id: 'npc6',
      position: { x: -70, y: 0, z: 30 },
      color: '#FF4500',
      walkPath: [
        { x: -70, z: 30 },
        { x: -55, z: 30 },
        { x: -55, z: 45 },
        { x: -70, z: 45 }
      ]
    },
    {
      id: 'npc7',
      position: { x: 80, y: 0, z: 10 },
      color: '#8A2BE2',
      walkPath: [
        { x: 80, z: 10 },
        { x: 95, z: 10 },
        { x: 95, z: 25 },
        { x: 80, z: 25 }
      ]
    },
    {
      id: 'npc8',
      position: { x: 10, y: 0, z: 80 },
      color: '#DC143C',
      walkPath: [
        { x: 10, z: 80 },
        { x: 25, z: 80 },
        { x: 25, z: 95 },
        { x: 10, z: 95 }
      ]
    },
    {
      id: 'npc9',
      position: { x: -40, y: 0, z: -60 },
      color: '#00CED1',
      walkPath: [
        { x: -40, z: -60 },
        { x: -25, z: -60 },
        { x: -25, z: -75 },
        { x: -40, z: -75 }
      ]
    },
    {
      id: 'npc10',
      position: { x: 60, y: 0, z: -50 },
      color: '#FFB6C1',
      walkPath: [
        { x: 60, z: -50 },
        { x: 75, z: -50 },
        { x: 75, z: -65 },
        { x: 60, z: -65 }
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
      <Canvas shadows camera={{ position: [15, 12, 15], fov: 75, far: 500 }}>
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[20, 20, 10]} 
          intensity={1.2}
          castShadow
          shadow-mapSize={[4096, 4096]}
          shadow-camera-left={-150}
          shadow-camera-right={150}
          shadow-camera-top={150}
          shadow-camera-bottom={-150}
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} />
        
        {/* World elements */}
        <Ground />
        <Roads />
        <Buildings />
        
        {/* NPCs */}
        <NPCs />
        
        {/* Player */}
        <Player 
          position={player.position} 
          inVehicle={player.in_vehicle}
          onPositionChange={onPlayerMove}
        />
        
        {/* Player Vehicle (when driving) */}
        {player.in_vehicle && player.current_vehicle && (
          <PlayerVehicle 
            vehicle={vehicles.find(v => v.id === player.current_vehicle)}
            player={player}
          />
        )}
        
        {/* Vehicles (not being driven) */}
        {vehicles.filter(vehicle => vehicle.id !== player.current_vehicle).map(vehicle => (
          <Vehicle
            key={vehicle.id}
            vehicle={vehicle}
            isPlayerVehicle={false}
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
        
        <OrbitControls 
          enablePan={true} 
          maxDistance={50} 
          minDistance={8}
          enableRotate={true}
          autoRotate={false}
          enableZoom={true}
          mouseButtons={{
            LEFT: 0, // LEFT mouse button for rotation
            MIDDLE: 1, // MIDDLE mouse button for zoom  
            RIGHT: 2 // RIGHT mouse button for pan
          }}
        />
      </Canvas>
    </div>
  );
}