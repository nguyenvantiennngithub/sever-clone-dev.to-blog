import postModel from "../models/post.js";


async function getAllOrderByCreatedAt(currentPage, itemPerPage){
    try {
        console.log(currentPage, itemPerPage)
        const posts = await postModel.find({}).sort({createdAt: -1}).limit(itemPerPage).skip(itemPerPage*(currentPage-1));
        return posts;
    } catch (error) {
        console.log(error)
    }
}




export {getAllOrderByCreatedAt}