const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10),
        role: 'admin',
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('123456', 10),
        role: 'user',
    },
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: bcrypt.hashSync('123456', 10),
        role: 'user',
    },
];

module.exports = users;
