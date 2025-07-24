import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Phone as PhoneIcon, 
  DollarSign, 
  Heart, 
  Shield, 
  Car, 
  MapPin,
  Target,
  Trophy
} from 'lucide-react';

// HUD Component
function GameHUD({ player }) {
  return (
    <div className="fixed top-4 left-4 z-50 space-y-2">
      {/* Money */}
      <Card className="bg-black/80 text-white border-green-500">
        <CardContent className="p-3 flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-400" />
          <span className="font-bold text-green-400">€{player.money.toLocaleString()}</span>
        </CardContent>
      </Card>
      
      {/* Health */}
      <Card className="bg-black/80 text-white border-red-500">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Heart className="h-4 w-4 text-red-400" />
            <span className="text-sm">Salute</span>
          </div>
          <Progress value={player.health} className="h-2" />
        </CardContent>
      </Card>
      
      {/* Wanted Level */}
      {player.wanted_level > 0 && (
        <Card className="bg-black/80 text-white border-orange-500">
          <CardContent className="p-3 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-orange-400" />
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 ${i < player.wanted_level ? 'bg-orange-400' : 'bg-gray-600'}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Phone Component
function Phone({ contacts, missions, heists, onCall, onClose }) {
  const [activeTab, setActiveTab] = useState('contacts');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-80 h-96 bg-gray-900 text-white border-blue-500">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-blue-400">📱 iPhone</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'contacts' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('contacts')}
            >
              Contatti
            </Button>
            <Button
              variant={activeTab === 'missions' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('missions')}
            >
              Lavori
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          {activeTab === 'contacts' && (
            <div className="space-y-2">
              {contacts.map(contact => (
                <Card key={contact.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{contact.name}</h4>
                        <p className="text-sm text-gray-400">{contact.number}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onCall(contact)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <PhoneIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {activeTab === 'missions' && (
            <div className="space-y-2">
              {missions.map(mission => (
                <Card key={mission.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{mission.title}</h4>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        €{mission.reward}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{mission.description}</p>
                    <Badge variant="secondary">{mission.type}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Mission Panel
function MissionPanel({ mission, onAccept, onDecline }) {
  if (!mission) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-96 bg-gray-900 text-white border-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-yellow-400" />
            <span>{mission.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">{mission.description}</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-green-400 font-bold">€{mission.reward}</span>
            </div>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {mission.type}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => onAccept(mission)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Accetta
            </Button>
            <Button 
              variant="outline" 
              onClick={onDecline}
              className="flex-1"
            >
              Rifiuta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Vehicle Info Panel
function VehiclePanel({ vehicle, onEnter, onClose }) {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-80 bg-gray-900 text-white border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-blue-400" />
            <span>{vehicle.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Tipo:</span>
              <Badge variant="outline">{vehicle.type}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Prezzo:</span>
              <span className="text-green-400">€{vehicle.price.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => onEnter(vehicle)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Entra
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Chiudi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Controls info
function ControlsInfo() {
  return (
    <Card className="fixed bottom-4 right-4 bg-black/80 text-white border-gray-500">
      <CardContent className="p-3">
        <h4 className="font-bold mb-2">Controlli:</h4>
        <div className="text-sm space-y-1">
          <div>WASD - Movimento</div>
          <div>P - Telefono</div>
          <div>Click - Interagisci</div>
          <div>Enter - Entra/Esci veicolo</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GameUI({
  player,
  contacts,
  missions,
  heists,
  showPhone,
  selectedMission,
  selectedVehicle,
  onPhoneToggle,
  onPhoneClose,
  onCall,
  onMissionAccept,
  onMissionDecline,
  onVehicleEnter,
  onVehicleClose
}) {
  return (
    <>
      <GameHUD player={player} />
      <ControlsInfo />
      
      {showPhone && (
        <Phone
          contacts={contacts}
          missions={missions}
          heists={heists}
          onCall={onCall}
          onClose={onPhoneClose}
        />
      )}
      
      {selectedMission && (
        <MissionPanel
          mission={selectedMission}
          onAccept={onMissionAccept}
          onDecline={onMissionDecline}
        />
      )}
      
      {selectedVehicle && (
        <VehiclePanel
          vehicle={selectedVehicle}
          onEnter={onVehicleEnter}
          onClose={onVehicleClose}
        />
      )}
    </>
  );
}