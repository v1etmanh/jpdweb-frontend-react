import { data } from "react-router-dom";
import { apiclient } from "./BaseApi";
import { captureOwnerStack } from "react";
export const getAccount=()=>{
    return apiclient.get("/api/customer/account_infor")
}
export const uploadProfile=(data)=>{
    return apiclient.post("/api/customer/upload_profile",data,  {headers: {
                'Content-Type': 'multipart/form-data'
            }})
}
export const getCreatorAccount=()=>{
    return apiclient.get("/api/creator/getAccount")
}
export const uploadPaypalEmail = (data) => {
  return apiclient.post("/api/creator/upload/paypalEmail", null, {
    params: { pEmail: data }
  });
};
export const uploadCertificate = (files) => {
  // Tạo FormData BÊN TRONG hàm này
  const formData = new FormData();
  
  // Thêm tất cả files - phải khớp tên với @RequestParam
  files.forEach((file) => {
    formData.append('certificateFile', file); 
  });
  
  // Gọi API với FormData
  return apiclient.post("/api/creator/upade_certificate", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const createNewCourse=(data)=>{
  return apiclient.post("/api/creator/course/create",data,{headers: {
                'Content-Type': 'multipart/form-data'
            }})
}
export const retriveCreatorStatistic=()=>{
  return apiclient.get("/api/creator/getStatisticInfor");
}
export const retriveCourseOfCreator=()=>{
  return apiclient.get("/api/creator/course");
}
export const getCourseById=(id)=>{
return apiclient.get(`/api/creator/course/${id}`,)
}
export const generateFeedBack=(data)=>{
  return apiclient.post("/api/creator/AI/generateFeeback",data)
}
export const updateCourse=(data)=>{

}
export const saveImg = (formData) => {
  return apiclient.post("/api/creator/uploadFile/saveImg", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const savePdf = (formData) => {
  return apiclient.post("api/creator/uploadFile/savePdf", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const createNewChapter = ({ name, courseId }) => {
  return apiclient.post(`/api/creator/${courseId}/chapter`, null, {
    params: {
      chapterName: name,
      
    }
  });
};
export const deleteChapter = (courseId,id) => {
  return apiclient.delete(`/api/creator/${courseId}/chapter/${id}`);
}

export const createNewModule=(courseId,chapterId,name)=>{
  return apiclient.post(`/api/creator/${courseId}/${chapterId}/module`,null,
    {params:{
      moduleName:name
    }}
  )
}
export const deleteModule = (courseId,chapterId,id) => {
  return apiclient.delete(`/api/creator/${courseId}/${chapterId}/module/${id}`);
}


export const updateCourseMaterial=(courseId,chapterId,moduleId,data)=>{
  return apiclient.post(`/api/creator/${courseId}/${chapterId}/${moduleId}`,data)
}
export const deleteModuleContent=(courseId,chapterId,moduleId,moduleContentId)=>{
  return apiclient.delete(`/api/creator/${courseId}/${chapterId}/${moduleId}/${moduleContentId}`)
}
export const deleteModuleContentByType=(type,moduleId,chapterId,courseId)=>{
  return apiclient.delete(`/api/creator/${courseId}/${chapterId}/${moduleId}/deleteModuleContentByType`,{params:{
   
    type:type,

  }})
}
export const getContentByTypeAndModule=(type,moduleId,chapterId,courseId)=>{
   return apiclient.get(`/api/creator/${courseId}/${chapterId}/${moduleId}`,{params:{
   
    type:type,

  }})
}
export const retrieveCCourse=()=>{
  return apiclient.get("/api/creator/course/retrieve_CommercialCourese");
}
export const getEnrollementByCourseId=(courseId)=>{
   return apiclient.get(`api/creator/enrollment/${courseId}`);
}
export const createWithdraw=(amount)=>{
  return apiclient.post("/api/creator/createWithdraw",null,{params:{
    amount:amount
  }})
}
export const retrieveTransactionHistory=()=>{
  return apiclient.get("/api/creator/history_transaction");
}
export const retrieveRecommendCourses=()=>{
  return apiclient.get("/api/course/recommend_courses");
}
export const findCourseByKey=(name)=>{
  return apiclient.get("/api/course/search",{params:{name:name}});
}
export const changeCourseStatus=(id)=>{
  return apiclient.get(`/api/creator/course/${id}/setCourseStatus`)
}
export const getCourseDetail=(id)=>{
  return apiclient.get(`/api/course/${id}`)

  } 
   export const createTransaction=(amount,courseId)=>{
      return  apiclient.post(`/api/paypal/create-order/${courseId}`,null,{params:{
          amount:amount
        }})
   }
   export const enrollCourse=(joinkey,courseId)=>{
    return apiclient.post(`/api/enroll/${courseId}`,null,{params:{
      joinKey:joinkey
    }})
   }
   export const addToWishlist=(courseId)=>{
    return apiclient.post(`/api/wishlist/${courseId}`,null)
   }
   export const loadLearningList=()=>{
    return apiclient.get("/api/customer/learning_course_list")
   }
export const loadContentOverview=(courseId)=>{
  return apiclient.get(`/api/customer/learning/${courseId}/courseOverview`)
}
export const loadModuleContent=(courseId,chapterId,moduleId,typeOfContent)=>{
  return apiclient.get(`/api/customer/learning/${courseId}/${chapterId}/${moduleId}/moduleContent`,{params:{
    typeOfContent:typeOfContent
  }})
}