import React from 'react';
import { Card, CardContent } from '../ui/card';

export default function MiniMap({ player, vehicles, missions, npcs }) {
  // Map scale - adjust based on world size (300x300)
  const MAP_SIZE = 150; // pixels
  const WORLD_SIZE = 300; // world units
  const SCALE = MAP_SIZE / WORLD_SIZE;

  // Convert world coordinates to minimap coordinates
  const worldToMap = (worldPos) => ({
    x: (worldPos.x + WORLD_SIZE/2) * SCALE,
    y: (worldPos.z + WORLD_SIZE/2) * SCALE // Note: z becomes y in 2D
  });

  const playerMapPos = worldToMap(player.position);

  return (
    <Card className="fixed top-4 right-4 bg-black/90 border-green-500">
      <CardContent className="p-2">
        <div 
          className="relative bg-green-900/30 border border-green-500"
          style={{ width: MAP_SIZE, height: MAP_SIZE }}
        >
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full">
            {/* Vertical grid lines */}
            {[...Array(6)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * (MAP_SIZE / 5)}
                y1={0}
                x2={i * (MAP_SIZE / 5)}
                y2={MAP_SIZE}
                stroke="#22c55e"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
            {/* Horizontal grid lines */}
            {[...Array(6)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1={0}
                y1={i * (MAP_SIZE / 5)}
                x2={MAP_SIZE}
                y2={i * (MAP_SIZE / 5)}
                stroke="#22c55e"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
          </svg>

          {/* Major roads */}
          <div 
            className="absolute bg-gray-600"
            style={{
              left: '48%',
              top: 0,
              width: '4px',
              height: '100%'
            }}
          />
          <div 
            className="absolute bg-gray-600"
            style={{
              left: 0,
              top: '48%',
              width: '100%',
              height: '4px'
            }}
          />

          {/* Buildings representation */}
          <div className="absolute inset-0">
            {/* Skyscrapers area */}
            <div 
              className="absolute bg-blue-500/60"
              style={{
                left: '65%',
                top: '20%',
                width: '30%',
                height: '25%'
              }}
            />
            
            {/* Residential area */}
            <div 
              className="absolute bg-yellow-500/40"
              style={{
                left: '60%',
                top: '60%',
                width: '25%',
                height: '20%'
              }}
            />
            
            {/* Shopping centers */}
            <div 
              className="absolute bg-purple-500/40"
              style={{
                left: '10%',
                top: '65%',
                width: '20%',
                height: '15%'
              }}
            />
          </div>

          {/* Player dot (always centered with rotation) */}
          <div
            className="absolute w-3 h-3 bg-red-500 rounded-full border border-white transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: `${playerMapPos.x}px`,
              top: `${playerMapPos.y}px`
            }}
          >
            {/* Player direction indicator */}
            <div className="absolute w-1 h-2 bg-red-500 transform -translate-x-1/2 -top-2 left-1/2" />
          </div>

          {/* Vehicles */}
          {vehicles.map((vehicle) => {
            const vehicleMapPos = worldToMap(vehicle.position);
            // Only show if vehicle is in map bounds
            if (vehicleMapPos.x >= 0 && vehicleMapPos.x <= MAP_SIZE && 
                vehicleMapPos.y >= 0 && vehicleMapPos.y <= MAP_SIZE) {
              return (
                <div
                  key={vehicle.id}
                  className={`absolute w-2 h-2 rounded-sm transform -translate-x-1/2 -translate-y-1/2 ${
                    player.current_vehicle === vehicle.id 
                      ? 'bg-red-400 border border-white' 
                      : vehicle.type === 'sports' 
                        ? 'bg-red-300' 
                        : vehicle.type === 'compact' 
                          ? 'bg-green-300' 
                          : 'bg-blue-300'
                  } z-10`}
                  style={{
                    left: `${vehicleMapPos.x}px`,
                    top: `${vehicleMapPos.y}px`
                  }}
                />
              );
            }
            return null;
          })}

          {/* Mission markers */}
          {missions.map((mission) => {
            const missionMapPos = worldToMap(mission.location);
            // Only show if mission is in map bounds
            if (missionMapPos.x >= 0 && missionMapPos.x <= MAP_SIZE && 
                missionMapPos.y >= 0 && missionMapPos.y <= MAP_SIZE) {
              return (
                <div
                  key={mission.id}
                  className={`absolute w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-15 ${
                    mission.type === 'delivery' 
                      ? 'bg-green-400' 
                      : mission.type === 'heist' 
                        ? 'bg-red-400' 
                        : mission.type === 'race'
                          ? 'bg-yellow-400'
                          : 'bg-blue-400'
                  } animate-pulse`}
                  style={{
                    left: `${missionMapPos.x}px`,
                    top: `${missionMapPos.y}px`
                  }}
                />
              );
            }
            return null;
          })}

          {/* NPCs */}
          {npcs && npcs.map((npc, index) => {
            const npcMapPos = worldToMap(npc.position);
            // Only show if NPC is in map bounds and close to player
            const distanceToPlayer = Math.sqrt(
              Math.pow(npc.position.x - player.position.x, 2) + 
              Math.pow(npc.position.z - player.position.z, 2)
            );
            if (npcMapPos.x >= 0 && npcMapPos.x <= MAP_SIZE && 
                npcMapPos.y >= 0 && npcMapPos.y <= MAP_SIZE && 
                distanceToPlayer < 50) {
              return (
                <div
                  key={`npc-${index}`}
                  className="absolute w-1 h-1 bg-orange-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-5"
                  style={{
                    left: `${npcMapPos.x}px`,
                    top: `${npcMapPos.y}px`
                  }}
                />
              );
            }
            return null;
          })}

          {/* Radar sweep effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute w-full h-full rounded-full border-2 border-green-400/30 animate-ping"
              style={{
                animation: 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite'
              }}
            />
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-2 text-xs text-green-400 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Tu</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Lavori</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span>Rapine</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}