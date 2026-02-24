const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        const admin = await User.findOne({ role: 'admin' }) || await User.findOne({});
        if (!admin) {
            console.error('No user found to assign products to.');
            process.exit(1);
        }

        const newProducts = [
            {
                user: admin._id,
                name: 'CloudRunner Pro Sneaker',
                image: '/Users/sachinkumar/.gemini/antigravity/brain/e0a40097-b444-41cb-b2c7-8cfe22635074/sneaker_air_max_1771958670007.png',
                brand: 'Aether',
                category: 'Shoes',
                description: 'Next-generation athletic performance meets urban style. Breathable mesh and reactive cushioning.',
                rating: 0,
                numReviews: 0,
                price: 12900,
                countInStock: 25,
            },
            {
                user: admin._id,
                name: 'Heritage Oxford Browns',
                image: '/Users/sachinkumar/.gemini/antigravity/brain/e0a40097-b444-41cb-b2c7-8cfe22635074/formal_shoe_oxford_1771958684405.png',
                brand: 'Edward Green',
                category: 'Shoes',
                description: 'Timeless elegance in premium Italian leather. Hand-stitched for ultimate durability and comfort.',
                rating: 0,
                numReviews: 0,
                price: 45000,
                countInStock: 10,
            },
            {
                user: admin._id,
                name: 'The Art of Modern Coding',
                image: '/Users/sachinkumar/.gemini/antigravity/brain/e0a40097-b444-41cb-b2c7-8cfe22635074/coding_book_modern_1771958702953.png',
                brand: 'O\'Reilly',
                category: 'Books',
                description: 'Master the principles of software engineering in the AI era. A deep dive into scalable architecture.',
                rating: 0,
                numReviews: 0,
                price: 2499,
                countInStock: 50,
            },
            {
                user: admin._id,
                name: 'Midnight in the Garden',
                image: '/Users/sachinkumar/.gemini/antigravity/brain/e0a40097-b444-41cb-b2c7-8cfe22635074/fiction_book_midnight_1771958719637.png',
                brand: 'A.J. Finn',
                category: 'Books',
                description: 'A gripping atmospheric thriller that explores the shadows of a silent suburban neighborhood.',
                rating: 0,
                numReviews: 0,
                price: 1299,
                countInStock: 30,
            }
        ];

        await Product.insertMany(newProducts);
        console.log('Shoes and Books collections seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedProducts();
