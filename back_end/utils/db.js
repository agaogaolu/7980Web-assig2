const { MongoClient, ObjectId } = require('mongodb');

process.env.MONGODB_URI = 'mongodb://luzhigaoassig:sg74BXsfiz05h15Pi0my9z15Dy20FSEognPw8brpu9Lj8VkZfeYM9ym4sQWU9HeDtmNe7Wq2QzzNACDbkzAdCA%3D%3D@luzhigaoassig.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@luzhigaoassig@';

if (!process.env.MONGODB_URI) {
    // throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    process.env.MONGODB_URI = 'mongodb://localhost:27017';
}

// Connect to MongoDB
async function connectToDB() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('assignment1');
    db.client = client;
    return db;
}

module.exports = { connectToDB, ObjectId };