const axios = require('axios');
(async () => {
    try {
        const email = process.env.ADMIN_EMAIL || 'admin@example.com';
        const password = process.env.ADMIN_PASSWORD || 'password123';
        const login = await axios.post('http://localhost:5001/api/auth/login', { email, password });
        const token = login.data.token;
        console.log('Logged in');

        const order = await axios.post('http://localhost:5000/api/orders', {
            orderItems: [{
                name: "iPhone",
                qty: 1,
                image: "img.png",
                price: 89900,
                product: "64aa6a599605bd2ed54fcb2b" // dummy object id valid length
            }],
            shippingAddress: { address: '123', city: 'city', postalCode: '12345', country: 'IN' },
            paymentMethod: 'COD',
            itemsPrice: 89900,
            taxPrice: 16182,
            shippingPrice: 0,
            totalPrice: 106082
        }, { headers: { Authorization: `Bearer ${token}` } });
        console.log('Order success:', order.data);
    } catch (e) {
        console.error('Order failed:', e.response ? e.response.data : e.message);
    }
})();
