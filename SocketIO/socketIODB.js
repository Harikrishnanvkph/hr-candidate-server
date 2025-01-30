const client = require('../index.js')

const dbClient = client.db('socket');
const databaseInitialized = false;

async function init(){
    await dbClient.collection('users').createIndex('userID')
}

async function userSocketID(userID,socketID){
    if(!databaseInitialized){
        await init();
    }
    const flag = await userExist(userID);
    return flag ? await dbClient.collection('users').updateOne({
        userID : userID}, {
        $set : {
            socketID : socketID
        }
    }) : await dbClient.collection('users').insertOne({
        userID : userID,
        socketID : socketID
    })
}

async function getUserSocketID(userID){
    const receiver = await dbClient.collection('users').findOne({
        userID : userID
    })
    return receiver.socketID;
}

async function userExist(userID){
    return await dbClient.collection('users').findOne({userID : userID})
}

module.exports = {userSocketID,userExist,getUserSocketID}