import { apiclient } from "./BaseApi";
import keycloakInstance from "./KeycloakService";

let isRefreshing=false;
let failedQueue=[];
// xu ly cac request pending do request het han 
// neu no loi cac request pending fail theo
// neu thanh cong ta se xu ly cac request dag pending
// chi giai quyet khi gap van de unothorization 
// co che la'
//nếu ch refresh thì refresh token
//nếu dang reresh thì bỏ cái request đó vào hàng đợi
// sau khi refresh thành công thì xử lý tất cả
// neu thất bại thì xóa toàn bộ các request và redirect sang trang
//login
const processQueue=(error,token=null)=>{
    failedQueue.forEach(prom=>{
        if(error){
            prom.reject(error)
        }
        else{
            prom.resolve(token)
        }
    });
    failedQueue=[]
}  
// hàm này chạy khi  mà  dc gọi sau kho refresh xog
/*
nếu như  lỗi thì bỏ qua  , ko thì cho nó chạy lại 
 nghĩa là gửi lại request
*/ 


// moi respone di qua apiclient se di qua day
apiclient.interceptors.response.use((response)=>
    // neu thanh cong thi trả về nguyên vẹn >< có lỗi thì xử lí
    response,
    async (error)=>{
        const originalRequest =error.config;// lấy object ban đầu
        // chỉ xử lí khi lỗi là 401 và ch dc xử lí 
        if(error.response?.status===401 && !originalRequest._retry){
            if(isRefreshing){
                //neu dang refresh 
                return new Promise((resolve,reject)=>{
                    failedQueue.push({resolve,reject});
                }).then(token=>{
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiclient(originalRequest);
          //  hứa rằng  nếu hoàn tất sẽ sử lí bằng
          // việc gọi  apiclient để gửi lại
          // ko dc thì kệ mẹ nó

                })
                .catch(err=>{
                    return Promise.reject(err)
                })
            }
            originalRequest._retry=true;
            isRefreshing=true
            try{
                const refreshed=await keycloakInstance.updateToken(0)
                //force to refresh token
                if(refreshed){
                    const newToken=keycloakInstance.token;
                    //update local storage
                    localStorage.setItem("kc_token",newToken)
                    localStorage.setItem("kc_refreshToken",keycloakInstance.refreshToken)
                    //update default header
                      apiclient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                    //process queue request
                    processQueue(null,newToken)
                    //retry original request 
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiclient(originalRequest);
                }
            }catch(error){
                processQueue(error,null)
                //clear tokens and redirect to login
                localStorage.removeItem('kc_token');
                localStorage.removeItem('kc_refreshToken')
                delete apiclient.defaults.headers.common['Authorization'];
        
        // Trigger logout (có thể dispatch action hoặc reload page)
        window.location.href = '/login';
               return Promise.reject(error);
            }
            finally{
                isRefreshing=false;
            }
        }
        return Promise.reject(error)
    }
)
export default apiclient;