const redis = require('redis');
const client = redis.createClient({
    port: 6379,
    host: "127.0.0.1"
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('ready', () => {
    console.log('Client connected to Redis and ready to use');
});

client.on('error', (err) => {
    console.error('Redis Error:', err);
});

client.on('end', () => {
    console.log('Client disconnected from Redis');
});

process.on('SIGINT', () => {
    client.quit();
});

module.exports = client;
