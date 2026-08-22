export interface City {
  id: string
  name: string
  country: string
  region: 'Europe' | 'Asia' | 'North America' | 'Oceania' | 'Africa' | 'South America' | 'Middle East'
  costIndex: 1 | 2 | 3 | 4 | 5 // 1 is budget, 5 is ultra-luxury
  imageUrl: string
  description: string
}

export interface Activity {
  id: string
  cityId: string
  name: string
  category: 'Sightseeing' | 'Food' | 'Adventure' | 'Culture' | 'Stay' | 'Transport' | 'Nightlife'
  cost: number
  duration: string
  rating: number
  imageUrl: string
  description: string
}

export interface CommunityPost {
  id: string
  title: string
  authorName: string
  authorAvatar: string
  city: string
  citiesVisited: string[]
  durationDays: number
  likes: number
  copies: number
  image: string
  budget: number
  activities: {
    id: string
    name: string
    category: string
    cost: number
    duration: string
  }[]
}

export interface AdminStats {
  metrics: {
    totalUsers: number
    activeTrips: number
    totalItineraries: number
    revenueBudgetVolume: number
  }
  popularCities: { city: string; count: number; percentage: number }[]
  topActivities: { name: string; city: string; count: number; percentage: number }[]
  userGrowth: {
    '7days': { label: string; count: number }[]
    '30days': { label: string; count: number }[]
    '1year': { label: string; count: number }[]
  }
}

export const CITIES: City[] = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    costIndex: 4,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    description: 'The city of art, fashion, gastronomy, and the world-famous Eiffel Tower.'
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    costIndex: 4,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    description: 'A futuristic metropolis blended with traditional shrines and cherry blossom pathways.'
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'USA',
    region: 'North America',
    costIndex: 5,
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    description: 'The City That Never Sleeps, home to Broadway, Central Park, and soaring skyscrapers.'
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    costIndex: 3,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    description: 'An ancient empire carved in stone, featuring the Colosseum and historic piazzas.'
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    costIndex: 4,
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
    description: 'Iconic harborside Opera House, gorgeous surfing beaches, and endless sunshine.'
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    costIndex: 4,
    imageUrl: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=600&q=80',
    description: 'History merges with modern culture beside the River Thames and Big Ben.'
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    costIndex: 3,
    imageUrl: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80',
    description: 'Catalan capital famed for Gaudi architecture, beaches, and tapas.'
  },
  {
    id: 'cairo',
    name: 'Cairo',
    country: 'Egypt',
    region: 'Africa',
    costIndex: 2,
    imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=600&q=80',
    description: 'Gateway to the Great Pyramids of Giza, Sphinx, and the historic Nile River.'
  },
  {
    id: 'rio',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    region: 'South America',
    costIndex: 3,
    imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80',
    description: 'Vibrant city famous for Copacabana beach, Carnival, and Christ the Redeemer.'
  },
  {
    id: 'cape-town',
    name: 'Cape Town',
    country: 'South Africa',
    region: 'Africa',
    costIndex: 3,
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80',
    description: 'Stunning port city underneath the flat-topped Table Mountain.'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    costIndex: 5,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    description: 'Luxury shopping, ultramodern architecture, and a lively nightlife scene.'
  },
  {
    id: 'reykjavik',
    name: 'Reykjavik',
    country: 'Iceland',
    region: 'Europe',
    costIndex: 5,
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80',
    description: 'Gateway to waterfalls, thermal blue lagoons, and Northern Lights tours.'
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    region: 'Asia',
    costIndex: 3,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    description: 'Historic city known for thousands of classical Buddhist temples, gardens, and imperial palaces.'
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    region: 'Asia',
    costIndex: 2,
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80',
    description: 'Ornate shrines, street life, and shopping canals along the Chao Phraya River.'
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    country: 'USA',
    region: 'North America',
    costIndex: 4,
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80',
    description: 'Famed Golden Gate Bridge, cable cars, and tech-driven cultural districts.'
  }
]

