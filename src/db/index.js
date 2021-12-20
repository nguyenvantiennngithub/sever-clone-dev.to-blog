import mongoose from 'mongoose';
function db(){
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true })
    .then(()=>{
        console.log("connect success to db")
    })
}

export default db;