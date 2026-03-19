-- Seed 12 new Jaipur gyms with gender type, women safety, opening hours, city, phone

-- Update existing 6 gyms with the new columns
UPDATE gyms SET city = 'Jaipur', gender_type = 'unisex', opening_hours = '5:30 AM - 10:30 PM', women_safety_rating = 4.2, phone = '+91-141-2601001' WHERE id = 1;
UPDATE gyms SET city = 'Jaipur', gender_type = 'unisex', opening_hours = '6:00 AM - 11:00 PM', women_safety_rating = 4.5, phone = '+91-141-2602002' WHERE id = 2;
UPDATE gyms SET city = 'Jaipur', gender_type = 'unisex', opening_hours = '5:00 AM - 10:00 PM', women_safety_rating = 4.0, phone = '+91-141-2603003' WHERE id = 3;
UPDATE gyms SET city = 'Jaipur', gender_type = 'unisex', opening_hours = '6:00 AM - 10:00 PM', women_safety_rating = 3.8, phone = '+91-141-2604004' WHERE id = 4;
UPDATE gyms SET city = 'Jaipur', gender_type = 'unisex', opening_hours = '5:00 AM - 11:00 PM', women_safety_rating = 4.3, phone = '+91-141-2605005' WHERE id = 5;
UPDATE gyms SET city = 'Jaipur', gender_type = 'unisex', opening_hours = '6:00 AM - 10:30 PM', women_safety_rating = 4.1, phone = '+91-141-2606006' WHERE id = 6;

-- New gym 7: Fitness First Tonk Road
INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, rating, review_count, images, verified, gender_type, women_safety_rating, opening_hours, city, phone)
VALUES (
  'Fitness First Tonk Road',
  'Tonk Road, Near Durgapura Railway Station, Jaipur',
  'One of Jaipur''s most popular gym chains with state-of-the-art equipment, certified trainers, and a spacious workout area. Features separate cardio and strength zones with premium Technogym equipment.',
  2500, 6500, 22000,
  ARRAY['Cardio Zone', 'Strength', 'Personal Training', 'Locker', 'Parking', 'Cycling', 'Zumba'],
  4.3, 187,
  ARRAY['/images/gym-1.jpg', '/images/gym-2.jpg'],
  true, 'unisex', 4.4, '5:00 AM - 11:00 PM', 'Jaipur', '+91-98290-11001'
);

-- New gym 8: Abs Fitness Club Mansarovar
INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, rating, review_count, images, verified, gender_type, women_safety_rating, opening_hours, city, phone)
VALUES (
  'Abs Fitness Club',
  'Mansarovar, Near Shipra Path, Jaipur',
  'A well-established fitness club known for its clean environment and experienced trainers. Offers group classes, personal training, and a wide range of functional training equipment.',
  2200, 5800, 20000,
  ARRAY['Cardio Zone', 'Strength', 'Yoga', 'CrossFit', 'Personal Training', 'Locker'],
  4.1, 142,
  ARRAY['/images/gym-2.jpg', '/images/gym-3.jpg'],
  true, 'unisex', 4.2, '5:30 AM - 10:30 PM', 'Jaipur', '+91-98290-22002'
);

-- New gym 9: Jerai Fitness Hub Sodala
INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, rating, review_count, images, verified, gender_type, women_safety_rating, opening_hours, city, phone)
VALUES (
  'Jerai Fitness Hub',
  'Sodala, Ajmer Road, Jaipur',
  'Jerai is a fast-growing gym brand with modern equipment and a vibrant community. Known for excellent CrossFit sessions and group workouts. Clean locker rooms and friendly staff.',
  1999, 5200, 18000,
  ARRAY['CrossFit', 'Strength', 'Cardio Zone', 'Parking', 'Locker', 'Boxing'],
  4.0, 98,
  ARRAY['/images/gym-3.jpg', '/images/gym-1.jpg'],
  true, 'unisex', 3.9, '6:00 AM - 10:00 PM', 'Jaipur', '+91-98290-33003'
);

-- New gym 10: Muscle Factory Pratap Nagar
INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, rating, review_count, images, verified, gender_type, women_safety_rating, opening_hours, city, phone)
VALUES (
  'Muscle Factory Gym',
  'Pratap Nagar, Sanganer, Jaipur',
  'A hardcore gym for serious lifters. Features heavy-duty squat racks, deadlift platforms, and a strong bodybuilding community. Budget-friendly pricing with no compromise on equipment quality.',
  1500, 3800, 14000,
  ARRAY['Strength', 'Cardio Zone', 'Parking', 'Locker'],
  3.9, 76,
  ARRAY['/images/gym-1.jpg', '/images/gym-2.jpg'],
  false, 'men_only', NULL, '5:00 AM - 10:00 PM', 'Jaipur', '+91-98290-44004'
);

-- New gym 11: Yog Power International Vidhyadhar Nagar
INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, rating, review_count, images, verified, gender_type, women_safety_rating, opening_hours, city, phone)
VALUES (
  'Yog Power International',
  'Vidhyadhar Nagar, Sector 6, Jaipur',
  'Premium yoga and fitness studio combining traditional yoga practices with modern gym equipment. Features aerial yoga, power yoga, and meditation sessions alongside a full gym setup.',
  2800, 7500, 28000,
  ARRAY['Yoga', 'Cardio Zone', 'Strength', 'Pool', 'Sauna', 'Personal Training', 'Parking', 'Locker'],
  4.6, 234,
  ARRAY['/images/gym-2.jpg', '/images/gym-3.jpg'],
  true, 'unisex', 4.8, '5:00 AM - 9:00 PM', 'Jaipur', '+91-98290-55005'
);

