import axios from "axios";


export async function register( { username , email , password} ){

    try{
        const response = await axios.post('https://gen-ai-reume-project-1.onrender.com/api/auth/register', 
            { username, email, password } ,
        {
            withCredentials : true    //to send cookies to the server and also receive cookies from the server
        });
        return response.data;
    }
    catch(err){
        return err.response;
    }
}


export async function login( { email , password} ){

    try{
        const response = await axios.post('https://gen-ai-reume-project-1.onrender.com/api/auth/login', 
            {email, password } ,
        {
            withCredentials : true    //to send cookies to the server and also receive cookies from the server
        });
        return response.data;
    }
    catch(err){
        return err.response;
    }
}


export async function logout(){

    try{
        const response = await axios.post('https://gen-ai-reume-project-1.onrender.com/api/auth/logout', 
        {
            withCredentials : true    //to send cookies to the server and also receive cookies from the server
        });
        return response.data;
    }
    catch(err){
        return err.response;
    }
}


export async function getme() {
    try {
        const response = await axios.get('https://gen-ai-reume-project-1.onrender.com/api/auth/me', {
            withCredentials: true
        });
        return response.data;
    } catch (err) {
        return null;  // ✅ return null instead of err.response
    }
}
