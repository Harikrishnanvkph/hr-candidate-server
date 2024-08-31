const client = require("./index.js")
const bcrypt = require('bcrypt');
const { genPassword, createChatID } = require("./logic");

const dbClient = client.db("HRHIRE");

//Getting or Checking users in the list
async function getCandidate(mail){
    const ce = await dbClient.collection("Candidate").findOne({mail : mail},{_id : 0});
    return ce;
}


//Validating users
async function validateUser(mail,password){
    const checkEmployer = await getCandidate(mail);
    if(checkEmployer == null){
        return null;
    }
    const cb = await bcrypt.compare(password,checkEmployer.password);
    return cb ? "200" : "409"
}


//Registering User
async function registerUser(userDetail){
    const cUser = await getCandidate(userDetail.mail);
    if(cUser == null){
        const gId = await getId(); 
        await dbClient.collection("Candidate").insertOne({
            user_id : gId,
            mail : userDetail.mail,
            firstName : userDetail.firstName,
            lastName : userDetail.lastName,
            password : await genPassword(userDetail.password),
            image : "",
            phone_number : "",
            company : "",
            referrals : [],
            services : []
        })
        await setId(gId);
        return "200";
    }
    return "409";
}

async function getId(){
    const gt =  await dbClient.collection("User_Id").findOne({},{id : 1, _id : 0});
    return gt.id;
}

async function setId(user_id){
    await dbClient.collection("User_Id").updateOne({},{
        $set : {
            id : user_id + 1
        }
    })
}

async function updateNumber(number,mail){
    const cUser = await getCandidate(mail);
    if(!cUser){
        return null;
    }

    await dbClient.collection("Candidate").updateOne(
        {mail : mail},{
        $set : {
            phone_number : number
        }
    })
    return await getCandidate(mail);
}

async function updateSkill(skill,mail){
    const cUser = await getCandidate(mail);
    if(!cUser){
        return null;
    }
    await dbClient.collection("Candidate").updateOne(
        {mail : mail},{
        $set : {
            company : skill
        }
    })
    return await getCandidate(mail);
}


//uploading Image in MongoDB
async function imageUpload(mail,file){
    const cUser = await getCandidate(mail);
    if(!cUser){
        return null;
    }

    await dbClient.collection("Candidate" ).updateOne(
        {mail : mail},{
        $set : {
            image : file
        }
    })
    return await checkUser(mail);
}

//get
async function getReferral(){
    const ref = await dbClient.collection("ReferralCompanies").find({}).toArray();
    return ref;
}

async function getService(){
    const ref = await dbClient.collection("CandidateServices").find({}).toArray();
    return ref;
}

async function getMyReferral(mail){
    const ref = await dbClient.collection("Candidate").findOne({mail:mail},
        {_id : 0, referrals : 1}
    );
    return ref;
}

async function getMyService(mail){
    console.log(mail)
    const ref = await dbClient.collection("Candidate").findOne({mail:mail},
        {_id : 0, services : 1}
    );
    return ref;
}


//update
async function updateReferral(mail, referral){
    const ref = await dbClient.collection("Candidate").updateOne({mail : mail},{
        $push : {
            referrals : referral
        }
    });
    return ref ? ref : null;
}

async function updateService(mail, service){
    const ref = await dbClient.collection("Candidate").updateOne({mail : mail},{
        $push : {
            services : service
        }
    });
    return ref ? ref : null;
}

module.exports = {getCandidate,imageUpload,updateNumber,updateSkill,
    registerUser, validateUser, getReferral, getService,updateReferral,
    updateService, getMyReferral,getMyService}