import { replace } from 'react-router-dom';
import {apiclient }from './BaseApi';
import { callApi } from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';
export const reportApi = {
createReport:(data)=>{
  
            return callApi(
                () => apiclient.post(API_ENDPOINTS.REPORT.REPORT_COURSE,data),
                { errorMessage: 'Không thể update' }
            );
       
}
}