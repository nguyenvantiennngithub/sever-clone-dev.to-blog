import CommentModel from '../models/comment.js';
import PostModel from '../models/post.js';
async function createComment(slug, comment, author, idParentReply, isReply, idParent, replyClosest){
    const commentObj = new CommentModel({slug, comment, author, idParentReply});
    if (isReply){
        commentObj.idReply = idParent;
        console.log({replyClosest, author})
        if (replyClosest.username !== author){
            commentObj.replyClosest = replyClosest;
        }
    }
    const newComment = await commentObj.save();
    return newComment;
}

async function addNewCommentToPost(isReply, idNewComment, idParent, slug){
    const parentComment = await CommentModel.findById(idParent);
    const updatePost = await PostModel.findOne({slug: slug});//this post

    if (isReply){
        parentComment.reply = [idNewComment, ...parentComment.reply];
        parentComment.save();
    }else{
        updatePost.comment = [...updatePost.comment, idNewComment];
        updatePost.save();
    }
    return {parentComment, updatePost}
}


export {createComment, addNewCommentToPost};