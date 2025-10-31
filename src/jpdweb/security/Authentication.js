import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiclient } from "../api/BaseApi";

import { getKeycloakInstance, logOutKeycloak } from "../api/KeycloakService";
import { getAccount } from "../api/ApiConnect";

export const AuthContext=createContext();
export const useAuth=()=>useContext(AuthContext)
export default function AuthProvider({children}){
    const [isAuthentication,setAuthentication]=useState(false)
    const[user,setUser]=useState(null)
    const[isLoading,setIsLoading]=useState(true)
    const[refreshInterval,setRefreshInterval]=useState(null)
    const[isCreator,setCreator]=useState(false);
    const[creatorInfor,setCreatorInfor]=useState(null)
    const[isAdmin,setAdmin]=useState(false)
    //cleanup and logout
    //giup logout ko bi tao lai moi lan rerender
    const handleLogout=useCallback(()=>{
       if(refreshInterval){
        clearInterval(refreshInterval)
        setRefreshInterval(null)
       }
       //clear auth state
       localStorage.removeItem("kc_token");
       localStorage.removeItem("kc_refreshToken");
       setAuthentication(false);
       setUser(null)
       setCreator(false)
       setCreatorInfor(null)
       //xoa header authorization de tranh no gui cac request cu con chay
       delete apiclient.defaults.headers.common['Authorization']
       logOutKeycloak();   
    },[refreshInterval])
    // ham de update token khi token het han
    // dau tien ta lay token va refresh token
    // sau do gui
const updateToken=useCallback(async(token,refreshToken)=>{
    const keycloak=await getKeycloakInstance();
    keycloak.token=token;
    keycloak.refreshToken=refreshToken;
    //keycloak token co cau truc header.payload.signature
    //phan 2 laf payload se dc ma hoa bang base64 ta dich no ra
    keycloak.tokenParsed=JSON.parse(atob(token.split(".")[1]));
      apiclient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem("kc_token",token)
      localStorage.setItem("kc_refreshToken",refreshToken)
},[])
const refreshToken=useCallback(async()=>{
   
   try{ 
     const keycloak=await getKeycloakInstance()
    const refreshed=await keycloak.updateToken(30)
    if(refreshed){
        console.log('token refreshed sucessfully ');
        await updateToken(keycloak.token,keycloak.refreshToken)
        return true
    }
    else {
        console.log('token still valid')
        return true
    }
}catch(error){
    console.error("Failed to refresh token "+error)
    handleLogout();
    return false;
}
},[updateToken,handleLogout])
//tu dong reset token tranh viec token het han
// neu interval hien tai con thi xoa no di
// tao 1 interval moi co do dai khoang 4p
//cu 4p se refresh token 
const setUpAutoRefresh=useCallback(()=>{
    //clear esixt interval
    if(refreshInterval){
        clearInterval(refreshInterval)
    }
    //set new interval (4p=240000)
    const interval=setInterval(async()=>{
        console.log('Auto refresh token....');
        await refreshToken();
    },240000)
    setRefreshInterval(interval)
},[refreshToken,refreshInterval])

//etup token expired handler
// day la fallback no giai quyet truong hop refresh auto ko chay
const setUpTokenRefresh=useCallback(async()=>{
    const keycloak=await getKeycloakInstance()
    keycloak.onTokenExpired=async ()=>{
        console.log("token expired , refresh....");
        await refreshToken();
    };
},[refreshToken])

const authenticateUser=useCallback(async()=>{
  try{
    const keycloak=await getKeycloakInstance();
    setAuthentication(true)
      apiclient.defaults.headers.common['Authorization'] = `Bearer ${keycloak.token}`;
      //call api to define if this account exist does not do
      //if does not exist => create tk
     let a=localStorage.getItem("kc_token")
     console.log(a);
      const response =await getAccount();
      console.log(response.data)
      setUser(response.data)
      setCreator(response.data.
creator)
      // fetch fallback
      await setUpTokenRefresh();
      // cho chay interval
      setUpAutoRefresh();
       console.log("Authentication successful");
     }
     catch(error){
        console.error("Failed to get account infor ",error)
          handleLogout()
     }
},[setUpTokenRefresh,setUpAutoRefresh,handleLogout])
//check valid of is token valid 
//tu payload ta se lay gio hien
const isTokenValid=useCallback((token)=>{
    if(!token)return false;
    try{
        const payload=JSON.parse(atob(token.split('.')[1]))
        const currentTime=Date.now()/1000
        return payload.exp>(currentTime+60);
    }catch(error){
        console.error("invalid token format:",error)
        return false
    }
},[])

const login = useCallback(async() => {
    try {
        setIsLoading(true);
        const keycloak = await getKeycloakInstance();
        
        if (keycloak.token && keycloak.refreshToken) {
            await updateToken(keycloak.token, keycloak.refreshToken);
            await authenticateUser();
            
            // Giải mã token và kiểm tra role ADMIN
            try {
                const payload = JSON.parse(atob(keycloak.token.split('.')[1]));
                const hasAdminRole = payload.realm_access?.roles?.includes('ADMIN') || false;
                setAdmin(hasAdminRole);
                console.log(hasAdminRole)
            } catch (decodeError) {
                console.error("Failed to decode token:", decodeError);
                setAdmin(false);
            }
            
            return true;
        }
        return false;
    } catch (error) {
        console.error("login failed ", error);
        handleLogout();
        return false;
    } finally { 
        setIsLoading(false);
    }
}, [updateToken, authenticateUser, handleLogout]);
//tai authenticate on app start
useEffect(()=>{
    const initAuth=async()=>{
    try{
        const savedToken =localStorage.getItem("kc_token");
        const savedRefreshToken=localStorage.getItem("kc_refreshToken");
        if(savedToken&&savedRefreshToken&& isTokenValid(savedToken))
        {
                 console.log("Found valid saved token , restoreing session")
                 await updateToken(savedToken,savedRefreshToken)
                 await authenticateUser();
        }
        else{
            console.log("no valid save token found ")
            if(savedToken||savedRefreshToken){
                localStorage.removeItem("kc_token")
                localStorage.removeItem("kc_refreshToken")
            }
        }
    }catch(error){
        console.error("Auth initialization error",error)
        handleLogout()
    }
    finally{
        setIsLoading(false)
    }
}
 initAuth()
 return ()=>{
    if(refreshInterval){
        clearInterval(refreshInterval)
    }
 }
},[])
 const contextValue = {
    isAuthentication,
    setAuthentication,
    user,
    setUser,
    isLoading,
    handleLogout,
    refreshToken,
    login,
    isCreator,
    setCreator,
    setCreatorInfor,
    creatorInfor,
    isAdmin
  };

  return (
    <AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>
  )
}
  