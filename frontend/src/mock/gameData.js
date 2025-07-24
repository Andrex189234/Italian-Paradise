// Mock data for Italian Paradise game
export const mockGameData = {
  player: {
    id: 'player1',
    name: 'Tony Romano',
    money: 5000,
    health: 100,
    wanted_level: 0,
    position: { x: 0, y: 0, z: 0 },
    in_vehicle: false,
    current_vehicle: null
  },
  
  vehicles: [
    {
      id: 'car1',
      name: 'Ferrari Roma',
      type: 'sports',
      position: { x: 10, y: 0, z: 10 },
      available: true,
      price: 200000
    },
    {
      id: 'car2', 
      name: 'Fiat 500',
      type: 'compact',
      position: { x: 20, y: 0, z: 5 },
      available: true,
      price: 15000
    },
    {
      id: 'car3',
      name: 'Vespa Primavera',
      type: 'scooter',
      position: { x: 5, y: 0, z: 15 },
      available: true,
      price: 3000
    }
  ],

  missions: [
    {
      id: 'mission1',
      title: 'Consegna Pizza',
      description: 'Consegna 5 pizze in tempo per guadagnare €500',
      reward: 500,
      type: 'delivery',
      status: 'available',
      location: { x: 30, y: 0, z: 30 }
    },
    {
      id: 'mission2',
      title: 'Rapina Banca',
      description: 'Rapina la Banca Nazionale per un grosso bottino',
      reward: 10000,
      type: 'heist',
      status: 'available',
      location: { x: -20, y: 0, z: 25 }
    },
    {
      id: 'mission3',
      title: 'Corsa Clandestina',
      description: 'Vinci la corsa per guadagnare €2000',
      reward: 2000,
      type: 'race',
      status: 'available',
      location: { x: 40, y: 0, z: -10 }
    }
  ],

  heists: [
    {
      id: 'heist1',
      name: 'Rapina alla Gioielleria',
      difficulty: 'easy',
      reward: 5000,
      location: { x: -10, y: 0, z: 20 },
      requirements: ['getaway_car'],
      status: 'available'
    },
    {
      id: 'heist2',
      name: 'Rapina alla Banca Centrale',
      difficulty: 'hard',
      reward: 25000,
      location: { x: -20, y: 0, z: 25 },
      requirements: ['weapons', 'team'],
      status: 'locked'
    }
  ],

  contacts: [
    {
      id: 'contact1',
      name: 'Marco - Missioni',
      number: '555-JOBS',
      type: 'missions'
    },
    {
      id: 'contact2',
      name: 'Salvatore - Rapine',
      number: '555-HEIST',
      type: 'heists'
    },
    {
      id: 'contact3',
      name: 'Concessionario',
      number: '555-CARS',
      type: 'vehicles'
    }
  ],

  locations: [
    {
      id: 'spawn',
      name: 'Casa',
      position: { x: 0, y: 0, z: 0 },
      type: 'safe_house'
    },
    {
      id: 'bank',
      name: 'Banca Nazionale',
      position: { x: -20, y: 0, z: 25 },
      type: 'bank'
    },
    {
      id: 'jewelry',
      name: 'Gioielleria Tiffany',
      position: { x: -10, y: 0, z: 20 },
      type: 'jewelry_store'
    },
    {
      id: 'garage',
      name: 'Garage',
      position: { x: 15, y: 0, z: 0 },
      type: 'garage'
    }
  ]
};