import { data } from "react-router-dom";
import { apiclient } from "./BaseApi";
import { captureOwnerStack } from "react";
export const getAccount=()=>{
    return apiclient.get("/api/customer/account_infor")
}
export const uploadProfile=(data)=>{
    return apiclient.post("/api/creator/upload_profile",data,  {headers: {
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
export const createNewCourse=(data)=>{
  return apiclient.post("/api/course/create",data,{headers: {
                'Content-Type': 'multipart/form-data'
            }})
}
export const retriveCourseOfCreator=()=>{
  return apiclient.get("/api/course/retrieveByEmail");
}
export const getCourseById=(id)=>{
return apiclient.get("/api/course/getCourseContent",{params:{
  id:id
}})
}
export const generateFeedBack=(data)=>{
  return apiclient.post("/api/course/generateFeeback",data)
}
export const updateCourse=(data)=>{

}
export const saveImg = (formData) => {
  return apiclient.post("/api/course/saveImg", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const createNewChapter = ({ name, courseId }) => {
  return apiclient.post("/api/course/createChapter", null, {
    params: {
      chapterName: name,
      courseId: courseId
    }
  });
};
export const deleteChapter = (id) => {
  return apiclient.delete(`/api/course/deleteChapter/${id}`);
}

export const createNewModule=(data)=>{
  return apiclient.post("/api/course/createModule",data)
}
export const deleteModule = (id) => {
  return apiclient.delete(`/api/course/deleteModule/${id}`);
}

export const savePdf = (formData) => {
  return apiclient.post("/api/course/savePdf", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const updateCourseMaterial=(data)=>{
  return apiclient.post("/api/course/update_course",data)
}
export const deleteModuleContent=(moduleContentId)=>{
  return apiclient.delete(`/api/course/deleteModuleContent/${moduleContentId}`)
}
export const deleteModuleContentByType=(type,moduleId,chapterId,courseId)=>{
  return apiclient.delete("/api/course/deleteModuleContentByType",{params:{
    moduleId:moduleId,
    type:type,
    chapterId:chapterId,
    courseId:courseId
  }})
}