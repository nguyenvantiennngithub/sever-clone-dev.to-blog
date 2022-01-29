import {redisClient} from '../index.js'

async function getSetCache(type, callback, username){
    try {
        const temp = await redisClient.get(type)
        if (temp){
            const dataCache = JSON.parse(temp);
            return {result: dataCache, isCached: true};
        }
        const {result, totalUnread} = await callback(username);
        redisClient.set(type, JSON.stringify(result));
        return {result, totalUnread, isCached: false};
    } catch (error) {
        console.log(error)
    }
}

async function updateCache(type, callback, data){
    try {
        const temp = await redisClient.get(type)
        const cacheData = JSON.parse(temp);
        if (!temp){
            console.log("DONT UPDATE CACHE")
            return;
        }
        const result = callback(cacheData, data);
        await redisClient.set(type, JSON.stringify(result));
    } catch (error) {
        console.log(error)
    }
}

function addNewNotification(list, data){
    list.unshift(data);
    return list;
}

function addUsernameToSeenNotification(list, data){
    const {notifications, username} = data;
    for (var i = 0; i < notifications.length; i++){
        for (var j = 0; j < list.length; j++){
            console.log(notifications[i]._id.toString(), list[j].notifi._id)
            if (notifications[i]._id.toString() == list[j].notifi._id){
                list[j].notifi.seen.push(username);
                break;
            }
        }
    }
    return list;


    // for (var i = 0; i < list.length; i++){
    //     for (var j = 0; j < notifications.length; j++){
    //         const notifi = notifications[j];
    //         if (list[i].notifi._id === notifi._id){
    //             console.log("OK")
    //             list[i].notifi.seen.push(username);
    //         }
    //     }
    // }
    return list;
}


export {getSetCache, updateCache, addUsernameToSeenNotification, addNewNotification}