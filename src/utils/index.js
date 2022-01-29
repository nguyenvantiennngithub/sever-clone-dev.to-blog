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
            return;
        }
        const result = callback(cacheData, data);
        redisClient.set(type, JSON.stringify(result));
    } catch (error) {
        console.log(error)
    }
}

function addNewNotification(list, data){
    list.unshift(data);
    return list;
}

function addUsernameToSeenNotification(list, data){
    const {id, username} = data;
    for (var i = 0; i < list.length; i++){
        const item = list[i];
        if (item.notifi._id === id){
            list[i].notifi.seen.push(username);
            break;
        }
    }
    return list;
}


export {getSetCache, updateCache, addUsernameToSeenNotification, addNewNotification}