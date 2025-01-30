const {userSocketID,getUserSocketID} = require('socketIODB.js')

//below code will store the socket information in RAM memory which is not
//feasible on large user base
let userSockets = new Map();

function socketIO(io){
    io.on('connection',(socket)=>{
        socket.on('initialize',async(userID)=>{
            await userSocketID(userID,socket.id);
        })
        socket.on('chat-user',async(receiverID,message)=>{
            const receiverSocketID = await getUserSocketID(receiverID);
            socket.to(receiverSocketID).emit('message-user',message)
        })
    })
}

module.exports = socketIO;