export const ACTIVITIES: Activity[] = [
  // Paris (paris)
  {
    id: 'act-1',
    cityId: 'paris',
    name: 'Eiffel Tower Top Summit Access',
    category: 'Sightseeing',
    cost: 45,
    duration: '2 hours',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80',
    description: 'Ascend to the highest accessible platform of the tower with an expert guide.'
  },
  {
    id: 'act-2',
    cityId: 'paris',
    name: 'Louvre Museum Guided Masterpieces',
    category: 'Culture',
    cost: 65,
    duration: '3 hours',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=500&q=80',
    description: 'Explore the world\'s largest art museum and skip the ticket lines.'
  },
  {
    id: 'act-3',
    cityId: 'paris',
    name: 'Seine River Cruise & Dinner',
    category: 'Food',
    cost: 95,
    duration: '2.5 hours',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80',
    description: 'A 3-course French dinner on an glass boat floating down the Seine.'
  },
  {
    id: 'act-4',
    cityId: 'paris',
    name: 'Montmartre Secret Caves Exploration',
    category: 'Adventure',
    cost: 35,
    duration: '1.5 hours',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80',
    description: 'Stroll through bohemian steps and explore mysterious underground spaces.'
  },
  {
    id: 'act-5',
    cityId: 'paris',
    name: 'Hôtel Regina Louvre Stay',
    category: 'Stay',
    cost: 250,
    duration: '24 hours',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80',
    description: 'Boutique hotel luxury stay overlooking the Tuileries gardens.'
  },
  {
    id: 'act-6',
    cityId: 'paris',
    name: 'Eurostar High Speed Train',
    category: 'Transport',
    cost: 80,
    duration: '2.3 hours',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=500&q=80',
    description: 'High-speed transit connecting Paris Gare du Nord to London St Pancras.'
  },

  // Tokyo (tokyo)
  {
    id: 'act-7',
    cityId: 'tokyo',
    name: 'Shibuya Crossing Foodie Crawl',
    category: 'Food',
    cost: 55,
    duration: '3 hours',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80',
    description: 'Eat your way through Shibuya\'s neon-lit Izakayas and try fresh sushi.'
  },
  {
    id: 'act-8',
    cityId: 'tokyo',
    name: 'Senso-ji Temple & Asakusa Ride',
    category: 'Culture',
    cost: 20,
    duration: '2 hours',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=500&q=80',
    description: 'Explore historical Tokyo temples with rickshaw tour guides.'
  },
  {
    id: 'act-9',
    cityId: 'tokyo',
    name: 'Mount Fuji Forest Hike',
    category: 'Adventure',
    cost: 120,
    duration: '9 hours',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80',
    description: 'Hike Table mountain peaks and enjoy a ropeway over Lake Ashi.'
  },
  {
    id: 'act-10',
    cityId: 'tokyo',
    name: 'Park Hyatt Tokyo Deluxe Stay',
    category: 'Stay',
    cost: 450,
    duration: '24 hours',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=80',
    description: 'Skyline view stays popularized by the movie Lost in Translation.'
  },

  // New York (new-york)
  {
    id: 'act-11',
    cityId: 'new-york',
    name: 'Empire State Building Observatory',
    category: 'Sightseeing',
    cost: 48,
    duration: '1.5 hours',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500&q=80',
    description: '360 degree panoramic views of Manhattan skyline.'
  },
  {
    id: 'act-12',
    cityId: 'new-york',
    name: 'Broadway Show Standard Pass',
    category: 'Culture',
    cost: 110,
    duration: '2.5 hours',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80',
    description: 'Musical theater in the heart of Times Square.'
  },
  {
    id: 'act-13',
    cityId: 'new-york',
    name: 'Central Park Bicycle Tour',
    category: 'Adventure',
    cost: 30,
    duration: '2 hours',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500&q=80',
    description: 'Cycle around castles, fountains, and lakes.'
  },
  {
    id: 'act-14',
    cityId: 'new-york',
    name: 'Greenwich Village Jazz Tour',
    category: 'Nightlife',
    cost: 55,
    duration: '3 hours',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=500&q=80',
    description: 'Live performance and drinks inside underground historic clubs.'
  },

  // Rome (rome)
  {
    id: 'act-15',
    cityId: 'rome',
    name: 'Colosseum Gladiator Arena VIP',
    category: 'Sightseeing',
    cost: 38,
    duration: '3 hours',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=500&q=80',
    description: 'Gladiator entry gate and ruins of the Roman forum.'
  },
  {
    id: 'act-16',
    cityId: 'rome',
    name: 'Sistine Chapel Guided Tour',
    category: 'Culture',
    cost: 42,
    duration: '4 hours',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=500&q=80',
    description: 'Vatican museum galleries and Michelangelo masterpieces.'
  },
  {
    id: 'act-17',
    cityId: 'rome',
    name: 'Pasta & Tiramisu Making Class',
    category: 'Food',
    cost: 70,
    duration: '2.5 hours',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=500&q=80',
    description: 'Roll fresh dough and mix dessert with local Italian chefs.'
  },

  // Sydney (sydney)
  {
    id: 'act-18',
    cityId: 'sydney',
    name: 'Opera House Behind-the-Scenes',
    category: 'Culture',
    cost: 50,
    duration: '2 hours',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=500&q=80',
    description: 'Behind the stage details of the architectural gem.'
  },
  {
    id: 'act-19',
    cityId: 'sydney',
    name: 'Harbour Bridge Climb Adventure',
    category: 'Adventure',
    cost: 195,
    duration: '3.5 hours',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?auto=format&fit=crop&w=500&q=80',
    description: 'Scale the steel bridge for unmatched scenic lookouts.'
  },
  {
    id: 'act-20',
    cityId: 'sydney',
    name: 'Coogee Coastal Shoreline Hike',
    category: 'Adventure',
    cost: 10,
    duration: '3 hours',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=500&q=80',
    description: 'Coastal walk connecting Bondi cliffs and ocean pools.'
  },

  // Cairo (cairo)
  {
    id: 'act-21',
    cityId: 'cairo',
    name: 'Pyramids of Giza Guided Tour',
    category: 'Sightseeing',
    cost: 30,
    duration: '4 hours',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=500&q=80',
    description: 'Inspect the Great Pyramids and Sphinx with an Egyptologist.'
  },

  // Cape Town (cape-town)
  {
    id: 'act-22',
    cityId: 'cape-town',
    name: 'Table Mountain Aerial Cableway',
    category: 'Sightseeing',
    cost: 25,
    duration: '2 hours',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=500&q=80',
    description: 'Ride up Table mountain in rotating cabins for 360 degree outlooks.'
  },

  // Dubai (dubai)
  {
    id: 'act-23',
    cityId: 'dubai',
    name: 'Burj Khalifa Sky Deck Access',
    category: 'Sightseeing',
    cost: 65,
    duration: '2 hours',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=500&q=80',
    description: 'Visit level 148 of the world\'s tallest architectural marvel.'
  },
  {
    id: 'act-24',
    cityId: 'dubai',
    name: 'Red Dunes Desert Safari & BBQ',
    category: 'Adventure',
    cost: 80,
    duration: '6 hours',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=500&q=80',
    description: 'Dune bashing, camel riding, and a barbecue buffet in the desert.'
  },

  // Reykjavik (reykjavik)
  {
    id: 'act-25',
    cityId: 'reykjavik',
    name: 'Northern Lights Bus Hunt',
    category: 'Adventure',
    cost: 50,
    duration: '4 hours',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=500&q=80',
    description: 'Search for Aurora Borealis in the Icelandic countryside.'
  },
  {
    id: 'act-26',
    cityId: 'reykjavik',
    name: 'Blue Lagoon Spa Entrance',
    category: 'Sightseeing',
    cost: 85,
    duration: '3 hours',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=500&q=80',
    description: 'Relax in geothermally heated silica mud pools.'
  },

  // Kyoto (kyoto)
  {
    id: 'act-27',
    cityId: 'kyoto',
    name: 'Fushimi Inari Torii Gate Walk',
    category: 'Sightseeing',
    cost: 15,
    duration: '2.5 hours',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80',
    description: 'Hike through paths of thousands of vermilion shrine gates.'
  },

  // Bangkok (bangkok)
  {
    id: 'act-28',
    cityId: 'bangkok',
    name: 'Grand Palace Tour & Temples',
    category: 'Culture',
    cost: 25,
    duration: '3 hours',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=500&q=80',
    description: 'Spectacular gold palaces and the Temple of the Emerald Buddha.'
  },
  {
    id: 'act-29',
    cityId: 'bangkok',
    name: 'Street Food Gastronomy Crawl',
    category: 'Food',
    cost: 30,
    duration: '3 hours',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80',
    description: 'Taste authentic Pad Thai, Mango Sticky Rice, and Michelin-rated crab omelettes.'
  },

  // San Francisco (san-francisco)
  {
    id: 'act-30',
    cityId: 'san-francisco',
    name: 'Golden Gate Bridge Scenic Cruise',
    category: 'Sightseeing',
    cost: 38,
    duration: '1.5 hours',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=500&q=80',
    description: 'Sail under the bridge and around Alcatraz Island.'
  }
]

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'pub-1',
    title: 'Gourmet Paris & Rome Romancero',
    authorName: 'Clara Martin',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    city: 'Paris',
    citiesVisited: ['Paris', 'Rome'],
    durationDays: 10,
    likes: 312,
    copies: 48,
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
    budget: 4200,
    activities: [
      { id: 'act-1', name: 'Eiffel Tower Top Summit Access', category: 'Sightseeing', cost: 45, duration: '2 hours' },
      { id: 'act-3', name: 'Seine River Cruise & Dinner', category: 'Food', cost: 95, duration: '2.5 hours' },
      { id: 'act-15', name: 'Colosseum Gladiator Arena VIP', category: 'Sightseeing', cost: 38, duration: '3 hours' }
    ]
  },
  {
    id: 'pub-2',
    title: 'Ultramodern Tokyo Foodie Trail',
    authorName: 'Jin Kenji',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    city: 'Tokyo',
    citiesVisited: ['Tokyo'],
    durationDays: 5,
    likes: 204,
    copies: 87,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    budget: 2200,
    activities: [
      { id: 'act-7', name: 'Shibuya Crossing Foodie Crawl', category: 'Food', cost: 55, duration: '3 hours' },
      { id: 'act-10', name: 'Park Hyatt Tokyo Deluxe Stay', category: 'Stay', cost: 450, duration: '24 hours' }
    ]
  },
  {
    id: 'pub-3',
    title: 'Aussie Beaches & Coastal Hikes',
    authorName: 'Oliver Hughes',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    city: 'Sydney',
    citiesVisited: ['Sydney', 'Bondi'],
    durationDays: 8,
    likes: 124,
    copies: 19,
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
    budget: 3100,
    activities: [
      { id: 'act-18', name: 'Opera House Behind-the-Scenes', category: 'Culture', cost: 50, duration: '2 hours' },
      { id: 'act-19', name: 'Harbour Bridge Climb Adventure', category: 'Adventure', cost: 195, duration: '3.5 hours' }
    ]
  },
  {
    id: 'pub-4',
    title: 'Egypt Pyramids & Ancient Nile',
    authorName: 'Rami Amin',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
    city: 'Cairo',
    citiesVisited: ['Cairo'],
    durationDays: 6,
    likes: 156,
    copies: 33,
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=600&q=80',
    budget: 1800,
    activities: [
      { id: 'act-21', name: 'Pyramids of Giza Guided Tour', category: 'Sightseeing', cost: 30, duration: '4 hours' }
    ]
  },
  {
    id: 'pub-5',
    title: 'Icelandic Thermal Wonders',
    authorName: 'Birgir S.',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80',
    city: 'Reykjavik',
    citiesVisited: ['Reykjavik'],
    durationDays: 7,
    likes: 278,
    copies: 56,
    image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80',
    budget: 3900,
    activities: [
      { id: 'act-25', name: 'Northern Lights Bus Hunt', category: 'Adventure', cost: 50, duration: '4 hours' },
      { id: 'act-26', name: 'Blue Lagoon Spa Entrance', category: 'Sightseeing', cost: 85, duration: '3 hours' }
    ]
  },
  {
    id: 'pub-6',
    title: 'Red Dunes Safari & Luxury Dubai Stays',
    authorName: 'Yousef Al-M.',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
    city: 'Dubai',
    citiesVisited: ['Dubai'],
    durationDays: 6,
    likes: 188,
    copies: 29,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
    budget: 5200,
    activities: [
      { id: 'act-23', name: 'Burj Khalifa Sky Deck Access', category: 'Sightseeing', cost: 65, duration: '2 hours' },
      { id: 'act-24', name: 'Red Dunes Desert Safari & BBQ', category: 'Adventure', cost: 80, duration: '6 hours' }
    ]
  },
  {
    id: 'pub-7',
    title: 'Bangkok Floating Markets & Spices',
    authorName: 'Nisha P.',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    city: 'Bangkok',
    citiesVisited: ['Bangkok'],
    durationDays: 5,
    likes: 142,
    copies: 22,
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80',
    budget: 1500,
    activities: [
      { id: 'act-28', name: 'Grand Palace Tour & Temples', category: 'Culture', cost: 25, duration: '3 hours' },
      { id: 'act-29', name: 'Street Food Gastronomy Crawl', category: 'Food', cost: 30, duration: '3 hours' }
    ]
  },
  {
    id: 'pub-8',
    title: 'San Francisco Bay & Tech Hikes',
    authorName: 'Alex Mercer',
    authorAvatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=100&q=80',
    city: 'San Francisco',
    citiesVisited: ['San Francisco'],
    durationDays: 6,
    likes: 95,
    copies: 14,
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80',
    budget: 2900,
    activities: [
      { id: 'act-30', name: 'Golden Gate Bridge Scenic Cruise', category: 'Sightseeing', cost: 38, duration: '1.5 hours' }
    ]
  }
]

