import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envContent = readFileSync(resolve(__dirname, '..', '.env'), 'utf-8')
const dbUrl = envContent.split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const sql = neon(dbUrl)

async function main() {
  console.log('Seeding gyms via JS array...');

  // Update existing 6 gyms
  await sql`UPDATE gyms SET city='Jaipur', gender_type='unisex', opening_hours='5:30 AM - 10:30 PM', women_safety_rating=4.2, phone='+91-141-2601001' WHERE id=1`;
  await sql`UPDATE gyms SET city='Jaipur', gender_type='unisex', opening_hours='6:00 AM - 11:00 PM', women_safety_rating=4.5, phone='+91-141-2602002' WHERE id=2`;
  await sql`UPDATE gyms SET city='Jaipur', gender_type='unisex', opening_hours='5:00 AM - 10:00 PM', women_safety_rating=4.0, phone='+91-141-2603003' WHERE id=3`;
  await sql`UPDATE gyms SET city='Jaipur', gender_type='unisex', opening_hours='6:00 AM - 10:00 PM', women_safety_rating=3.8, phone='+91-141-2604004' WHERE id=4`;
  await sql`UPDATE gyms SET city='Jaipur', gender_type='unisex', opening_hours='5:00 AM - 11:00 PM', women_safety_rating=4.3, phone='+91-141-2605005' WHERE id=5`;
  await sql`UPDATE gyms SET city='Jaipur', gender_type='unisex', opening_hours='6:00 AM - 10:30 PM', women_safety_rating=4.1, phone='+91-141-2606006' WHERE id=6`;

  // Insert 12 new gyms
  const newGyms = [
    {
      name: 'Fitness First Tonk Road',
      location: 'Tonk Road, Near Durgapura Railway Station, Jaipur',
      description: 'One of Jaipurs most popular gym chains with state-of-the-art equipment, certified trainers, and a spacious workout area. Features separate cardio and strength zones with premium Technogym equipment.',
      price_monthly: 2500, price_quarterly: 6500, price_yearly: 22000,
      facilities: ['Cardio Zone', 'Strength', 'Personal Training', 'Locker', 'Parking', 'Cycling', 'Zumba'],
      rating: 4.3, review_count: 187, images: ['/images/gym-1.jpg', '/images/gym-2.jpg'], verified: true,
      gender_type: 'unisex', women_safety_rating: 4.4, opening_hours: '5:00 AM - 11:00 PM', city: 'Jaipur', phone: '+91-98290-11001'
    },
    {
      name: 'Abs Fitness Club',
      location: 'Mansarovar, Near Shipra Path, Jaipur',
      description: 'A well-established fitness club known for its clean environment and experienced trainers. Offers group classes, personal training, and a wide range of functional training equipment.',
      price_monthly: 2200, price_quarterly: 5800, price_yearly: 20000,
      facilities: ['Cardio Zone', 'Strength', 'Yoga', 'CrossFit', 'Personal Training', 'Locker'],
      rating: 4.1, review_count: 142, images: ['/images/gym-2.jpg', '/images/gym-3.jpg'], verified: true,
      gender_type: 'unisex', women_safety_rating: 4.2, opening_hours: '5:30 AM - 10:30 PM', city: 'Jaipur', phone: '+91-98290-22002'
    },
    {
      name: 'Jerai Fitness Hub',
      location: 'Sodala, Ajmer Road, Jaipur',
      description: 'Jerai is a fast-growing gym brand with modern equipment and a vibrant community. Known for excellent CrossFit sessions and group workouts. Clean locker rooms and friendly staff.',
      price_monthly: 1999, price_quarterly: 5200, price_yearly: 18000,
      facilities: ['CrossFit', 'Strength', 'Cardio Zone', 'Parking', 'Locker', 'Boxing'],
      rating: 4.0, review_count: 98, images: ['/images/gym-3.jpg', '/images/gym-1.jpg'], verified: true,
      gender_type: 'unisex', women_safety_rating: 3.9, opening_hours: '6:00 AM - 10:00 PM', city: 'Jaipur', phone: '+91-98290-33003'
    },
    {
      name: 'Muscle Factory Gym',
      location: 'Pratap Nagar, Sanganer, Jaipur',
      description: 'A hardcore gym for serious lifters. Features heavy-duty squat racks, deadlift platforms, and a strong bodybuilding community. Budget-friendly pricing with no compromise on equipment quality.',
      price_monthly: 1500, price_quarterly: 3800, price_yearly: 14000,
      facilities: ['Strength', 'Cardio Zone', 'Parking', 'Locker'],
      rating: 3.9, review_count: 76, images: ['/images/gym-1.jpg', '/images/gym-2.jpg'], verified: false,
      gender_type: 'men_only', women_safety_rating: null, opening_hours: '5:00 AM - 10:00 PM', city: 'Jaipur', phone: '+91-98290-44004'
    },
    {
      name: 'Yog Power International',
      location: 'Vidhyadhar Nagar, Sector 6, Jaipur',
      description: 'Premium yoga and fitness studio combining traditional yoga practices with modern gym equipment. Features aerial yoga, power yoga, and meditation sessions alongside a full gym setup.',
      price_monthly: 2800, price_quarterly: 7500, price_yearly: 28000,
      facilities: ['Yoga', 'Cardio Zone', 'Strength', 'Pool', 'Sauna', 'Personal Training', 'Parking', 'Locker'],
      rating: 4.6, review_count: 234, images: ['/images/gym-2.jpg', '/images/gym-3.jpg'], verified: true,
      gender_type: 'unisex', women_safety_rating: 4.8, opening_hours: '5:00 AM - 9:00 PM', city: 'Jaipur', phone: '+91-98290-55005'
    },
    {
      name: 'OSlim Fitness Studio',
      location: 'Jagatpura, Near Malviya Nagar, Jaipur',
      description: 'An exclusive women-only fitness studio with female trainers, private workout areas, and a supportive community. Specializes in weight loss programs, Zumba, and functional training for women.',
      price_monthly: 1800, price_quarterly: 4800, price_yearly: 17000,
      facilities: ['Cardio Zone', 'Zumba', 'Yoga', 'Personal Training', 'Locker'],
      rating: 4.4, review_count: 156, images: ['/images/gym-3.jpg', '/images/gym-1.jpg'], verified: true,
      gender_type: 'women_only', women_safety_rating: 5.0, opening_hours: '6:00 AM - 8:00 PM', city: 'Jaipur', phone: '+91-98290-66006'
    },
    {
      name: 'F45 Training Jaipur',
      location: 'Bani Park, Near Collectorate Circle, Jaipur',
      description: 'International fitness franchise offering 45-minute functional HIIT workouts. Known for innovative circuit-based training, team environment, and technology-driven workout tracking.',
      price_monthly: 5000, price_quarterly: 13000, price_yearly: 48000,
      facilities: ['CrossFit', 'Cardio Zone', 'Personal Training', 'Locker', 'Parking', 'Cycling'],
      rating: 4.7, review_count: 89, images: ['/images/gym-1.jpg', '/images/gym-3.jpg'], verified: true,
      gender_type: 'unisex', women_safety_rating: 4.6, opening_hours: '5:30 AM - 9:30 PM', city: 'Jaipur', phone: '+91-98290-77007'
    },
    {
      name: 'Xtreme Fitness',
      location: 'Sanganer, Near Airport Road, Jaipur',
      description: 'Budget-friendly gym with all the essentials. Clean environment, basic cardio and strength equipment, ideal for beginners and intermediate fitness enthusiasts.',
      price_monthly: 1200, price_quarterly: 3000, price_yearly: 11000,
      facilities: ['Strength', 'Cardio Zone', 'Parking'],
      rating: 3.6, review_count: 54, images: ['/images/gym-2.jpg', '/images/gym-1.jpg'], verified: false,
      gender_type: 'unisex', women_safety_rating: 3.5, opening_hours: '6:00 AM - 10:00 PM', city: 'Jaipur', phone: '+91-98290-88008'
    },
    {
      name: 'Iron Paradise Gym',
      location: 'Nirman Nagar, D Block, Jaipur',
      description: 'A serious gym for powerlifters and bodybuilders. Features competition-grade equipment, chalk-friendly zones, and experienced spotters. Regularly hosts local powerlifting meets.',
      price_monthly: 1499, price_quarterly: 3900, price_yearly: 14500,
      facilities: ['Strength', 'Cardio Zone', 'Boxing', 'Parking', 'Locker'],
      rating: 4.2, review_count: 112, images: ['/images/gym-3.jpg', '/images/gym-2.jpg'], verified: true,
      gender_type: 'men_only', women_safety_rating: null, opening_hours: '5:00 AM - 11:00 PM', city: 'Jaipur', phone: '+91-98290-99009'
    },
    {
      name: 'FitBuzz Gym & Spa',
      location: 'Lal Kothi, Near Tonk Road, Jaipur',
      description: 'Premium gym and spa combination in the heart of Jaipur. Features luxury amenities including steam room, sauna, post-workout spa treatments, and a health cafe. Top-tier equipment from Life Fitness.',
      price_monthly: 3500, price_quarterly: 9000, price_yearly: 35000,
      facilities: ['Cardio Zone', 'Strength', 'Pool', 'Sauna', 'Yoga', 'Personal Training', 'Locker', 'Parking', 'Cycling'],
      rating: 4.5, review_count: 198, images: ['/images/gym-1.jpg', '/images/gym-2.jpg', '/images/gym-3.jpg'], verified: true,
      gender_type: 'unisex', women_safety_rating: 4.7, opening_hours: '5:00 AM - 11:00 PM', city: 'Jaipur', phone: '+91-98290-10010'
    },
    {
      name: 'Body Craft Gym',
      location: 'Ajmer Road, Near Panchsheel Circle, Jaipur',
      description: 'Mid-range gym with consistent quality. Offers a balanced mix of cardio, strength, and group classes. Known for clean facilities and helpful staff. Good for families.',
      price_monthly: 1999, price_quarterly: 5200, price_yearly: 19000,
      facilities: ['Strength', 'Cardio Zone', 'Yoga', 'Zumba', 'Locker', 'Parking'],
      rating: 4.0, review_count: 87, images: ['/images/gym-2.jpg', '/images/gym-3.jpg'], verified: true,
      gender_type: 'unisex', women_safety_rating: 4.3, opening_hours: '6:00 AM - 10:00 PM', city: 'Jaipur', phone: '+91-98290-20020'
    },
    {
      name: 'SheFit Studio',
      location: 'C-Scheme, Near Prithviraj Road, Jaipur',
      description: 'Jaipurs premier women-only fitness studio with all-female staff. Offers specialized programs for weight loss, PCOS management, prenatal/postnatal fitness, and self-defense classes. Safe, supportive, and empowering.',
      price_monthly: 2200, price_quarterly: 5800, price_yearly: 21000,
      facilities: ['Cardio Zone', 'Yoga', 'Zumba', 'Personal Training', 'Locker', 'Cycling'],
      rating: 4.8, review_count: 267, images: ['/images/gym-3.jpg', '/images/gym-1.jpg'], verified: true,
      gender_type: 'women_only', women_safety_rating: 5.0, opening_hours: '6:00 AM - 8:30 PM', city: 'Jaipur', phone: '+91-98290-30030'
    }
  ];

  for (const gym of newGyms) {
    try {
      await sql`
        INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, rating, review_count, images, verified, gender_type, women_safety_rating, opening_hours, city, phone)
        VALUES (
          ${gym.name}, ${gym.location}, ${gym.description}, ${gym.price_monthly}, ${gym.price_quarterly}, ${gym.price_yearly},
          ${gym.facilities}, ${gym.rating}, ${gym.review_count}, ${gym.images}, ${gym.verified}, ${gym.gender_type},
          ${gym.women_safety_rating}, ${gym.opening_hours}, ${gym.city}, ${gym.phone}
        )
      `;
      console.log(`[OK] Inserted ${gym.name}`);
    } catch(e) {
      console.error(`[FAIL] ${gym.name}: ${e.message}`);
    }
  }

  const count = await sql`SELECT count(*) FROM gyms`;
  console.log(`TOTAL GYMS IN DB NOW: ${count[0].count}`);
}

main().catch(console.error).finally(() => process.exit(0))
