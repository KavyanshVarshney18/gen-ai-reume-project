const userModel = require('../models/user.model');
const blacklistModel = require('../models/blacklist.model');



//for password hashing
const bcrypt = require('bcrypt');

//for creating token after successful registration or login
const jwt = require('jsonwebtoken');


// at the top, define once and reuse
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000
};

//controller function for user registration
async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username) return res.status(400).json({ msg: "Please provide username" });
    if (!email) return res.status(400).json({ msg: "Please provide email" });
    if (!password) return res.status(400).json({ msg: "Please provide password" });

    const isuserexist = await userModel.findOne({ $or: [{ username }, { email }] });
    if (isuserexist) return res.status(400).json({ msg: "User already exist with this username or email" });

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ username, email, password: hashedpassword });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, cookieOptions);  // ✅ with options

    return res.status(201).json({
        msg: "User registered successfully",
        user: { id: user._id, username: user.username, email: user.email }
    });
}

//controller function for user login
async function LoginUserController(req, res) {
    //destructure the data from request body
    const {email,password} = req.body;

    //validation if any of the field is missing
    if(!email) {
        return res.status(400).json({
            msg : "Please provide email"
        })
    }
    if(!password) {
        return res.status(400).json({
            msg : "Please provide password"
        })
    }

    //check if user exist with the email
    const user = await userModel.findOne({
        email : email,
    })
    if(!user){
        return res.status(400).json({
            msg : "User not found with this email"
        })
    }

    //compare the password
    const ispasswordmatch = await bcrypt.compare(password,user.password);
    if(!ispasswordmatch){
        return res.status(400).json({
            msg : "Invalid password"
        })
    }

    //create token for the user
    const token = jwt.sign({
        id : user._id,
        username : user.username,
    }, 
    process.env.JWT_SECRET, 
    { expiresIn : '1d' }
    )
    
    //save token in cookies
    res.cookie('token', token, cookieOptions);  

    //send msg to client
    res.status(200).json({
        msg : "User logged in successfully",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    });

}   


//controller function for user logout
async function LogoutUserController(req, res) {
    const token = req.cookies.token;

    if (!token) return res.status(400).json({ msg: "User not logged in" });

    await blacklistModel.create({ token });

    res.clearCookie('token', cookieOptions);  // ✅ must match set options
    return res.status(200).json({ msg: "User logged out successfully" });
}


//get current logged in user details
async function getmeController(req, res) {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({  
        msg : "Current logged in user details", 
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })
}

module.exports = { registerUserController, LoginUserController , LogoutUserController ,getmeController };
