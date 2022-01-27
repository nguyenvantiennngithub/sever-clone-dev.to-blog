import { createClient } from 'redis';

const redisClient = createClient(process.env.REDIS_TLS_URL);
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect().then(()=>{
    console.log("Redis connect success");
})

export default redisClient
