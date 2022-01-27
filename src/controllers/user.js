import userModel from '../models/user.js'

async function follow(req, res){
    const {isPush} = req.body;
    const {author} = req.params
    const {username} = res.locals

    const my = await userModel.findOne({username: username});
    const idol = await userModel.findOne({username: author});

    const indexMyFollowing = my.following.indexOf(author)
    const indexIdolFollowers = idol.followers.indexOf(username)

    if (isPush){
        if (indexMyFollowing === -1 || my.following.length === 0) my.following = [author, ...my.following];
        if (indexIdolFollowers === -1 || idol.followers.length === 0) idol.followers = [username, ...idol.followers];
    }else{
        if (indexMyFollowing !== -1) my.following.splice(indexMyFollowing, 1)
        if (indexIdolFollowers !== -1) idol.followers.splice(indexIdolFollowers, 1)
    }
    const newMy = await my.save();
    const newIdol = await idol.save();

    newMy.password = undefined;
    newIdol.password = undefined;
    
    res.json({my: newMy, idol: newIdol});
}

export {follow};