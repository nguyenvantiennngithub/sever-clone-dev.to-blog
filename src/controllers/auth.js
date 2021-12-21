import UserModel from '../models/user.js';
import * as authServices from '../services/auth.js';

async function registerUser(req, res, next){
    const {username, password, email} = req.body;
    //{message, success}
    const {status, user} = await authServices.registerUser({username, password, email})
   
    //create token because after register success will auto login
    if (status.success){
        const token = authServices.login(username);
        res.setHeader('Authorization', token);
    }

    res.json({status, user});
}

async function checkLogin(req, res, next){
    const {username, password} = req.body;
    //status: {message, succsess} user: user
    const {status, user} = await authServices.checkLogin({username, password})
    if (status.success){
        //create tokken when login success
        const token = authServices.login(username);
        res.setHeader('Authorization', token);
    }
    return res.json({status, user});
}

async function verifyToken(req, res, next){
    const token = req.headers.authorization;
    if (token === 'null' || token === null){
        return res.json({token: false, user: undefined})
    } 

    try {
        const data = authServices.verifyToken(token)
        const user = await UserModel.findOne({username: data.username}, {password: 0});
        return res.json({token: Boolean(data), user});
    } catch (error) {
        console.log(error)
    }
}

export {registerUser, checkLogin, verifyToken};