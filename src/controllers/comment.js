import CommentModel from '../models/comment.js';
import PostModel from '../models/post.js';
import UserModel from '../models/user.js';
import NotificationModel from '../models/notification.js';
import {typeEmit, typeNotification} from '../constant/index.js'
async function comment(req, res, next){//coomment and reply
    try {
        const {slug, comment, isReply, idParent, replyClosest, idParentReply} = req.body;
        const {username} = res.locals;
        const io = req.app.get("io")
        const parentComment = await CommentModel.findById(idParent);
        const updatePost = await PostModel.findOne({slug: slug});//this post
        const author = await UserModel.findOne({username: username}, {password: 0});//current user login
        //comment and reply
        const commentObj = new CommentModel({slug, comment, author: username, idParentReply});
        if (isReply){
            commentObj.idReply = idParent;
            if (replyClosest.username !== username){
                commentObj.replyClosest = replyClosest;
            }
        }
        const newComment = await commentObj.save();
        
        if (isReply){
            parentComment.reply = [newComment._id, ...parentComment.reply];
            parentComment.save();
        }else{
            updatePost.comment = [...updatePost.comment, newComment._id];
            updatePost.save();
        }
        
        //notification
        const authorOfPost = await UserModel.findOne({username: updatePost.author})
        const notification = new NotificationModel({comment: newComment._id, post: slug, type: typeNotification.commentPost})
        const newNotification = await notification.save();

        if (updatePost.author !== username){//dont add notification for myself
            authorOfPost.notifications.unshift(newNotification._id);
            authorOfPost.save();
            const data = {notifi: newNotification, comment: newComment, author: author, post: updatePost, parentComment: parentComment}
            io.to(authorOfPost.username).emit(typeEmit.commentPost, data)
        }
        if (replyClosest){//add notification to tagged user 
            const userReply = await UserModel.findOne({username: replyClosest.username});
            userReply.notifications.unshift(newNotification._id);
            userReply.save();
        }
        //emit notification

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