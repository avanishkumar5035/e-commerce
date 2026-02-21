const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'avanishkumar5035@gmail.com',
        password: bcrypt.hashSync('avanish@2006', 10),
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
