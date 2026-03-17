require('dotenv').config();
const { sequelize, User, Pet } = require('./models');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log('✅ Database synced (force)');

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@petadopt.com',
      password: 'admin123',
      role: 'admin',
      phone: '1234567890',
    });

    // Create regular user
    await User.create({
      name: 'John Doe',
      email: 'user@petadopt.com',
      password: 'user123',
      role: 'user',
      phone: '9876543210',
      address: '123 Main St, Springfield',
    });

    console.log('✅ Users created');

    // Create sample pets
    const pets = [
      { name: 'Buddy', species: 'dog', breed: 'Golden Retriever', age: 2, ageUnit: 'years', gender: 'male', size: 'large', color: 'Golden', description: 'Friendly and playful Golden Retriever who loves fetch and cuddles.', status: 'available', vaccinated: true, neutered: true, photoUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500' },
      { name: 'Luna', species: 'cat', breed: 'Siamese', age: 3, ageUnit: 'years', gender: 'female', size: 'small', color: 'Cream & Brown', description: 'Elegant Siamese cat with striking blue eyes. Very affectionate and vocal.', status: 'available', vaccinated: true, neutered: true, photoUrl: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=500' },
      { name: 'Max', species: 'dog', breed: 'German Shepherd', age: 4, ageUnit: 'years', gender: 'male', size: 'large', color: 'Black & Tan', description: 'Intelligent and loyal German Shepherd. Great with kids and other pets.', status: 'available', vaccinated: true, neutered: false, photoUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500' },
      { name: 'Bella', species: 'cat', breed: 'Persian', age: 5, ageUnit: 'years', gender: 'female', size: 'medium', color: 'White', description: 'Fluffy Persian cat who loves quiet environments and lap time.', status: 'available', vaccinated: true, neutered: true, photoUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500' },
      { name: 'Charlie', species: 'dog', breed: 'Beagle', age: 1, ageUnit: 'years', gender: 'male', size: 'medium', color: 'Tricolor', description: 'Energetic young Beagle with a great nose for adventure!', status: 'available', vaccinated: true, neutered: false, photoUrl: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=500' },
      { name: 'Milo', species: 'rabbit', breed: 'Holland Lop', age: 8, ageUnit: 'months', gender: 'male', size: 'small', color: 'Gray', description: 'Adorable Holland Lop with floppy ears. Very gentle and easy to handle.', status: 'available', vaccinated: false, neutered: false, photoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500' },
      { name: 'Coco', species: 'bird', breed: 'Cockatiel', age: 2, ageUnit: 'years', gender: 'female', size: 'small', color: 'Gray & Yellow', description: 'Cheerful Cockatiel who loves to sing and interact with people.', status: 'available', vaccinated: false, neutered: false, photoUrl: 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=500' },
      { name: 'Rocky', species: 'dog', breed: 'Labrador Retriever', age: 3, ageUnit: 'years', gender: 'male', size: 'large', color: 'Black', description: 'Energetic Labrador who loves swimming and outdoor adventures.', status: 'available', vaccinated: true, neutered: true, photoUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=500' },
      { name: 'Daisy', species: 'dog', breed: 'Poodle', age: 6, ageUnit: 'years', gender: 'female', size: 'medium', color: 'White', description: 'Intelligent and hypoallergenic Poodle. Perfect for apartment living.', status: 'available', vaccinated: true, neutered: true, photoUrl: 'https://images.unsplash.com/photo-1560743641-3914f2c45636?w=500' },
      { name: 'Oliver', species: 'cat', breed: 'Maine Coon', age: 4, ageUnit: 'years', gender: 'male', size: 'large', color: 'Brown Tabby', description: 'Majestic Maine Coon with a thick coat. Dog-like personality, loves to follow you around.', status: 'available', vaccinated: true, neutered: true, photoUrl: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=500' },
      { name: 'Zoe', species: 'hamster', breed: 'Syrian Hamster', age: 6, ageUnit: 'months', gender: 'female', size: 'small', color: 'Golden', description: 'Cute and active Syrian hamster. Great starter pet for children.', status: 'available', vaccinated: false, neutered: false, photoUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=500' },
      { name: 'Leo', species: 'cat', breed: 'Tabby', age: 2, ageUnit: 'years', gender: 'male', size: 'medium', color: 'Orange Tabby', description: 'Playful orange tabby who gets along great with dogs and kids.', status: 'available', vaccinated: true, neutered: true, photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500' },
    ];

    await Pet.bulkCreate(pets);
    console.log('✅ Pets created');
    console.log('\n🌱 Seed complete!');
    console.log('Admin login: admin@petadopt.com / admin123');
    console.log('User login:  user@petadopt.com / user123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
