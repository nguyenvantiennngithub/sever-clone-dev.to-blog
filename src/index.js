import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors';
import express from 'express';
import mongodb from './db/index.js'
import router from './routers/index.js'
import clound from 'cloudinary' 
import { Server } from "socket.io";
import {createServer } from 'http'
import Redis from './db/redis.js'
const cloudinary = clound.v2;
const app = express()
const port = process.env.PORT || 8080
const corsOptions = {
    exposedHeaders: 'Authorization',
};
const httpServer = createServer(app);

const io = new Server(httpServer, { 
    cors: {
        origin: "http://localhost:3000/",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Authorization"],
        credentials: true
    } 
});

app.use(cors(corsOptions));
app.use(express.json({ extended: false, limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));

const redisClient = Redis();
mongodb();

app.use(router);
app.set("io", io);
io.on("connection", (socket) => {
    socket.on("login success", (data)=>{
        socket.username = data.username;
        socket.join(data.username)
        console.log("USERNAME: ", data.username)
    })

    socket.on("logout success", (data)=>{
        socket.leave(socket.username);
    })

    socket.on("disconnecting", ()=>{
        socket.leave(socket.username);
    })
});

cloudinary.config({
    cloud_name: process.env.CLOUND_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

httpServer.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
export {redisClient}
