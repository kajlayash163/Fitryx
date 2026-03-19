-- Seed gyms with Jaipur, India data
INSERT INTO gyms (name, location, description, price_monthly, price_quarterly, price_yearly, facilities, rating, review_count, images, verified)
VALUES
  (
    'Gold''s Gym Malviya Nagar',
    'Malviya Nagar, Jaipur, Rajasthan',
    'The Mecca of Bodybuilding — 11,000 sq ft spread across 3 floors with elite training zones, Precor equipment, competition-grade benches, and experienced coaches. Perfect for serious lifters and beginners alike. Open 5:30 AM to 11 PM.',
    2999, 8397, 32988,
    ARRAY['Free Weights', 'Cardio', 'Personal Training', 'Locker Rooms', 'Water Cooler', 'Expert Coaches', 'Free Pass Available'],
    4.9, 342,
    ARRAY['/images/gym-1.jpg', '/images/gym-2.jpg', '/images/gym-3.jpg'],
    true
  ),
  (
    'Anytime Fitness Vaishali Nagar',
    'Vaishali Nagar, Jaipur, Rajasthan',
    '24/7 fitness facility with complete cardio equipment, free weights, strength training zones, yoga studio, and HIIT areas. Multiple class formats including Aerobics, Functional Training, Zumba, and personalized coaching available.',
    3199, 8957, 35388,
    ARRAY['24/7 Access', 'Cardio', 'Free Weights', 'Yoga', 'HIIT', 'Aerobics', 'Personal Training', 'Lockers'],
    4.7, 287,
    ARRAY['/images/gym-2.jpg', '/images/gym-3.jpg', '/images/gym-1.jpg'],
    true
  ),
  (
    'Corenergy Fitness Vaishali Nagar',
    'Vaishali Nagar, Jaipur, Rajasthan',
    'Founded by a physiotherapist, Corenergy provides state-of-the-art equipment with a focus on personalized training and injury prevention. 24/7 operation, professional staff, and therapeutic approach to fitness.',
    2799, 7797, 30786,
    ARRAY['24/7 Access', 'Strength Training', 'Cardio', 'Physiotherapy', 'Personal Training', 'Free Weights', 'Locker Rooms'],
    4.8, 256,
    ARRAY['/images/gym-3.jpg', '/images/gym-1.jpg', '/images/gym-2.jpg'],
    true
  ),
  (
    'The Shredded Club Gym & Spa',
    'Raja Park, Jaipur, Rajasthan',
    'Premium gym and spa facility with professional bodybuilding equipment, boxing ring, steam rooms, and full spa services. Limited-time offer: ₹3,000/month (regular ₹4,000). Premium atmosphere with expert trainers.',
    3000, 8400, 33000,
    ARRAY['Boxing', 'Strength Training', 'Spa', 'Steam Room', 'Personal Training', 'Cardio', 'Locker Rooms'],
    4.7, 219,
    ARRAY['/images/gym-1.jpg', '/images/gym-3.jpg', '/images/gym-2.jpg'],
    true
  ),
  (
    'Multifit Vaishali Nagar',
    'Vaishali Nagar, Jaipur, Rajasthan',
    'Modern fitness center with complete equipment range, group exercise classes, strength and conditioning programs, and experienced personal trainers. ISO certified facility with high-quality infrastructure.',
    3539, 9909, 39078,
    ARRAY['Cardio', 'Free Weights', 'Group Classes', 'Personal Training', 'Strength Training', 'Lockers', 'Air Conditioning'],
    4.6, 198,
    ARRAY['/images/gym-2.jpg', '/images/gym-1.jpg', '/images/gym-3.jpg'],
    true
  ),
  (
    'Innovana Fitness Labs C-Scheme',
    'C-Scheme, Jaipur, Rajasthan',
    'State-of-the-art fitness facility featuring multiple workout zones, diverse class offerings (Yoga, Dance, Strength), advanced equipment, and expert guidance. Premium membership includes nutrition consultation and flexible timings.',
    3299, 9237, 36288,
    ARRAY['Cardio', 'Strength Training', 'Yoga', 'Dance Fitness', 'Personal Training', 'Nutrition Coaching', 'Lockers'],
    4.8, 278,
    ARRAY['/images/gym-3.jpg', '/images/gym-2.jpg', '/images/gym-1.jpg'],
    true
  );
