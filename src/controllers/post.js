import * as postServices from '../services/post.js';
import postModel from '../models/post.js'
import userModel from '../models/user.js'
import commentModel from '../models/comment.js'
import clound from 'cloudinary' 
import md5 from 'md5'
import NotificationModel from '../models/notification.js';
import UserModel from '../models/user.js';
import { typeEmit, typeNotification } from '../constant/index.js';
const cloudinary = clound.v2;
async function uploadImage(req, res){
    const {image, name} = req.body;
    try {
        const hashName = md5(image);
        const result = await cloudinary.uploader.upload(image, {public_id: 'BlogProject/Post/' + hashName, context: {'alt': name}})
        res.json({url: result.url})

    } catch (error) {
        console.log(error)
    }
}

async function createPost(req, res){
    const {username} = res.locals
    const post = req.body;
    const io = req.app.get("io")
    console.log(username, post)
    try {
        //create post
        const newPost = new postModel({...post, author: username});
        const result = await newPost.save();
        console.log(result)

        const author = await userModel.findOne({username: username});
        author.posts = [result.slug, ...author.posts];
        author.save();
        
        //notification
        if (author.followers.length > 0){
            const newNotification = new NotificationModel({post: newPost.slug, username: author.followers, type: typeNotification.newPost})
            const notification = await newNotification.save();
            for (var i = 0; i < author.followers.length; i++){
                const receiver = await UserModel.findOne({username: author.followers[i]})
                receiver.notifications.unshift(notification._id);
                receiver.save();

                //emit notification to followers
                io.to(author.followers[i]).emit(typeEmit.newPost, {notifi: notification, post: newPost, author: author})
            }
            
        }
        

        res.json({slug: result.slug})
    } catch (error) {
        console.log("createPost", error)
    }
}

async function getPostBySlug(req, res){
    console.log("get Post", req.params);
    try {
        const post = await postModel.findOne({slug: req.params.slug})
        if (!post){
            return res.status(404).json({})
        }

        const author = await userModel.findOne({username: post.author}, {password: 0, heart: 0, bookmark: 0, following: 0, followers: 0, posts: 0, createdAt: 0, updatedAt: 0});
        const comment = await commentModel.find({_id: {$in: post.comment}}).sort({'createdAt': -1});
        
        const object = comment.map(async cmt => {
            const author = await userModel.findOne(
                {username: cmt.author}, 
                {password: 0, heart: 0, bookmark: 0, following: 0, followers: 0, posts: 0, createdAt: 0, updatedAt: 0});
            return {cmt, author};
        });

        res.json({post, author, comment: await Promise.all(object)})

    } catch (error) {
        console.log(error)
    }
}

async function heart(req, res){
    //heart post
    try {
        const {isPush} = req.body;
        const {slug} = req.params;
        const {username} = res.locals
        const io = req.app.get('io');
        
        const post = await postModel.findOne({slug: slug});
        const author = await userModel.findOne({username: username});//current user login

        const indexHeartPost = post.heart.indexOf(username)
        const indexHeartAuthor = author.heart.indexOf(slug)

        if (isPush){//we will change from unHeart to heart
            if (indexHeartPost === -1 || post.heart.length === 0) post.heart = [username, ...post.heart];
            if (indexHeartAuthor === -1 || author.heart.length === 0) author.heart = [slug, ...author.heart];
        }else{
            if (indexHeartPost !== -1) post.heart.splice(indexHeartPost, 1)
            if (indexHeartAuthor !== -1) author.heart.splice(indexHeartAuthor, 1)
        }

        //notification
        if (isPush && username !== post.author){
            const authorOfPost = await UserModel.findOne({username: post.author});
            //find this notification if exist
            const notificationHeart = await NotificationModel.findOne({type: typeNotification.heartPost, post: slug, _id: {$in: authorOfPost.notifications}});
            
            if (!notificationHeart){//neu chua co notification
                const notification = new NotificationModel({username: post.author, type: typeNotification.heartPost, post: slug})
                const newNotification = await notification.save();
                authorOfPost.notifications.unshift(newNotification._id);
            }else{
                const indexNotifi = authorOfPost.notifications.indexOf(notificationHeart._id)
                if (indexNotifi > 0) {
                    authorOfPost.notifications.splice(indexNotifi, 1);
                    authorOfPost.notifications.unshift(notificationHeart._id);
                }
            }
            authorOfPost.save();

            //emit notification socket
            io.to(authorOfPost.username).emit(typeEmit.heartPost, {notifi: notificationHeart, post: post, nearestHeartUser: author, isReplace: Boolean(notificationHeart)})

        }
        const newPost = await post.save();
        author.save();
        res.json({post: newPost});
    } catch (error) {
        console.log(error)
    }
}

