/**
 * Seed script untuk populate database dengan sample Dragon Nest items
 * Run: npx ts-node scripts/seed-items.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  {
    name: 'Senjata',
    slug: 'senjata',
    description: 'Berbagai macam senjata untuk meningkatkan damage',
    image: 'https://via.placeholder.com/200?text=Senjata',
  },
  {
    name: 'Armor',
    slug: 'armor',
    description: 'Perlengkapan pertahanan untuk meningkatkan defense',
    image: 'https://via.placeholder.com/200?text=Armor',
  },
  {
    name: 'Aksesoris',
    slug: 'aksesoris',
    description: 'Aksesoris untuk berbagai slot karakter',
    image: 'https://via.placeholder.com/200?text=Aksesoris',
  },
  {
    name: 'Konsumsi',
    slug: 'konsumsi',
    description: 'Item konsumsi untuk membantu pertempuran',
    image: 'https://via.placeholder.com/200?text=Konsumsi',
  },
]

const sampleItems = [
  // Senjata
  {
    name: 'Pedang Besi Klasik',
    slug: 'pedang-besi-klasik',
    description: 'Pedang besi berkualitas tinggi dengan desain klasik. Cocok untuk pemula.',
    shortDescription: 'Pedang besi klasik dengan damage baik',
    categoryName: 'Senjata',
    price: 50000,
    originalPrice: 75000,
    discount: 33,
    stock: 15,
    rarity: 'common',
    levelRequirement: 1,
    classRequirement: 'Warrior',
    specs: JSON.stringify([
      { label: 'Damage', value: '45-55' },
      { label: 'Kecepatan Serangan', value: '1.0x' },
      { label: 'Berat', value: '15kg' },
    ]),
    mainImage: 'https://via.placeholder.com/300?text=Pedang+Besi',
    galleryImages: JSON.stringify([
      'https://via.placeholder.com/300?text=Pedang+1',
      'https://via.placeholder.com/300?text=Pedang+2',
    ]),
    isOnSale: true,
    isFeatured: true,
  },
  {
    name: 'Pedang Api Legendaris',
    slug: 'pedang-api-legendaris',
    description: 'Pedang legendaris berselimut api yang dapat menghasilkan damage tambahan. Item langka.',
    shortDescription: 'Pedang legendaris dengan efek api',
    categoryName: 'Senjata',
    price: 500000,
    originalPrice: 750000,
    discount: 33,
    stock: 3,
    rarity: 'legendary',
    levelRequirement: 50,
    classRequirement: 'Warrior',
    specs: JSON.stringify([
      { label: 'Damage', value: '250-300' },
      { label: 'Fire Damage', value: '+50%' },
      { label: 'Kecepatan Serangan', value: '1.5x' },
      { label: 'Efek', value: 'Burn 5 detik' },
    ]),
    mainImage: 'https://via.placeholder.com/300?text=Pedang+Api',
    galleryImages: JSON.stringify([
      'https://via.placeholder.com/300?text=Pedang+Api+1',
      'https://via.placeholder.com/300?text=Pedang+Api+2',
    ]),
    isOnSale: true,
    isFeatured: true,
  },
  {
    name: 'Busur Perak',
    slug: 'busur-perak',
    description: 'Busur berkualitas tinggi yang presisi dan cepat.',
    shortDescription: 'Busur perak presisi tinggi',
    categoryName: 'Senjata',
    price: 60000,
    originalPrice: null,
    discount: 0,
    stock: 8,
    rarity: 'uncommon',
    levelRequirement: 10,
    classRequirement: 'Archer',
    specs: JSON.stringify([
      { label: 'Damage', value: '40-50' },
      { label: 'Critical', value: '15%' },
      { label: 'Kecepatan Serangan', value: '1.2x' },
    ]),
    mainImage: 'https://via.placeholder.com/300?text=Busur+Perak',
    galleryImages: JSON.stringify([]),
    isOnSale: false,
    isFeatured: false,
  },

  // Armor
  {
    name: 'Baju Besi Pemula',
    slug: 'baju-besi-pemula',
    description: 'Baju besi dasar untuk pemula yang ingin meningkatkan pertahanan.',
    shortDescription: 'Baju besi dasar dengan defense 30',
    categoryName: 'Armor',
    price: 40000,
    originalPrice: 50000,
    discount: 20,
    stock: 25,
    rarity: 'common',
    levelRequirement: 1,
    classRequirement: 'Warrior',
    specs: JSON.stringify([
      { label: 'Defense', value: '30' },
      { label: 'HP Bonus', value: '+50' },
      { label: 'Durability', value: '100/100' },
    ]),
    mainImage: 'https://via.placeholder.com/300?text=Baju+Besi',
    galleryImages: JSON.stringify([]),
    isOnSale: true,
    isFeatured: false,
  },
  {
    name: 'Armor Kristal Suci',
    slug: 'armor-kristal-suci',
    description: 'Armor epik dengan proteksi magis yang kuat. Ideal untuk tank yang menghadapi serangan magic.',
    shortDescription: 'Armor epik dengan magic resistance',
    categoryName: 'Armor',
    price: 300000,
    originalPrice: 400000,
    discount: 25,
    stock: 5,
    rarity: 'epic',
    levelRequirement: 40,
    classRequirement: 'Warrior,Paladin',
    specs: JSON.stringify([
      { label: 'Defense', value: '150' },
      { label: 'Magic Resistance', value: '+40%' },
      { label: 'HP Bonus', value: '+300' },
      { label: 'Durability', value: '200/200' },
    ]),
    mainImage: 'https://via.placeholder.com/300?text=Armor+Kristal',
    galleryImages: JSON.stringify([]),
    isOnSale: true,
    isFeatured: true,
  },

  // Aksesoris
  {
    name: 'Cincin Kekuatan',
    slug: 'cincin-kekuatan',
    description: 'Cincin yang meningkatkan kekuatan dan damage output. Essential untuk DPS class.',
    shortDescription: 'Cincin dengan bonus damage +20',
    categoryName: 'Aksesoris',
    price: 80000,
    originalPrice: 100000,
    discount: 20,
    stock: 20,
    rarity: 'rare',
    levelRequirement: 20,
    classRequirement: '',
    specs: JSON.stringify([
      { label: 'Damage', value: '+20' },
      { label: 'Critical', value: '+5%' },
      { label: 'Slot', value: 'Ring' },
    ]),
    mainImage: 'https://via.placeholder.com/300?text=Cincin',
    galleryImages: JSON.stringify([]),
    isOnSale: true,
    isFeatured: false,
  },
  {
    name: 'Kalung Kehidupan',
    slug: 'kalung-kehidupan',
    description: 'Kalung yang meningkatkan HP secara signifikan. Wajib dimiliki untuk survival.',
    shortDescription: 'Kalung dengan bonus HP +100',
    categoryName: 'Aksesoris',
    price: 75000,
    originalPrice: null,
    discount: 0,
    stock: 12,
    rarity: 'uncommon',
    levelRequirement: 15,
    classRequirement: '',
    specs: JSON.stringify([
      { label: 'HP', value: '+100' },
      { label: 'Regeneration', value: '+5 per detik' },
      { label: 'Slot', value: 'Neck' },
    ]),
    mainImage: 'https://via.placeholder.com/300?text=Kalung',
    galleryImages: JSON.stringify([]),
    isOnSale: false,
    isFeatured: false,
  },
  {
    name: 'Perhiasan Mistis Kosmik',
    slug: 'perhiasan-mistis-kosmik',
    description: 'Perhiasan legendaris yang meningkatkan semua stat secara signifikan. Rarity tertinggi.',
    shortDescription: 'Perhiasan legendaris all-stats+',
    categoryName: 'Aksesoris',
    price: 1000000,
    originalPrice: 1500000,
    discount: 33,
    stock: 1,
    rarity: 'legendary',
    levelRequirement: 60,
    classRequirement: '',
    specs: JSON.stringify([
      { label: 'All Stats', value: '+50' },
      { label: 'Critical', value: '+20%' },
      { label: 'Defense', value: '+100' },
      { label: 'HP', value: '+300' },
    ]),
    mainImage: 'https://via.placeholder.com/300?text=Perhiasan+Mistis',
    galleryImages: JSON.stringify([]),
    isOnSale: true,
    isFeatured: true,
  },

  // Konsumsi
  {
    name: 'Potion Hp Merah',
    slug: 'potion-hp-merah',
    description: 'Potion untuk memulihkan HP sebesar 100. Item consumable yang bisa digunakan berkali-kali.',
    shortDescription: 'Potion restore HP 100',
    categoryName: 'Konsumsi',
    price: 5000,
    originalPrice: null,
    discount: 0,
    stock: 100,
    rarity: 'common',
    levelRequirement: 1,
    classRequirement: '',
    specs: JSON.stringify([
      { label: 'Effect', value: 'Restore 100 HP' },
      { label: 'Cooldown', value: '3 detik' },
      { label: 'Durability', value: 'Single Use' },
    ]),
    mainImage: 'https://via.placeholder.com/300?text=Potion+HP',
    galleryImages: JSON.stringify([]),
    isOnSale: false,
    isFeatured: false,
  },
  {
    name: 'Potion Mana Biru',
    slug: 'potion-mana-biru',
    description: 'Potion untuk memulihkan Mana/SP sebesar 150. Essential untuk skill-based class.',
    shortDescription: 'Potion restore Mana 150',
    categoryName: 'Konsumsi',
    price: 6000,
    originalPrice: null,
    discount: 0,
    stock: 80,
    rarity: 'common',
    levelRequirement: 1,
    classRequirement: '',
    specs: JSON.stringify([
      { label: 'Effect', value: 'Restore 150 Mana' },
      { label: 'Cooldown', value: '5 detik' },
      { label: 'Durability', value: 'Single Use' },
    ]),
    mainImage: 'https://via.placeholder.com/300?text=Potion+Mana',
    galleryImages: JSON.stringify([]),
    isOnSale: false,
    isFeatured: false,
  },
  {
    name: 'Buff Damage Emas',
    slug: 'buff-damage-emas',
    description: 'Buff yang meningkatkan damage sebesar 50% selama 30 detik. Cocok untuk farming atau PVP.',
    shortDescription: 'Buff damage +50% selama 30s',
    categoryName: 'Konsumsi',
    price: 15000,
    originalPrice: 20000,
    discount: 25,
    stock: 40,
    rarity: 'uncommon',
    levelRequirement: 10,
    classRequirement: '',
    specs: JSON.stringify([
      { label: 'Effect', value: 'Damage +50%' },
      { label: 'Duration', value: '30 detik' },
      { label: 'Cooldown', value: '60 detik' },
    ]),
    mainImage: 'https://via.placeholder.com/300?text=Buff+Damage',
    galleryImages: JSON.stringify([]),
    isOnSale: true,
    isFeatured: false,
  },
]

// Sample reviews
const sampleReviews = [
  {
    author: 'PlayerKece123',
    rating: 5,
    title: 'Sangat puas dengan kualitasnya',
    content: 'Item ini sangat bagus dan sesuai dengan deskripsi. Pengiriman cepat dan packaging rapi.',
  },
  {
    author: 'GamerProo',
    rating: 4,
    title: 'Bagus tapi sedikit mahal',
    content: 'Kualitas bagus tapi harganya agak premium. Namun performa itemnya tidak mengecewakan.',
  },
  {
    author: 'NoobPemula',
    rating: 5,
    title: 'Rekomendasi untuk pemula',
    content: 'Item ini sangat cocok untuk pemula seperti saya. Mudah digunakan dan damage cukup baik.',
  },
  {
    author: 'VeteranDN',
    rating: 4,
    title: 'Worth it untuk progression',
    content: 'Good item untuk mid-game progression. Tidak terlalu OP tapi cukup membantu farming.',
  },
  {
    author: 'CasualPlayer',
    rating: 5,
    title: 'Best item ever!',
    content: 'Ini item terbaik yang pernah saya beli. Damage tinggi dan duran baik sekali!',
  },
]

async function main() {
  try {
    console.log('🌱 Starting to seed database...')

    // Create categories
    console.log('📁 Creating categories...')
    const createdCategories = []
    for (const cat of categories) {
      const category = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: {
          ...cat,
          sortOrder: categories.indexOf(cat),
          isActive: true,
        },
      })
      createdCategories.push(category)
      console.log(`   ✓ ${category.name}`)
    }

    // Create items
    console.log('🏠 Creating items...')
    let itemCount = 0
    for (const item of sampleItems) {
      const category = createdCategories.find(c => c.name === item.categoryName)
      if (!category) {
        console.error(`   ✗ Category not found: ${item.categoryName}`)
        continue
      }

      const createdItem = await prisma.item.upsert({
        where: { slug: item.slug },
        update: {},
        create: {
          ...item,
          categoryId: category.id,
          rating: 4.5,
          reviewCount: 5,
          views: Math.floor(Math.random() * 1000) + 100,
          purchases: Math.floor(Math.random() * 50) + 5,
          isActive: true,
          isDraft: false,
        },
      })

      // Add sample reviews
      for (let i = 0; i < 3; i++) {
        const review = sampleReviews[i]
        await prisma.review.create({
          data: {
            itemId: createdItem.id,
            author: review.author,
            rating: review.rating,
            title: review.title,
            content: review.content,
            isApproved: true,
          },
        })
      }

      itemCount++
      console.log(`   ✓ ${createdItem.name}`)
    }

    console.log(`\n✅ Seeding completed!`)
    console.log(`   - Created ${createdCategories.length} categories`)
    console.log(`   - Created ${itemCount} items`)
    console.log(`   - Created ${itemCount * 3} reviews`)
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
