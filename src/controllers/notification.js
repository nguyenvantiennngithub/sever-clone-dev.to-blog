import UserModel from '../models/user.js';
import NotificationModel from '../models/notification.js';
import PostModel from '../models/post.js';
import CommentModel from '../models/comment.js';
import {typeNotification} from '../constant/index.js'
async function getNotification(req, res){
    try {
        const {username} = res.locals;
        const user = await UserModel.findOne({username: username});
        var result = [];
        var totalUnread = 0;
        for (var i = 0; i < user.notifications.length; i++){
            const notifi = await NotificationModel.findById(user.notifications[i]);
            const post = await PostModel.findOne({slug: notifi.post})
            const isRead = notifi.seen.includes(username);
            if (!isRead) totalUnread++;
            if (notifi){
                switch (notifi.type) {
                    case typeNotification.newPost:{
                        const author = await UserModel.findOne({username: post.author});
                        result.push({post, notifi, author, isRead})
                        break;
                    }
                    case typeNotification.heartPost:{
                        const nearestHeartUser = await UserModel.findOne({username: post.heart[0]});
                        result.push({post, notifi, nearestHeartUser, isRead})
                        break;
                    }

                    case typeNotification.commentPost:{
                        var parentComment = undefined;
                        const comment = await CommentModel.findById(notifi.comment);
                        const author = await UserModel.findOne({username: comment.author});
                        if (comment.idParentReply){
                            parentComment = await CommentModel.findById(comment.idParentReply);
                        }
                        result.push({notifi, comment, author, parentComment, post, isRead});
                    }
                    default:
                        break;
                }
            }
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
        console.log({id})
        const notification = await NotificationModel.findById(id);
        notification.seen.push(username);
        notification.save();
    } catch (error) {
        console.log(error)
    }
}

export {getNotification, seen};