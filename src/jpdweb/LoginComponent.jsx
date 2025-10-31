import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./security/Authentication";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { initKeycloak } from "./api/KeycloakService";

export default function LoginComponent(){
    const {isAuthentication,login,isLoading,isAdmin}=useAuth();
    const nav=useNavigate();
    const location =useLocation();
    const[isLoggingIn,setIsLoggingIn]=useState(false)
// ví dụ a mún  từ login tới .// mặc định nó sẽ đi /home
const from =location.state?.from?.pathname||"/"
useEffect(()=>{
    //neeu da authenticated thi redirect ve trang go
    if(isAuthentication){
      if(!isAdmin)
        nav(from,{replace:true})
      else 
        nav("/admin/app_overview")
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
},[isAuthentication, isLoading, nav, from, login, isLoggingIn, isAdmin])
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-700">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  if (isLoggingIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-700 font-semibold">Đang đăng nhập...</p>
          <p className="text-sm text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  // Fallback UI (shouldn't normally be seen)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Yêu cầu đăng nhập</h2>
        <p className="text-gray-600">Đang chuyển hướng đến trang đăng nhập...</p>
      </div>
    </div>
  );
}