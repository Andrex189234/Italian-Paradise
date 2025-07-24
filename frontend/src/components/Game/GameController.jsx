import React, { useState, useEffect, useCallback } from 'react';
import { mockGameData } from '../../mock/gameData';
import GameWorld from './GameWorld';
import GameUI from './GameUI';
import MiniMap from './MiniMap';
import { useToast } from '../../hooks/use-toast';

export default function GameController() {
  const [gameState, setGameState] = useState({
    player: { ...mockGameData.player },
    vehicles: [...mockGameData.vehicles],
    missions: [...mockGameData.missions],
    heists: [...mockGameData.heists],
    contacts: [...mockGameData.contacts],
    locations: [...mockGameData.locations]
  });

  const [uiState, setUIState] = useState({
    showPhone: false,
    selectedMission: null,
    selectedVehicle: null,
    activeNotification: null
  });

  const { toast } = useToast();

  // Movement speed
  const MOVE_SPEED = 0.3;
  const VEHICLE_SPEED = 0.8;

  // Player movement with WASD
  const handleKeyPress = useCallback((event) => {
    const key = event.key.toLowerCase();
    const speed = gameState.player.in_vehicle ? VEHICLE_SPEED : MOVE_SPEED;
    
    switch (key) {
      case 'w':
        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            position: {
              ...prev.player.position,
              z: prev.player.position.z - speed
            }
          }
        }));
        break;
      case 's':
        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            position: {
              ...prev.player.position,
              z: prev.player.position.z + speed
            }
          }
        }));
        break;
      case 'a':
        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            position: {
              ...prev.player.position,
              x: prev.player.position.x - speed
            }
          }
        }));
        break;
      case 'd':
        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            position: {
              ...prev.player.position,
              x: prev.player.position.x + speed
            }
          }
        }));
        break;
      case 'p':
        setUIState(prev => ({
          ...prev,
          showPhone: !prev.showPhone
        }));
        break;
      case 'enter':
        handleVehicleToggle();
        break;
      default:
        break;
    }
  }, [gameState.player.in_vehicle]);

  // Vehicle enter/exit logic
  const handleVehicleToggle = () => {
    if (gameState.player.in_vehicle) {
      // Exit vehicle
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          in_vehicle: false,
          current_vehicle: null
        }
      }));
      toast({
        title: "Veicolo abbandonato",
        description: "Sei sceso dal veicolo"
      });
    } else {
      // Check for nearby vehicles
      const nearbyVehicle = gameState.vehicles.find(vehicle => {
        const distance = Math.sqrt(
          Math.pow(vehicle.position.x - gameState.player.position.x, 2) +
          Math.pow(vehicle.position.z - gameState.player.position.z, 2)
        );
        return distance < 3 && vehicle.available;
      });

      if (nearbyVehicle) {
        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            in_vehicle: true,
            current_vehicle: nearbyVehicle.id,
            position: { ...nearbyVehicle.position }
          }
        }));
        toast({
          title: "Veicolo preso",
          description: `Stai guidando ${nearbyVehicle.name}`
        });
      }
    }
  };

  // Handle vehicle interaction
  const handleVehicleEnter = (vehicle) => {
    setUIState(prev => ({
      ...prev,
      selectedVehicle: vehicle
    }));
  };

  const handleVehicleConfirm = (vehicle) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        in_vehicle: true,
        current_vehicle: vehicle.id,
        position: { ...vehicle.position }
      }
    }));
    setUIState(prev => ({
      ...prev,
      selectedVehicle: null
    }));
    toast({
      title: "Veicolo preso",
      description: `Stai guidando ${vehicle.name}`
    });
  };

  // Handle mission interaction
  const handleMissionStart = (mission) => {
    setUIState(prev => ({
      ...prev,
      selectedMission: mission
    }));
  };

  const handleMissionAccept = (mission) => {
    // Start mission logic
    setGameState(prev => ({
      ...prev,
      missions: prev.missions.map(m => 
        m.id === mission.id ? { ...m, status: 'active' } : m
      ),
      player: {
        ...prev.player,
        money: prev.player.money + mission.reward
      }
    }));
    
    setUIState(prev => ({
      ...prev,
      selectedMission: null
    }));
    
    // Mission completion simulation
    toast({
      title: "Missione completata!",
      description: `Hai guadagnato €${mission.reward}! ${mission.title} completata con successo.`
    });
    
    // After some time, complete the mission
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        missions: prev.missions.map(m => 
          m.id === mission.id ? { ...m, status: 'completed' } : m
        )
      }));
    }, 3000);
  };

  const handleMissionDecline = () => {
    setUIState(prev => ({
      ...prev,
      selectedMission: null
    }));
  };

  // Handle phone interactions
  const handlePhoneToggle = () => {
    setUIState(prev => ({
      ...prev,
      showPhone: !prev.showPhone
    }));
  };

  const handlePhoneClose = () => {
    setUIState(prev => ({
      ...prev,
      showPhone: false
    }));
  };

  const handleCall = (contact) => {
    toast({
      title: `Chiamando ${contact.name}`,
      description: `Numero: ${contact.number}`
    });
    
    // Simulate call functionality based on contact type
    setTimeout(() => {
      switch (contact.type) {
        case 'missions':
          toast({
            title: "Marco risponde",
            description: "Ciao! Ho alcuni lavori per te. Controlla la mappa!"
          });
          // Show available missions on map
          break;
        case 'heists':
          toast({
            title: "Salvatore risponde", 
            description: "Hai quello che serve per un colpo grosso? Vai ai marker rossi!"
          });
          break;
        case 'vehicles':
          toast({
            title: "Concessionario risponde",
            description: "Abbiamo nuovi veicoli disponibili! Vieni a trovarci!"
          });
          break;
        default:
          toast({
            title: "Nessuna risposta",
            description: "Il numero non risponde..."
          });
      }
    }, 1500);
    
    // Close phone after call
    setTimeout(() => {
      setUIState(prev => ({
        ...prev,
        showPhone: false
      }));
    }, 3000);
  };

  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (event) => {
      event.preventDefault();
      handleKeyPress(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress]);

  // Update vehicle positions if player is driving
  useEffect(() => {
    if (gameState.player.in_vehicle && gameState.player.current_vehicle) {
      setGameState(prev => ({
        ...prev,
        vehicles: prev.vehicles.map(vehicle => 
          vehicle.id === prev.player.current_vehicle 
            ? { ...vehicle, position: { ...prev.player.position } }
            : vehicle
        )
      }));
    }
  }, [gameState.player.position, gameState.player.in_vehicle, gameState.player.current_vehicle]);

  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      <GameWorld
        player={gameState.player}
        vehicles={gameState.vehicles}
        missions={gameState.missions}
        onPlayerMove={() => {}} // Movement handled by keyboard
        onVehicleEnter={handleVehicleEnter}
        onMissionStart={handleMissionStart}
      />
      
      <MiniMap
        player={gameState.player}
        vehicles={gameState.vehicles}
        missions={gameState.missions}
        npcs={[]} // Will be populated with NPC data
      />
      
      <GameUI
        player={gameState.player}
        contacts={gameState.contacts}
        missions={gameState.missions}
        heists={gameState.heists}
        showPhone={uiState.showPhone}
        selectedMission={uiState.selectedMission}
        selectedVehicle={uiState.selectedVehicle}
        onPhoneToggle={handlePhoneToggle}
        onPhoneClose={handlePhoneClose}
        onCall={handleCall}
        onMissionAccept={handleMissionAccept}
        onMissionDecline={handleMissionDecline}
        onVehicleEnter={handleVehicleConfirm}
        onVehicleClose={() => setUIState(prev => ({ ...prev, selectedVehicle: null }))}
      />
    </div>
  );
}