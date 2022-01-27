import NotificationModel from "../models/notification.js";
import UserModel from "../models/user.js";
import PostModel from "../models/post.js"
import CommentModel from '../models/comment.js'
import { typeNotification } from "../constant/index.js";


async function createNotification(idComment, slug, type){
    const notification = new NotificationModel({comment: idComment, post: slug, type: type})
    const newNotification = await notification.save();
    return newNotification;
}

async function addNotificationToUser(username, idNotification){
    const authorOfPost = await UserModel.findOne({username: username})
    authorOfPost.notifications.unshift(idNotification);
    authorOfPost.save();
}

async function getNotifications(username){
    const user = await UserModel.findOne({username: username});
    var result = [];
    var totalUnread = 0;
    for (var i = 0; i < user.notifications.length; i++){
        const notifi = await NotificationModel.findById(user.notifications[i], {username: 0, deleted: 0});
        const post = await PostModel.findOne({slug: notifi.post})
        const isRead = notifi.seen.includes(username);
        if (!isRead) totalUnread++;
        if (notifi){
            switch (notifi.type) {
                case typeNotification.newPost:{
                    const author = await UserModel.findOne({username: post.author}, {_id: 1, username: 1, displayName: 1, avatar: 1});
                    result.push({post, notifi, author, isRead})
                    break;
                }
                case typeNotification.heartPost:{
                    const nearestHeartUser = await UserModel.findOne({username: post.heart[0]}, {_id: 1, username: 1, displayName: 1, avatar: 1});
                    result.push({post, notifi, nearestHeartUser, isRead})
                    break;
                }

                case typeNotification.commentPost:{
                    var parentComment = undefined;
                    const comment = await CommentModel.findById(notifi.comment, {deleted: 0});
                    const author = await UserModel.findOne({username: comment.author}, {_id: 1, username: 1, displayName: 1, avatar: 1 });
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
    return {result, totalUnread};
}


export {createNotification, addNotificationToUser, getNotifications}