const mongoose = require('mongoose');
const { time } = require('node:console');


const blacklistSchema = new mongoose.Schema(
    {
        token : {
            type : String,
            required : true
        }
    },
        {
            timestamps : true
        }
); 

const tokenBlacklistModel = mongoose.model('Blacklist_Tokens',blacklistSchema);
module.exports = tokenBlacklistModel;    