import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login,register,getme,logout } from "../services/auth.api";



export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user , setUser , loading , setloading} = context;
    
    const handlelogin = async ({email,password}) => {
        setloading(true);
        try{
            const data = await login({email,password})
            setUser(data.user);
        } 
        catch (error) {
            console.error("Login failed", error);
        } 
        finally {
            setloading(false);
        }
    }


    const handleregister = async ({username,email,password}) => {
        setloading(true);
        try{
            const data = await register({username,email,password})
            setUser(data.user);
        }catch (error) {
            console.error("Registration failed", error);
        }
        finally {
            setloading(false);
        }
    }

    const handlegetme = async () => {
        setloading(true);
        try {
            const data = await getme();
            setUser(data.user);
        } catch (error) {
            console.error("Failed to get user info", error);
        } finally {
            setloading(false);
        }
    }

    const handlelogout = async () => {
        setloading(true); 
        try{
             await logout();
            setUser(null);
        }catch(err){
            console.error("failed to logout",err);
        }
        finally{       
        setloading(false);
        }
    }

    return { user, setUser, loading, setloading, handlelogin, handleregister, handlegetme, handlelogout };
}