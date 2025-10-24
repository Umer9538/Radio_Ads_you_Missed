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
  const automotiveCategory = await prisma.category.findUnique({ where: { slug: 'automotive' } })
  const entertainmentCategory = await prisma.category.findUnique({ where: { slug: 'entertainment' } })
  const healthCategory = await prisma.category.findUnique({ where: { slug: 'health-beauty' } })
  const technologyCategory = await prisma.category.findUnique({ where: { slug: 'technology' } })

  const zmStation = await prisma.station.findUnique({ where: { name: 'ZM' } })
  const theRockStation = await prisma.station.findUnique({ where: { name: 'The Rock' } })
  const theEdgeStation = await prisma.station.findUnique({ where: { name: 'The Edge' } })
  const moreFMStation = await prisma.station.findUnique({ where: { name: 'More FM' } })
  const coastStation = await prisma.station.findUnique({ where: { name: 'Coast' } })

  const adsData = []

  // Retail Ads
  if (retailCategory && zmStation) {
    const ad1 = await prisma.ad.create({
      data: {
        title: 'Big Summer Sale at The Warehouse',
        description: 'Huge discounts on everything! Up to 50% off selected items. Limited time only.',
        brand: 'The Warehouse',
        product: 'Summer Sale',
        stationId: zmStation.id,
        categoryId: retailCategory.id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: 30,
        airDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'PUBLISHED',
        publishedAt: new Date(),
        tags: JSON.stringify(['sale', 'discount', 'summer']),
        playCount: 124,
      },
    })
    adsData.push(ad1)

    await prisma.offer.create({
      data: {
        adId: ad1.id,
        title: '50% Off Summer Clothing',
        description: 'Get 50% off all summer clothing range at The Warehouse. Valid until end of February.',
        terms: 'Valid on selected items only. Cannot be combined with other offers.',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        redemptionType: 'CODE',
        redemptionValue: 'SUMMER50',
        active: true,
        discountPercent: 50,
      },
    })
  }

  if (retailCategory && theEdgeStation) {
    const ad2 = await prisma.ad.create({
      data: {
        title: 'Farmers Boxing Day Sale Extended',
        description: 'The biggest sale of the year continues! Storewide discounts on fashion, homewares, and more.',
        brand: 'Farmers',
        product: 'Boxing Day Sale',
        stationId: theEdgeStation.id,
        categoryId: retailCategory.id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: 25,
        airDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'PUBLISHED',
        publishedAt: new Date(),
        tags: JSON.stringify(['sale', 'boxing-day', 'fashion']),
        playCount: 89,
      },
    })
    adsData.push(ad2)

    await prisma.offer.create({
      data: {
        adId: ad2.id,
        title: 'Extra 20% Off Sale Items',
        description: 'Take an extra 20% off already reduced sale items.',
        terms: 'Excludes beauty and fragrances. While stocks last.',
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        redemptionType: 'IN_STORE',
        active: true,
        discountPercent: 20,
      },
    })
  }

  // Food & Beverage Ads
  if (foodCategory && theRockStation) {
    const ad3 = await prisma.ad.create({
      data: {
        title: 'McDonald\'s $5 Meal Deal',
        description: 'Get a Big Mac, medium fries, and a drink for just $5. Available now!',
        brand: 'McDonald\'s',
        product: '$5 Meal Deal',
        stationId: theRockStation.id,
        categoryId: foodCategory.id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration: 20,
        airDate: new Date(),
        status: 'PUBLISHED',
        publishedAt: new Date(),
        tags: JSON.stringify(['food', 'fast-food', 'deal']),
        playCount: 256,
      },
    })
    adsData.push(ad3)

    await prisma.offer.create({
      data: {
        adId: ad3.id,
        title: '$5 Meal Deal',
        description: 'Enjoy a Big Mac meal for only $5. Valid at all participating McDonald\'s locations.',
        terms: 'One per customer per visit. Available at participating restaurants only.',
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        redemptionType: 'IN_STORE',
        active: true,
        discountAmount: 7.0,
        originalPrice: 12.0,
      },
    })
  }

  if (foodCategory && zmStation) {
    const ad4 = await prisma.ad.create({
      data: {
        title: 'Domino\'s 2 for Tuesday',
        description: 'Get 2 pizzas for the price of 1 every Tuesday! Choose from any large pizzas.',
        brand: 'Domino\'s Pizza',
        product: '2 for Tuesday Special',
        stationId: zmStation.id,
        categoryId: foodCategory.id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        duration: 30,
        airDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'PUBLISHED',
        publishedAt: new Date(),
        tags: JSON.stringify(['pizza', 'deal', 'tuesday']),
        playCount: 178,
      },
    })
    adsData.push(ad4)

    await prisma.offer.create({
      data: {
        adId: ad4.id,
        title: '2 for 1 Pizza Deal',
        description: 'Buy one large pizza, get another free every Tuesday.',
        terms: 'Valid on Tuesdays only. Online orders only. Excludes premium pizzas.',
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        redemptionType: 'URL',
        redemptionValue: 'https://www.dominos.co.nz/deals',
        active: true,
        discountPercent: 50,
      },
    })
  }

  // Automotive Ads
  if (automotiveCategory && theRockStation) {
    const ad5 = await prisma.ad.create({
      data: {
        title: 'Repco End of Year Clearance',
        description: 'Massive savings on car parts, tools, and accessories. Stock up before they\'re gone!',
        brand: 'Repco',
        product: 'Clearance Sale',
        stationId: theRockStation.id,
        categoryId: automotiveCategory.id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        duration: 25,
        airDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'PUBLISHED',
        publishedAt: new Date(),
        tags: JSON.stringify(['automotive', 'tools', 'clearance']),
        playCount: 67,
      },
    })
    adsData.push(ad5)

    await prisma.offer.create({
      data: {
        adId: ad5.id,
        title: 'Up to 60% Off Selected Items',
        description: 'Clearance on selected car parts, tools, and accessories.',
        terms: 'While stocks last. Selected items only.',
        expiryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        redemptionType: 'IN_STORE',
        active: true,
        discountPercent: 60,
      },
    })
  }

  // Entertainment Ads
  if (entertainmentCategory && theEdgeStation) {
    const ad6 = await prisma.ad.create({
      data: {
        title: 'Reading Cinemas Family Passes',
        description: 'Get a family pass for just $40! Perfect for the school holidays.',
        brand: 'Reading Cinemas',
        product: 'Family Pass',
        stationId: theEdgeStation.id,
        categoryId: entertainmentCategory.id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        duration: 30,
        airDate: new Date(),
        status: 'PUBLISHED',
        publishedAt: new Date(),
        tags: JSON.stringify(['cinema', 'family', 'entertainment']),
        playCount: 145,
      },
    })
    adsData.push(ad6)

    await prisma.offer.create({
      data: {
        adId: ad6.id,
        title: 'Family Pass - 2 Adults + 2 Kids',
        description: 'Includes movie tickets and popcorn combo for the family.',
        terms: 'Valid Monday to Thursday only. Excludes public holidays and school holidays.',
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        redemptionType: 'URL',
        redemptionValue: 'https://www.readingcinemas.co.nz/deals',
        active: true,
        discountAmount: 20.0,
        originalPrice: 60.0,
      },
    })
  }

  // Health & Beauty Ads
  if (healthCategory && moreFMStation) {
    const ad7 = await prisma.ad.create({
      data: {
        title: 'Fitness First New Year Special',
        description: 'Join now and get 50% off your first 3 months! No joining fee.',
        brand: 'Fitness First',
        product: 'Gym Membership',
        stationId: moreFMStation.id,
        categoryId: healthCategory.id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        duration: 30,
        airDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'PUBLISHED',
        publishedAt: new Date(),
        tags: JSON.stringify(['fitness', 'gym', 'health']),
        playCount: 93,
      },
    })
    adsData.push(ad7)

    await prisma.offer.create({
      data: {
        adId: ad7.id,
        title: '50% Off First 3 Months',
        description: 'New members get half price membership for the first 3 months.',
        terms: '12-month contract required. Selected clubs only.',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        redemptionType: 'URL',
        redemptionValue: 'https://www.fitnessfirst.co.nz/join',
        active: true,
        discountPercent: 50,
      },
    })
  }

  // Technology Ads
  if (technologyCategory && coastStation) {
    const ad8 = await prisma.ad.create({
      data: {
        title: 'JB Hi-Fi Tech Sale',
        description: 'Unbeatable prices on TVs, laptops, phones, and gaming gear. Don\'t miss out!',
        brand: 'JB Hi-Fi',
        product: 'Tech Sale',
        stationId: coastStation.id,
        categoryId: technologyCategory.id,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        duration: 25,
        airDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        status: 'PUBLISHED',
        publishedAt: new Date(),
        tags: JSON.stringify(['technology', 'electronics', 'sale']),
        playCount: 211,
      },
    })
    adsData.push(ad8)

    await prisma.offer.create({
      data: {
        adId: ad8.id,
        title: 'Save Up to $500 on Selected Tech',
        description: 'Huge discounts on laptops, TVs, and gaming consoles.',
        terms: 'Selected models only. While stocks last.',
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        redemptionType: 'IN_STORE',
        active: true,
        discountAmount: 500.0,
      },
    })
  }

  console.log(`✅ Created ${adsData.length} sample ads with offers`)

  console.log('🎉 Database seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   - Categories: ${categories.length}`)
  console.log(`   - Stations: ${stations.length}`)
  console.log(`   - Users: 2 (admin + demo)`)
  console.log(`   - Sample Ads: ${adsData.length}`)
  console.log(`   - Offers: ${adsData.length}`)
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
