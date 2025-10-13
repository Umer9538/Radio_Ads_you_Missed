import { PrismaClient } from '../src/generated/prisma'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create categories
  console.log('📁 Creating categories...')
  const categories = [
    { name: 'Retail', slug: 'retail', description: 'Shopping, fashion, and retail stores' },
    { name: 'Automotive', slug: 'automotive', description: 'Cars, motorcycles, and auto services' },
    { name: 'Food & Beverage', slug: 'food-beverage', description: 'Restaurants, cafes, and food services' },
    { name: 'Entertainment', slug: 'entertainment', description: 'Movies, concerts, and events' },
    { name: 'Services', slug: 'services', description: 'Professional and personal services' },
    { name: 'Real Estate', slug: 'real-estate', description: 'Property sales and rentals' },
    { name: 'Health & Beauty', slug: 'health-beauty', description: 'Wellness, fitness, and beauty services' },
    { name: 'Technology', slug: 'technology', description: 'Electronics, software, and tech services' },
    { name: 'Travel & Tourism', slug: 'travel-tourism', description: 'Travel agencies, hotels, and tourism' },
    { name: 'Events', slug: 'events', description: 'Special events and promotions' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        active: true,
      },
    })
  }
  console.log(`✅ Created ${categories.length} categories`)

  // Create New Zealand radio stations
  console.log('📻 Creating radio stations...')
  const stations = [
    {
      name: 'ZM',
      frequency: '91.0 FM',
      location: 'Auckland',
      description: 'Hit music station playing today\'s hottest hits',
      logoUrl: null,
      websiteUrl: 'https://www.iheart.co.nz/zm/',
    },
    {
      name: 'The Rock',
      frequency: '93.4 FM',
      location: 'Auckland',
      description: 'New Zealand\'s rock radio station',
      logoUrl: null,
      websiteUrl: 'https://www.therock.net.nz/',
    },
    {
      name: 'The Edge',
      frequency: '94.2 FM',
      location: 'Auckland',
      description: 'The best new music',
      logoUrl: null,
      websiteUrl: 'https://www.theedge.co.nz/',
    },
    {
      name: 'Newstalk ZB',
      frequency: '89.4 FM',
      location: 'Auckland',
      description: 'New Zealand\'s number one talk station',
      logoUrl: null,
      websiteUrl: 'https://www.newstalkzb.co.nz/',
    },
    {
      name: 'The Breeze',
      frequency: '98.4 FM',
      location: 'Auckland',
      description: 'More music you love',
      logoUrl: null,
      websiteUrl: 'https://www.thebreeze.co.nz/',
    },
    {
      name: 'Radio Hauraki',
      frequency: '99.0 FM',
      location: 'Auckland',
      description: 'Classic rock radio',
      logoUrl: null,
      websiteUrl: 'https://www.hauraki.co.nz/',
    },
    {
      name: 'More FM',
      frequency: '91.8 FM',
      location: 'Auckland',
      description: 'Great music, more variety',
      logoUrl: null,
      websiteUrl: 'https://www.morefm.co.nz/',
    },
    {
      name: 'Coast',
      frequency: '105.4 FM',
      location: 'Auckland',
      description: 'Feel good music',
      logoUrl: null,
      websiteUrl: 'https://www.coast.co.nz/',
    },
    {
      name: 'The Hits',
      frequency: '97.4 FM',
      location: 'Wellington',
      description: 'Playing the greatest hits',
      logoUrl: null,
      websiteUrl: 'https://www.thehits.co.nz/',
    },
    {
      name: 'Radio New Zealand',
      frequency: '101.4 FM',
      location: 'Wellington',
      description: 'Independent public service broadcaster',
      logoUrl: null,
      websiteUrl: 'https://www.rnz.co.nz/',
    },
  ]

  for (const station of stations) {
    await prisma.station.upsert({
      where: { name: station.name },
      update: {},
      create: {
        name: station.name,
        frequency: station.frequency,
        location: station.location,
        description: station.description,
        logoUrl: station.logoUrl,
        websiteUrl: station.websiteUrl,
        active: true,
      },
    })
  }
  console.log(`✅ Created ${stations.length} radio stations`)

  // Create admin user
  console.log('👤 Creating admin user...')
  const adminPassword = await hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@radioadsmissed.co.nz' },
    update: {},
    create: {
      email: 'admin@radioadsmissed.co.nz',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Created admin user (email: admin@radioadsmissed.co.nz, password: admin123)')

  // Create demo user
  console.log('👤 Creating demo user...')
  const demoPassword = await hash('demo123', 10)

  await prisma.user.upsert({
    where: { email: 'demo@radioadsmissed.co.nz' },
    update: {},
    create: {
      email: 'demo@radioadsmissed.co.nz',
      password: demoPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: 'USER',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Created demo user (email: demo@radioadsmissed.co.nz, password: demo123)')

  // Create sample ads
  console.log('📢 Creating sample advertisements...')

  const retailCategory = await prisma.category.findUnique({ where: { slug: 'retail' } })
  const foodCategory = await prisma.category.findUnique({ where: { slug: 'food-beverage' } })
  const zmStation = await prisma.station.findUnique({ where: { name: 'ZM' } })
  const theRockStation = await prisma.station.findUnique({ where: { name: 'The Rock' } })

  if (retailCategory && zmStation) {
    const ad1 = await prisma.ad.create({
      data: {
        title: 'Big Summer Sale at The Warehouse',
        description: 'Huge discounts on everything! Up to 50% off selected items. Limited time only.',
        brand: 'The Warehouse',
        product: 'Summer Sale',
        stationId: zmStation.id,
        categoryId: retailCategory.id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Sample audio
        duration: 30,
        airDate: new Date(),
        status: 'PUBLISHED',
        publishedAt: new Date(),
        tags: JSON.stringify(['sale', 'discount', 'summer']),
        playCount: 0,
      },
    })

    await prisma.offer.create({
      data: {
        adId: ad1.id,
        title: '50% Off Summer Clothing',
        description: 'Get 50% off all summer clothing range at The Warehouse. Valid until end of February.',
        terms: 'Valid on selected items only. Cannot be combined with other offers.',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        redemptionType: 'CODE',
        redemptionValue: 'SUMMER50',
        active: true,
        discountPercent: 50,
      },
    })
  }

  if (foodCategory && theRockStation) {
    const ad2 = await prisma.ad.create({
      data: {
        title: 'McDonald\'s $5 Meal Deal',
        description: 'Get a Big Mac, medium fries, and a drink for just $5. Available now!',
        brand: 'McDonald\'s',
        product: '$5 Meal Deal',
        stationId: theRockStation.id,
        categoryId: foodCategory.id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Sample audio
        duration: 20,
        airDate: new Date(),
        status: 'PUBLISHED',
        publishedAt: new Date(),
        tags: JSON.stringify(['food', 'fast-food', 'deal']),
        playCount: 0,
      },
    })

    await prisma.offer.create({
      data: {
        adId: ad2.id,
        title: '$5 Meal Deal',
        description: 'Enjoy a Big Mac meal for only $5. Valid at all participating McDonald\'s locations.',
        terms: 'One per customer per visit. Available at participating restaurants only.',
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        redemptionType: 'IN_STORE',
        active: true,
        discountAmount: 7.0,
        originalPrice: 12.0,
      },
    })
  }

  console.log('✅ Created sample ads with offers')

  console.log('🎉 Database seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   - Categories: ${categories.length}`)
  console.log(`   - Stations: ${stations.length}`)
  console.log(`   - Users: 2 (admin + demo)`)
  console.log(`   - Sample Ads: 2`)
  console.log(`   - Offers: 2`)
  console.log('\n🔐 Login Credentials:')
  console.log('   Admin: admin@radioadsmissed.co.nz / admin123')
  console.log('   Demo:  demo@radioadsmissed.co.nz / demo123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
