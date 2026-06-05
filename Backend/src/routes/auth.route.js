const express = require('express');

const authRouter = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');


//imported from auth.controller.js
const authController = require('../controllers/auth.controller');
//


//registration route
authRouter.post('/register', authController.registerUserController);


//login route
authRouter.post('/login', authController.LoginUserController);


//logout route
authRouter.post('/logout', authController.LogoutUserController);


//current logged in user details 
authRouter.get('/me' , authMiddleware.authUser , authController.getmeController);


module.exports = authRouter;