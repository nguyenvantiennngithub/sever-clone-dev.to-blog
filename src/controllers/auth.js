import UserModel from '../models/user.js';
import * as authServices from '../services/auth.js';

async function registerUser(req, res, next){
    const {username, password, email} = req.body;
    //{message, success}
    const {status, user} = await authServices.registerUser({username, password, email})
   
    //create token because after register will auto login
    const token = authServices.login(username);
    res.setHeader('Authorization', token);
    res.json({status, user});
}

async function checkLogin(req, res, next){
    const {username, password} = req.body;
    //{message, succsess}
    const {status, user} = await authServices.checkLogin({username, password})
    if (status.success){
        //create tokken
        const token = authServices.login(username);
        res.setHeader('Authorization', token);
    }

    return res.json({status, user});
}

async function verifyToken(req, res, next){
    const token = req.headers.authorization;
    if (token === 'null' || token === null){
        return res.json(false)
    } 
    const data = authServices.verifyToken(token)
    const user = await UserModel.findOne({username: data.username}, 'username email createdAt following followers avatar bio bookmark heart');

    return res.json({data: Boolean(data), user});
}

export {registerUser, checkLogin, verifyToken};