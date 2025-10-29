import Keycloak from "keycloak-js";
const keycloakConfig = {
  url: 'http://localhost:8080/',
  realm: 'jpdweb',
  clientId: 'webjpdapitest'
};

const keycloakInstance=new Keycloak(keycloakConfig)
let initPromise=null;//tao singleton cho khoi tao
let isInitialized=false;//da khoi tao ch
//neu ch hua thu tao 
export const initKeycloak= async()=>{
  if(!initPromise){
     initPromise=keycloakInstance.init({
        onLoad:"login-required",
        checkLoginIframe:false,
        pkceMethod:"S256"
     }).then(authenticated=>{
        isInitialized=true
        return authenticated;
     }).catch(error=>{
        console.log("keycloak init false"+error)
        initPromise=null;
          isInitialized = false; 
        throw error;

     })
  }
  return initPromise;
}
//log out 
//don dep toan bo bo nho
//reset lai trang thai cua promis vaf da khoi tao
//goi keycloak log out
//redirect ve trang chu
export const logOutKeycloak=()=>{
    //clear localstorage
    localStorage.removeItem("kc_token")
    localStorage.removeItem("kc_refreshToken")
    localStorage.removeItem("kc_email")
    // reset init state
    isInitialized=false;
    initPromise=null;
    // call log out of keycloak
    if(keycloakInstance){
        try{
            return keycloakInstance.logout({
                redirectUri:window.location.origin
            });
        }catch(error){
            console.log("logout false"+error)
            window.location.href=window.location.origin;
            return Promise.resolve()
        }
    }
    return Promise.resolve();
}
//neu trong code co loi dan toi
// khi 1 th goi function do
// se dan toi loi
// promise dam bao no lun goi dc du ham do co loi
export const getKeycloakInstance=async()=>{
    if(!isInitialized){
        await initKeycloak();
    }
    return  keycloakInstance;
}
export default keycloakInstance;