async function bookmark(req, res){
    const {isPush} = req.body;
    const {slug} = req.params;
    const {username} = res.locals
    try {
        const post = await postModel.findOne({slug: slug});
        const author = await userModel.findOne({username: username});
        
        const indexBookmarkPost = post.bookmark.indexOf(username)
        const indexBookmarkAuthor = author.bookmark.indexOf(slug)
        console.log(isPush)
        if (isPush){
            if (indexBookmarkPost === -1 || post.bookmark.length === 0) post.bookmark = [username, ...post.bookmark];
            if (indexBookmarkAuthor === -1 || author.bookmark.length === 0) author.bookmark = [slug, ...author.bookmark];
        }else{
            if (indexBookmarkPost !== -1) post.bookmark.splice(indexBookmarkPost, 1)
            if (indexBookmarkAuthor !== -1) author.bookmark.splice(indexBookmarkAuthor, 1)
        }
        const newPost = await post.save();
        const newAuthor = await author.save();

        newAuthor.password = undefined;
        res.json({post: newPost});
    } catch (error) {
        console.log(error)
    }
}


async function getAll(req, res){
    try {
        const posts = await postServices.getAllOrderByCreatedAt();
        const object = posts.map(async post => {
            const author = await userModel.findOne({username: post.author}, {password: 0});
            return {post, author};
        })
        res.json(await Promise.all(object)) 
    } catch (error) {
        console.log(error)
    }
}



async function editPost(req, res){
    const {data} = req.body;
    const {username} = res.locals
    console.log(data);
    try {
        const post = await postModel.findOneAndUpdate({slug: data.slug, author: username}, data, {new: true});
        console.log(post)
        res.json(post)
    } catch (error) {
        console.log(error)
    }
}

function sortByQuery(array, sort){
    console.log(sort)
    if (sort === 'created-desc'){
        return array.sort((a, b) => b.createdAt - a.createdAt);
    }else if (sort === 'updated-desc'){
        return array.sort((a, b) => b.updatedAt - a.updatedAt);
    }else if (sort === 'heart-desc'){
        return array.sort((a, b) => b.heart.length - a.heart.length);
    }else if (sort === 'bookmark-desc'){
        return array.sort((a, b) => b.bookmark.length - a.bookmark.length);
    }else{
        return array;
    }
}

async function getPersonalPosts(req, res){
    try {
        const {username} = res.locals;
        const {sort} = req.query;

        var posts = await postModel.find({author: username})
        posts = sortByQuery(posts, sort);

        var author = await userModel.findOne({username: username});

        var following = await userModel.find({username: {'$in': author.following}});
        var followers = await userModel.find({username: {'$in': author.followers}});

        res.json({posts, following, followers})
    } catch (error) {
        console.log(error)
    }
}

async function deletePost(req, res){
    try {   
        const {username} = res.locals;
        const {slug} = req.params;
        const post = await postModel.delete({slug: slug, author: username});
        
        res.json({status: post.matchedCount > 0});
    } catch (error) {
        console.log(error)
    }
}

async function getProfile(req, res){
    try {
        const {username} = req.params;
        const author = await userModel.findOne({username: username});
        if (!author){
            return res.status(404).end();
        }

        var posts = await postModel.find({author: username})
        posts = sortByQuery(posts, 'created-desc');
        console.log({author, posts})
        res.json({author, posts})
    } catch (error) {
        console.log(error)
    }    
}

export {uploadImage, createPost, getPostBySlug, heart, bookmark, getAll, editPost, getPersonalPosts, deletePost, getProfile};