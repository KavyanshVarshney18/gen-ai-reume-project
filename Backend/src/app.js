const express = require('express')

const cookieParser = require('cookie-parser')

const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cookieParser()); 


app.use(cors({  
    origin: 'http://localhost:5173', // frontend URL
    credentials: true, // Allow cookies to be sent and received
}));

const interviewRouter = require("./routes/interview.route")
const authRouter = require('./routes/auth.route');


app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);







module.exports = app;