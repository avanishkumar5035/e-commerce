const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const testPlaceOrder = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({});
        if (!user) {
            console.log('No user found');
            return;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', {
            expiresIn: '30d',
        });

        const payload = {
            orderItems: [
                {
                    name: "Test Product",
                    qty: 1,
                    image: "/test.jpg",
                    price: 100,
                    product: new mongoose.Types.ObjectId()
                }
            ],
            shippingAddress: {
                address: "123 Test St",
                city: "Test City",
                postalCode: "123456",
                country: "India"
            },
            paymentMethod: "PayPal",
            itemsPrice: 100,
            shippingPrice: 50,
            taxPrice: "18.00",
            totalPrice: "168.00"
        };

        console.log("Sending payload...");
        const response = await fetch('http://localhost:5001/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Failed:", data);
        } else {
            console.log("Success:", data);
        }

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        mongoose.connection.close();
    }
};

testPlaceOrder();
