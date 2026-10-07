const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({ email: 'test@example.com' });
        console.log(users);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUsers();
