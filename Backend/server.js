require('dotenv').config()
const app = require('./src/app');
const connectdb = require('./src/config/database');



connectdb();
const port = process.env.PORT || 3000;


app.listen(port,()=> console.log(`Server running on port ${port}`));