import CommentModel from '../models/comment.js';
import PostModel from '../models/post.js';
import UserModel from '../models/user.js';
import NotificationModel from '../models/notification.js';
import {typeEmit, typeNotification, typeRedis} from '../constant/index.js'
import * as commentService from '../services/comment.js'
import * as notificationService from '../services/notification.js'
import {addNewNotification, updateCache} from '../utils/index.js'
async function comment(req, res, next){//coomment and reply
    try {
        const io = req.app.get("io");
        const {slug, comment, isReply, idParent, replyClosest, idParentReply} = req.body;
        const {username} = res.locals;
        const author = await UserModel.findOne({username: username}, {password: 0});//current user login

        //comment and reply
        const newComment = await commentService.createComment(slug, comment, username, idParentReply, isReply, idParent);
        const {parentComment, updatePost} = await commentService.addNewCommentToPost(isReply, newComment._id, idParent, slug)
        
        //notification
        const newNotification = await notificationService.createNotification(newComment._id, slug, typeNotification.commentPost);

        const data = {notifi: newNotification, comment: newComment, author: author, post: updatePost, parentComment: parentComment}
        //emit to user in this post
        io.emit(typeEmit.commentPostDetail + slug, {data: {cmt: newComment, author, isReply}, idParent});

        if (updatePost.author !== username){//dont add notification for myself
            //emit to author of post
            notificationService.addNotificationToUser(updatePost.author, newNotification._id);
            io.to(updatePost.author).emit(typeEmit.commentPost, data)
            updateCache(typeRedis.notification + updatePost.author, addNewNotification, data)
        }
        if (replyClosest){//add notification to tagged user 
            notificationService.addNotificationToUser(replyClosest.username, newNotification._id);
            //emit to user i reply
            io.to(replyClosest.username).emit(typeEmit.commentPost, data)
            updateCache(typeRedis.notification + replyClosest.username, addNewNotification, data)
        }
        res.json({cmt: newComment, author});
    } catch (error) {
        console.log(error);
    }
}

async function showReply(req, res, next){
    try {
        const {id} = req.params;
        const comment = await CommentModel.findById(id);
        const listReply = await CommentModel.find({_id: {$in: comment.reply}}).sort({createdAt: 1});
        const object = listReply.map(async cmt => {
            const author = await UserModel.findOne({username: cmt.author});
            return {cmt, author};
        })
        res.json(await Promise.all(object)) 
    } catch (error) {
        console.log(error);
    }
}

async function heart(req, res, next){

    try {
        const {id} = req.params;
        const {isPush} = req.body;
        const {username} = res.locals

        const comment = await CommentModel.findById(id);

        const indexHeartComment = comment.heart.indexOf(username)

        if (isPush){//we will change from unHeart to heart
            if (indexHeartComment === -1 || comment.heart.length === 0) comment.heart = [username, ...comment.heart];
        }else{
            if (indexHeartComment !== -1) comment.heart.splice(indexHeartComment, 1)
        }

        const newComment = await comment.save();
        console.log({newComment})
        res.json({comment: newComment});
    
    } catch (error) {
        console.log(error);
    }
}

async function editComment(req, res){
    try {
        const {id} = req.params;
        const {username} = res.locals
        const {comment} = req.body
        const commentEdit = await CommentModel.findOne({_id: id, author: username});
        commentEdit.comment = comment;
        const commentEdited = await commentEdit.save();
        res.json({comment: commentEdited})
    } catch (error) {
        console.log(error);
    }
}

async function deleteComment(req, res){
    try {
        const {id} = req.params;
        const {username} = res.locals
        const commentDelete = await CommentModel.findOne({_id: id, author: username});
        const commentDeleted = await commentDelete.delete();
        console.log(commentDeleted)
        res.json({comment: commentDeleted})
    } catch (error) {
        console.log(error);
    }
}

export {comment, showReply, heart, editComment, deleteComment};