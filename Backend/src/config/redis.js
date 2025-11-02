const {createClient}=require('redis');
require('dotenv').config();
// const redisClient = createClient({
//     username: 'default',
//     password: process.env.REDIS_PASS,
//     socket: {
//         host: 'redis-18537.c93.us-east-1-3.ec2.redns.redis-cloud.com',
//         port: 18537
//     }
// });
// // Example of adding an error handler
// redisClient.on('error', (err) => console.log('Redis Client Error:', err));


const redisClient = createClient({
    // username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-18537.c93.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 18537
    }
});

module.exports= redisClient;