import postModel from "../models/post.js";


async function getAllOrderByCreatedAt(){
    try {
        const posts = await postModel.find({});
        return posts.sort((a, b) => b.createdAt - a.createdAt)
    } catch (error) {
        console.log(error)
    }
}




export {getAllOrderByCreatedAt}