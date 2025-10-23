import { replace } from 'react-router-dom';
import {apiclient }from './BaseApi';
import { callApi } from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';
export const feedbackApi = {
createFeedback:(courseId,detail,rate)=>{
  
            return callApi(
                () => apiclient.post(API_ENDPOINTS.FEEDBACK.CREATE_FEEDBACK.replace(':courseId',courseId),null,{
                    params:{
                        detail:detail
                        ,
                        rate:rate
                    }
                }),
                { errorMessage: 'Không thể tao feedback' }
            );
       
}
}