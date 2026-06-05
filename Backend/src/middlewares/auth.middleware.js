const jwt = require('jsonwebtoken');
const blacklistModel = require('../models/blacklist.model');

async function authUser(req,res,next) {

    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({
            msg : "Unauthorized access, token is missing"
        })
    }

    const isblacklisted = await blacklistModel.findOne({ token : token });
    if(isblacklisted) {
        return res.status(401).json({
            msg : "Unauthorized access, token is blacklisted"
        })
     }


     //verify the token
     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
     }
     catch(err){
        return res.status(401).json({
            msg : " Unauthorized access, invalid token"
        })
     }
}


module.exports = {authUser};