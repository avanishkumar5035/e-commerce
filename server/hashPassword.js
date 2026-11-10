/**
 * Utility script to generate a bcrypt hash for any password.
 * Usage:
 *   node hashPassword.js "your_secret_password"
 */
const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
    console.log('\n❌ Please provide a password to hash!');
    console.log('👉 Example: node hashPassword.js "myNewPassword123"\n');
    process.exit(1);
}

const saltRounds = 10;
const hash = bcrypt.hashSync(password, saltRounds);

console.log('\n=============================================');
console.log('✅ Password successfully hashed with bcrypt!');
console.log('=============================================');
console.log('\n🔐 Original password (keep secret in your mind):', password);
console.log('📋 Hash value to put into your .env:');
console.log('\nADMIN_PASSWORD_HASH=' + hash + '\n');
console.log('=============================================\n');
