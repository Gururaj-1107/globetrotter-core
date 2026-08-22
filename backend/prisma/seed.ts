import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting GlobeTrotter database seeding...')

  // 1. Seed Users
  const passwordHash = await bcrypt.hash('password123', 10)
  const adminPasswordHash = await bcrypt.hash('admin123', 10)

  const alex = await prisma.user.upsert({
    where: { email: 'traveler@globetrotter.com' },
    update: {},
    create: {
      id: 'usr-demo-wanderer',
      email: 'traveler@globetrotter.com',
      passwordHash,
      authProvider: 'EMAIL_PASSWORD',
      firstName: 'Alex',
      lastName: 'Rivers',
      phoneNumber: '+1 555-019-2834',
      city: 'San Francisco',
      country: 'USA',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      bio: 'Passionate globetrotter, mountain hiker, and cultural explorer seeking authentic local experiences.',
      role: 'USER'
    }
  })

  const clara = await prisma.user.upsert({
    where: { email: 'admin@globetrotter.com' },
    update: {},
    create: {
      id: 'usr-demo-admin',
      email: 'admin@globetrotter.com',
      passwordHash: adminPasswordHash,
      authProvider: 'EMAIL_PASSWORD',
      firstName: 'Clara',
      lastName: 'Martin',
      phoneNumber: '+1 555-432-8765',
      city: 'London',
      country: 'UK',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      bio: 'GlobeTrotter Lead Operations & City Curator.',
      role: 'ADMIN'
    }
  })

  const rahul = await prisma.user.upsert({
    where: { email: 'rahul@gmail.com' },
    update: {},
    create: {
      id: 'usr-google-demo',
      email: 'rahul@gmail.com',
      authProvider: 'GOOGLE',
      googleId: 'google-oauth-1092837461',
      firstName: 'Rahul',
      lastName: 'Sharma',
      phoneNumber: '+91 98765 43210',
      city: 'Mumbai',
      country: 'India',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Exploring Asia and Europe one city at a time.',
      role: 'USER'
    }
  })

  console.log('✅ Users seeded: Alex (Traveler), Clara (Admin), Rahul (Google User)')

  // 2. Seed Cities
  const citiesData = [
    {
      id: 'paris',
      name: 'Paris',
      country: 'France',
      region: 'Europe',
      costIndex: 4,
      popularityScore: 98,
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      description: 'The city of art, fashion, gastronomy, and the world-famous Eiffel Tower.'
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      country: 'Japan',
      region: 'Asia',
      costIndex: 4,
      popularityScore: 96,
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80',
      description: 'A futuristic metropolis blended with traditional shrines and cherry blossom pathways.'
    },
    {
      id: 'new-york',
      name: 'New York',
      country: 'USA',
      region: 'North America',
      costIndex: 5,
      popularityScore: 95,
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
      description: 'The City That Never Sleeps, home to Broadway, Central Park, and soaring skyscrapers.'
    },
    {
      id: 'rome',
      name: 'Rome',
      country: 'Italy',
      region: 'Europe',
      costIndex: 3,
      popularityScore: 92,
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
      description: 'An ancient empire carved in stone, featuring the Colosseum and historic piazzas.'
    },
    {
      id: 'sydney',
      name: 'Sydney',
      country: 'Australia',
      region: 'Oceania',
      costIndex: 4,
      popularityScore: 90,
      imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
      description: 'A sun-drenched coastal haven renowned for its iconic Opera House and surfing beaches.'
    },
    {
      id: 'bali',
      name: 'Bali',
      country: 'Indonesia',
      region: 'Asia',
      costIndex: 2,
      popularityScore: 94,
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      description: 'Island of the Gods, featuring terraced emerald rice fields and serene volcanic beaches.'
    },
    {
      id: 'marrakech',
      name: 'Marrakech',
      country: 'Morocco',
      region: 'Africa',
      costIndex: 2,
      popularityScore: 88,
      imageUrl: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80',
      description: 'A magical sensory maze of spiced aromas, vibrant souks, and historic riads.'
    },
    {
      id: 'kyoto',
      name: 'Kyoto',
      country: 'Japan',
      region: 'Asia',
      costIndex: 3,
      popularityScore: 93,
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      description: 'Ancient temples, torii gates, falling cherry blossom petals, and geisha traditions.'
    }
  ]

  for (const city of citiesData) {
    await prisma.city.upsert({
      where: { id: city.id },
      update: city,
      create: city
    })
  }

  console.log(`✅ ${citiesData.length} Cities seeded`)

  // 3. Seed Activities
  const activitiesData = [
    // Paris
    { id: 'par-1', cityId: 'paris', name: 'Eiffel Tower Summit Access', category: 'Sightseeing', cost: 45, duration: '2 hours', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', description: 'Experience breathtaking panoramic views from the very top of Paris.' },
    { id: 'par-2', cityId: 'paris', name: 'Louvre Museum Guided Tour', category: 'Culture', cost: 65, duration: '3 hours', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80', description: 'Skip the lines and explore the Mona Lisa and classic Venus de Milo.' },
    { id: 'par-3', cityId: 'paris', name: 'Seine River Cruise & 3-Course Dinner', category: 'Food', cost: 95, duration: '2.5 hours', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1549146473-3c971f9412c3?auto=format&fit=crop&w=600&q=80', description: 'Dine on French gourmet cuisine while floating past illuminated historical monuments.' },
    { id: 'par-4', cityId: 'paris', name: 'Montmartre Bohemian Artists Walk', category: 'Culture', cost: 25, duration: '2 hours', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1509060464153-4466739f78ad?auto=format&fit=crop&w=600&q=80', description: 'Walk through cobble-stone alleys and discover the Sacré-Cœur basilica.' },
    
    // Tokyo
    { id: 'tok-1', cityId: 'tokyo', name: 'Shibuya Crossing & Foodie Walk', category: 'Food', cost: 55, duration: '3 hours', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=600&q=80', description: 'Cross the busiest intersection in the world and taste Michelin-rated yakitori.' },
    { id: 'tok-2', cityId: 'tokyo', name: 'Senso-ji Temple & Historic Asakusa', category: 'Culture', cost: 20, duration: '2 hours', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', description: 'Discover Tokyo’s oldest Buddhist shrine and traditional Nakamise shopping arcade.' },
    { id: 'tok-3', cityId: 'tokyo', name: 'Mount Fuji Day Trip & Hakone Cable Car', category: 'Adventure', cost: 120, duration: '8 hours', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', description: 'Panoramic vistas of the sacred volcano with Lake Ashi cruise.' },

    // New York
    { id: 'nyc-1', cityId: 'new-york', name: 'Empire State Observatory 86th Floor', category: 'Sightseeing', cost: 48, duration: '1.5 hours', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80', description: 'Take in iconic open-air 360-degree views of the Manhattan skyline.' },
    { id: 'nyc-2', cityId: 'new-york', name: 'Broadway Musical Premier Ticket', category: 'Culture', cost: 110, duration: '2.5 hours', rating: 5.0, imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80', description: 'Award-winning theatrical performances in the heart of Times Square.' },

    // Rome
    { id: 'rom-1', cityId: 'rome', name: 'Colosseum Gladiator Arena & Roman Forum', category: 'Culture', cost: 38, duration: '3 hours', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80', description: 'Walk through ancient gladiatorial arenas and ruins of the Roman Empire.' }
  ]

  for (const act of activitiesData) {
    await prisma.activity.upsert({
      where: { id: act.id },
      update: act,
      create: act
    })
  }

  console.log(`✅ ${activitiesData.length} Activities seeded`)

  // 4. Seed Trips with Sections and Activities
  const parisTrip = await prisma.trip.upsert({
    where: { id: 'trip-ongoing-1' },
    update: {},
    create: {
      id: 'trip-ongoing-1',
      userId: alex.id,
      title: 'Paris Summer Exploration',
      city: 'Paris',
      startDate: new Date('2026-08-15'),
      endDate: new Date('2026-08-22'),
      budget: 3500,
      totalEstimatedBudget: 3200,
      status: 'ONGOING',
      themes: ['Sightseeing', 'Food'],
      coverImageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      isPublic: true
    }
  })

  // 5. Seed Community Posts
  const communityPosts = [
    {
      id: 'post-1',
      authorName: 'Priya M.',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      title: '10 Days in Japan — Cherry Blossom Season',
      city: 'Tokyo',
      citiesVisited: ['Tokyo', 'Kyoto', 'Osaka'],
      durationDays: 10,
      budget: 3800,
      likes: 342,
      copies: 89,
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'post-2',
      authorName: 'Carlos R.',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      title: 'Greek Islands Hopping & Mediterranean Coast',
      city: 'Athens',
      citiesVisited: ['Athens', 'Santorini', 'Mykonos'],
      durationDays: 14,
      budget: 4500,
      likes: 511,
      copies: 134,
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80'
    }
  ]

  for (const post of communityPosts) {
    await prisma.communityPost.upsert({
      where: { id: post.id },
      update: post,
      create: post
    })
  }

  console.log('✅ Community posts seeded')
  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
