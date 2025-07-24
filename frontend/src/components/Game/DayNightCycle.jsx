import React, { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function DayNightCycle({ onTimeChange }) {
  const [time, setTime] = useState(12); // Start at noon (12:00)
  const [isDay, setIsDay] = useState(true);

  useFrame(() => {
    // Increment time every frame (24 hours = 2 minutes real time)
    setTime(prevTime => {
      const newTime = prevTime + 0.002; // Speed of day/night cycle
      const adjustedTime = newTime >= 24 ? 0 : newTime;
      
      // Determine if it's day or night
      const newIsDay = adjustedTime >= 6 && adjustedTime <= 18;
      setIsDay(newIsDay);
      
      // Call callback with time info
      if (onTimeChange) {
        onTimeChange({
          time: adjustedTime,
          isDay: newIsDay,
          hour: Math.floor(adjustedTime),
          minute: Math.floor((adjustedTime % 1) * 60)
        });
      }
      
      return adjustedTime;
    });
  });

  // Calculate light intensity based on time
  const getLightIntensity = () => {
    if (time >= 6 && time <= 8) {
      // Dawn
      return 0.3 + (time - 6) * 0.35; // 0.3 to 1.0
    } else if (time > 8 && time < 18) {
      // Day
      return 1.0;
    } else if (time >= 18 && time <= 20) {
      // Dusk
      return 1.0 - (time - 18) * 0.35; // 1.0 to 0.3
    } else {
      // Night
      return 0.2;
    }
  };

  // Calculate sun position
  const getSunPosition = () => {
    const angle = ((time - 6) / 12) * Math.PI; // Sun path from east to west
    return {
      x: Math.cos(angle) * 100,
      y: Math.sin(angle) * 50 + 20,
      z: 0
    };
  };

  // Sky color based on time
  const getSkyColor = () => {
    if (time >= 5 && time <= 7) {
      // Dawn - orange/pink
      return new THREE.Color('#FF6B47');
    } else if (time > 7 && time < 17) {
      // Day - blue
      return new THREE.Color('#87CEEB');
    } else if (time >= 17 && time <= 19) {
      // Dusk - orange/purple
      return new THREE.Color('#FF4500');
    } else {
      // Night - dark blue
      return new THREE.Color('#191970');
    }
  };

  const sunPosition = getSunPosition();
  const lightIntensity = getLightIntensity();
  const skyColor = getSkyColor();

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={isDay ? 0.4 : 0.1} />
      
      {/* Sun/Moon light */}
      <directionalLight
        position={[sunPosition.x, sunPosition.y, sunPosition.z]}
        intensity={lightIntensity}
        color={isDay ? '#FFFFFF' : '#B0C4DE'}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
      />
      
      {/* Additional night lighting */}
      {!isDay && (
        <>
          <pointLight position={[0, 15, 0]} intensity={0.3} color="#FFE4B5" />
          <pointLight position={[50, 10, 50]} intensity={0.2} color="#FFE4B5" />
          <pointLight position={[-50, 10, -50]} intensity={0.2} color="#FFE4B5" />
        </>
      )}
      
      {/* Sky sphere */}
      <mesh>
        <sphereGeometry args={[500, 32, 32]} />
        <meshBasicMaterial color={skyColor} side={THREE.BackSide} />
      </mesh>
      
      {/* Sun/Moon */}
      <mesh position={[sunPosition.x, sunPosition.y, sunPosition.z]}>
        <sphereGeometry args={[isDay ? 8 : 6]} />
        <meshBasicMaterial 
          color={isDay ? '#FFFF00' : '#F5F5F5'} 
          emissive={isDay ? '#FFFF00' : '#E6E6FA'}
          emissiveIntensity={isDay ? 0.8 : 0.5}
        />
      </mesh>
    </>
  );
}