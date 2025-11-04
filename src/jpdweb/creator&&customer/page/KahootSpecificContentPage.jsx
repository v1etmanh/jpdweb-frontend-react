import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { kahootApi } from "../../api/creator/kahootApi";
import { showSuccessNotification, showWarningNotification } from "../../api/core/apiClient";
import MixedQuestionForm from "../component/KahootForm";
import { kahootModuleContentApi } from "../../api/creator/kahootModuleContentApi";

export default function  KahootSpecificContentPage(){
    const{id}=useParams();
    const[isLoading,setIsLoading]=useState(true)
    const[data,setData]=useState([])
    const fetchData = async () => {
    setIsLoading(true);
    
    const response = await kahootApi.getModuleContents(id);
   
    if (response.success) {
      const data = response.data;
     
      setData(data);
    
      // Auto load first content
      
    } else {
       showWarningNotification("fail to fetch data")
    } 
    setIsLoading(false);
  };
    useEffect(()=>{fetchData()},[id])
    const handleDeleteContent = async ( mcId) => {
        if (window.confirm('Are you sure you want to delete this content?')) {
         
         const response=   await  kahootModuleContentApi.deleteOne(id, mcId);
            
            // Update cache
            if(response.success){
           showSuccessNotification("delete sucessfully")
          }
          else{
            showWarningNotification( 'Không thể xóa content')
          }
            
          
        }
      }; 
      const saveModuleContent = async ( contents) => {
        
          
          
            const response = await kahootModuleContentApi.updateAll(id, contents);
            
            // Update cache with saved content
            if(response.success){
           
            
           showSuccessNotification("Save Successfull")
          }
          else{
          showWarningNotification("fail to fetch content ")
            
          }
        };
     if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  return <MixedQuestionForm
  onSubmit={saveModuleContent}
   initialData={data}
    onDelete={handleDeleteContent}
  ></MixedQuestionForm>
}