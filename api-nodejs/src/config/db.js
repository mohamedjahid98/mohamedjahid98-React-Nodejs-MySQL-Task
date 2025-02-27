const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function connectToDatabase() {
    try {
        await prisma.$connect(); // Connect to the database
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    } finally {
        await prisma.$disconnect(); // Optional: Disconnect after testing
    }
}

module.exports = connectToDatabase;
