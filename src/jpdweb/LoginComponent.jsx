import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./security/Authentication";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { initKeycloak } from "./api/KeycloakService";

export default function LoginComponent(){
    const {isAuthentication,login,isLoading}=useAuth();
    const nav=useNavigate();
    const location =useLocation();
    const[isLoggingIn,setIsLoggingIn]=useState(false)
// ví dụ a mún  từ login tới .// mặc định nó sẽ đi /home
const from =location.state?.from?.pathname||"/"
useEffect(()=>{
    //neeu da authenticated thi redirect ve trang go
    if(isAuthentication){
        nav(from,{replace:true})
        return
    }
    // neeus dang  loading  thi doi
    if(isLoading){
        return
    }
    //trigger keycloak login 
    const handleLogin= async ()=>{
        if(!isLoggingIn){
            setIsLoggingIn(true);

        }
        try{
          const authenticated =await initKeycloak();
          if(authenticated){
            await login();

          }
          else{
            console.warn("Login cancelled or failed")
            setIsLoggingIn(false)
          }
        }
        catch(error){
            console.error("keycloak login failed",error)
            setIsLoggingIn(false)
        }
    };
    handleLogin()
},[isAuthentication, isLoading, nav, from, login, isLoggingIn])
  if (isLoading) {
    return (
      <div className="login-container">
        <div className="loading-spinner">Checking authentication...</div>
      </div>
    );
  }

  if (isLoggingIn) {
    return (
      <div className="login-container">
        <div className="loading-spinner">Logging in...</div>
      </div>
    );
  }

  // Fallback UI (shouldn't normally be seen)
  return (
    <div className="login-container">
      <div className="login-content">
        <h2>Login Required</h2>
        <p>Redirecting to login...</p>
      </div>
    </div>
  );
}