-- New gym 12: OSlim Fitness Studio Jagatpura (Women Only)
INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, rating, review_count, images, verified, gender_type, women_safety_rating, opening_hours, city, phone)
VALUES (
  'OSlim Fitness Studio',
  'Jagatpura, Near Malviya Nagar, Jaipur',
  'An exclusive women-only fitness studio with female trainers, private workout areas, and a supportive community. Specializes in weight loss programs, Zumba, and functional training for women.',
  1800, 4800, 17000,
  ARRAY['Cardio Zone', 'Zumba', 'Yoga', 'Personal Training', 'Locker'],
  4.4, 156,
  ARRAY['/images/gym-3.jpg', '/images/gym-1.jpg'],
  true, 'women_only', 5.0, '6:00 AM - 8:00 PM', 'Jaipur', '+91-98290-66006'
);

-- New gym 13: F45 Training Bani Park
INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, rating, review_count, images, verified, gender_type, women_safety_rating, opening_hours, city, phone)
VALUES (
  'F45 Training Jaipur',
  'Bani Park, Near Collectorate Circle, Jaipur',
  'International fitness franchise offering 45-minute functional HIIT workouts. Known for innovative circuit-based training, team environment, and technology-driven workout tracking.',
  5000, 13000, 48000,
  ARRAY['CrossFit', 'CardioZone', 'Personal Training', 'Locker', 'Parking', 'Cycling'],
  4.7, 89,
  ARRAY['/images/gym-1.jpg', '/images/gym-3.jpg'],
  true, 'unisex', 4.6, '5:30 AM - 9:30 PM', 'Jaipur', '+91-98290-77007'
);

-- New gym 14: Xtreme Fitness Sanganer
INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, rating, review_count, images, verified, gender_type, women_safety_rating, opening_hours, city, phone)
VALUES (
  'Xtreme Fitness',
  'Sanganer, Near Airport Road, Jaipur',
  'Budget-friendly gym with all the essentials. Clean environment, basic cardio and strength equipment, ideal for beginners and intermediate fitness enthusiasts.',
  1200, 3000, 11000,
  ARRAY['Strength', 'Cardio Zone', 'Parking'],
  3.6, 54,
  ARRAY['/images/gym-2.jpg', '/images/gym-1.jpg'],
  false, 'unisex', 3.5, '6:00 AM - 10:00 PM', 'Jaipur', '+91-98290-88008'
);

-- New gym 15: Iron Paradise Nirman Nagar
INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, rating, review_count, images, verified, gender_type, women_safety_rating, opening_hours, city, phone)
VALUES (
  'Iron Paradise Gym',
  'Nirman Nagar, D Block, Jaipur',
  'A serious gym for powerlifters and bodybuilders. Features competition-grade equipment, chalk-friendly zones, and experienced spotters. Regularly hosts local powerlifting meets.',
  1499, 3900, 14500,
  ARRAY['Strength', 'Cardio Zone', 'Boxing', 'Parking', 'Locker'],
  4.2, 112,
  ARRAY['/images/gym-3.jpg', '/images/gym-2.jpg'],
  true, 'men_only', NULL, '5:00 AM - 11:00 PM', 'Jaipur', '+91-98290-99009'
);

-- New gym 16: FitBuzz Gym & Spa Lal Kothi
INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, rating, review_count, images, verified, gender_type, women_safety_rating, opening_hours, city, phone)
VALUES (
  'FitBuzz Gym & Spa',
  'Lal Kothi, Near Tonk Road, Jaipur',
  'Premium gym and spa combination in the heart of Jaipur. Features luxury amenities including steam room, sauna, post-workout spa treatments, and a health cafe. Top-tier equipment from Life Fitness.',
  3500, 9000, 35000,
  ARRAY['Cardio Zone', 'Strength', 'Pool', 'Sauna', 'Yoga', 'Personal Training', 'Locker', 'Parking', 'Cycling'],
  4.5, 198,
  ARRAY['/images/gym-1.jpg', '/images/gym-2.jpg', '/images/gym-3.jpg'],
  true, 'unisex', 4.7, '5:00 AM - 11:00 PM', 'Jaipur', '+91-98290-10010'
);

-- New gym 17: Body Craft Gym Ajmer Road
INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, rating, review_count, images, verified, gender_type, women_safety_rating, opening_hours, city, phone)
VALUES (
  'Body Craft Gym',
  'Ajmer Road, Near Panchsheel Circle, Jaipur',
  'Mid-range gym with consistent quality. Offers a balanced mix of cardio, strength, and group classes. Known for clean facilities and helpful staff. Good for families.',
  1999, 5200, 19000,
  ARRAY['Strength', 'Cardio Zone', 'Yoga', 'Zumba', 'Locker', 'Parking'],
  4.0, 87,
  ARRAY['/images/gym-2.jpg', '/images/gym-3.jpg'],
  true, 'unisex', 4.3, '6:00 AM - 10:00 PM', 'Jaipur', '+91-98290-20020'
);

-- New gym 18: SheFit Studio (Women Only) C-Scheme
INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, rating, review_count, images, verified, gender_type, women_safety_rating, opening_hours, city, phone)
VALUES (
  'SheFit Studio',
  'C-Scheme, Near Prithviraj Road, Jaipur',
  'Jaipur''s premier women-only fitness studio with all-female staff. Offers specialized programs for weight loss, PCOS management, prenatal/postnatal fitness, and self-defense classes. Safe, supportive, and empowering.',
  2200, 5800, 21000,
  ARRAY['Cardio Zone', 'Yoga', 'Zumba', 'Personal Training', 'Locker', 'Cycling'],
  4.8, 267,
  ARRAY['/images/gym-3.jpg', '/images/gym-1.jpg'],
  true, 'women_only', 5.0, '6:00 AM - 8:30 PM', 'Jaipur', '+91-98290-30030'
);
