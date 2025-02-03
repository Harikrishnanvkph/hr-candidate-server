const {getCnvWithoutMsg, getCnvWithConversationId} = require("./database");
const router = require('express').Router();

router.post('/getConversation',async(req,res,next)=>{
    const {uuid} = req.body;
    const getCnv_without_msg = await getCnvWithoutMsg(uuid);
    res.send(getCnv_without_msg)
})

router.post('/getCnvWithConversationId',async(req,res,next)=>{
    const {sender, receiver} = req.body;
    const getCnv_with_msg = await getCnvWithConversationId(sender, receiver);
    res.send(getCnv_with_msg)
})

module.exports = router