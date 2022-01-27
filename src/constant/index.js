const typeNotification = {
    heartPost: "notification heart my post",
    newPost: "notification new post",
    commentPost: "notification comment" 
}

const typeEmit = {
    heartPost: "emit notification heart my post",
    commentPost: "emit notification comment post",
    newPost: "emit notification has new post",
    commentPostDetail: "emit notification at post detail",
}

const typeRedis = {
    notification: "caching notification: ",
}
export {typeNotification, typeEmit, typeRedis}