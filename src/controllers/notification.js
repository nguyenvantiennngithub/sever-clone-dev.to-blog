import UserModel from '../models/user.js';
import NotificationModel from '../models/notification.js';
import PostModel from '../models/post.js';
import CommentModel from '../models/comment.js';
import {typeNotification, typeRedis} from '../constant/index.js'
import redisClient from '../db/redis.js'
import {getSetCache, updateCache, addUsernameToSeenNotification} from '../utils/index.js'
import {getNotifications} from '../services/notification.js'
async function getNotification(req, res){
    try {
        const {username} = res.locals;
        const {result, totalUnread, isCached} = await getSetCache(typeRedis.notification + username, getNotifications, username)
        // await redisClient.flushDb()
        if (isCached){//because i dont cache totalUnread so that if data cached we need to get totalUnread
            const totalUnread = result.reduce((total, item) =>{
                if (!item.notifi.seen.includes(username)) return total + 1;
                return total;
            }, 0)
            return res.json({result: result, totalUnread})
        }
        res.json({result, totalUnread});
    } catch (error) {
        console.log(error)
    }
}

async function seen(req, res){
    try {
        const {id} = req.body;
        const {username} = res.locals;
        const notification = await NotificationModel.findById(id);
        notification.seen.push(username);
        notification.save();

        //add username to seen field of notification
        updateCache(typeRedis.notification + username, addUsernameToSeenNotification, {username, id});

        res.end();
    } catch (error) {
        console.log(error)
    }
}

export {getNotification, seen};