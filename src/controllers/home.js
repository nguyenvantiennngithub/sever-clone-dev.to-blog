import * as homeServices from '../services/home.js';

function home(req, res){
    console.log("home")
    res.send("home page");
}

export {home};