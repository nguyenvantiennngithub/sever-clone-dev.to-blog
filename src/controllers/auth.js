import UserModel from '../models/user.js';
import * as authServices from '../services/auth.js';
import clound from 'cloudinary'
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
    console.log(req.body)
    //status: {message, succsess} user: user
    const {status, user} = await authServices.checkLogin({username, password})
    if (status.success){
        //create tokken when login success
        const token = authServices.login(username);
        console.log("check login token", token);
        res.setHeader('Authorization', token);
    }
    return res.json({status, user});
}

async function verifyToken(req, res, next){
    const token = req.headers.authorization.split(" ")[1];

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


async function updateInfo(req, res, next){
    try {
        const {username} = res.locals;
        const data = req.body;
        const dataChange = {
            displayName: data.displayName,
            email: data.email,
            bio: data.bio,
        };
        
        if (data.file) dataChange.avatar = data.image;
        
        const newUser = await UserModel.findOneAndUpdate({username: username}, dataChange, {new: true})
        newUser.password = undefined;   

        res.json(newUser);
    } catch (error) {
        console.log(error)
    }
}

async function changePassword(req, res, next){
    try {
        const {currentPassword, newPassword} = req.body;
        const {username} = res.locals;

        const user = await UserModel.findOne({username: username, password: currentPassword});
        
        if (!user) return res.json({message: "Incorrent password"});

        user.password = newPassword;

        await user.save();

        res.json({message: "Password has been changed"});
    } catch (error) {
        console.log(error)
    }
}


export {registerUser, checkLogin, verifyToken, updateInfo, changePassword};