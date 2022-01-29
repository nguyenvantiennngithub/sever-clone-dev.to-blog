import { createClient } from 'redis';

function Redis(){
    var redisClient;
    console.log(process.env.REDIS_TLS_URL)
    if (process.env.REDIS_TLS_URL){
        console.log("RUN REDIS ON PRODUCTION")
        redisClient = createClient({
            url: process.env.REDIS_TLS_URL,
            socket: {
                tls: true,
                rejectUnauthorized: false
            }
        })
    }else{
        console.log("RUN REDIS ON LOCAL")
        redisClient = createClient(process.env.REDIS_TLS_URL);
    }

    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    redisClient.connect().then(()=>{
        console.log("Redis connect success");
    })
    return redisClient;
}

export default Redis