export const ADMIN_STATS: AdminStats = {
  metrics: {
    totalUsers: 1420,
    activeTrips: 842,
    totalItineraries: 3892,
    revenueBudgetVolume: 1250000
  },
  popularCities: [
    { city: 'Paris', count: 320, percentage: 38 },
    { city: 'Tokyo', count: 280, percentage: 33 },
    { city: 'New York', count: 210, percentage: 25 },
    { city: 'Rome', count: 180, percentage: 21 },
    { city: 'Sydney', count: 120, percentage: 14 }
  ],
  topActivities: [
    { name: 'Eiffel Tower Top Summit Access', city: 'Paris', count: 184, percentage: 92 },
    { name: 'Shibuya Crossing Foodie Crawl', city: 'Tokyo', count: 160, percentage: 86 },
    { name: 'Harbour Bridge Climb Adventure', city: 'Sydney', count: 142, percentage: 74 },
    { name: 'Colosseum Gladiator Arena VIP', city: 'Rome', count: 110, percentage: 68 }
  ],
  userGrowth: {
    '7days': [
      { label: 'Mon', count: 1410 },
      { label: 'Tue', count: 1412 },
      { label: 'Wed', count: 1415 },
      { label: 'Thu', count: 1416 },
      { label: 'Fri', count: 1418 },
      { label: 'Sat', count: 1420 },
      { label: 'Sun', count: 1420 }
    ],
    '30days': [
      { label: 'Week 1', count: 1380 },
      { label: 'Week 2', count: 1395 },
      { label: 'Week 3', count: 1410 },
      { label: 'Week 4', count: 1420 }
    ],
    '1year': [
      { label: 'MAR', count: 1100 },
      { label: 'APR', count: 1150 },
      { label: 'MAY', count: 1220 },
      { label: 'JUN', count: 1300 },
      { label: 'JUL', count: 1380 },
      { label: 'AUG', count: 1420 }
    ]
  }
}
