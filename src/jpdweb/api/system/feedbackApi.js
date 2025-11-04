import { replace } from 'react-router-dom';
import {apiclient }from '../core/BaseApi';
import { callApi } from '../core/apiClient';
import { API_ENDPOINTS } from '../core/apiEndpoints';
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