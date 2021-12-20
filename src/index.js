import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors';
import express from 'express';
import db from './db/index.js'
import router from './routers/index.js'
import clound from 'cloudinary' 
const cloudinary = clound.v2;
const app = express()
const port = process.env.PORT || 8080
const corsOptions = {
  exposedHeaders: 'Authorization',
};
app.use(cors(corsOptions));


app.use(express.json({ extended: false, limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));



app.use(router);
cloudinary.config({
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

db();

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})