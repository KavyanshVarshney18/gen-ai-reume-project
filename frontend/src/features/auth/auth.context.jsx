import { useEffect } from "react";
import { createContext,useState } from "react";
import { getme } from "./services/auth.api";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [ user , setUser]  = useState(null);
    const [loading, setloading] = useState(true);


    //to check if the user is already logged in or not when the app loads for the first time
    useEffect(() => {
    const getandsetuser = async () => {
        try {
            const data = await getme();
            if (data && data.user) {
                setUser(data.user);  // ✅ only set user if actually exists
            } else {
                setUser(null);       // ✅ explicitly clear user if not authenticated
            }
        } catch (err) {
            setUser(null);           // ✅ clear user on error
        } finally {
            setloading(false);       // ✅ always stop loading
        }
    };

    getandsetuser();
}, []);



    return (
        <AuthContext.Provider value={{user , setUser , loading , setloading}}>
            {children}
        </AuthContext.Provider>
    )


}