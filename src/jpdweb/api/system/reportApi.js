import { replace } from 'react-router-dom';
import {apiclient }from '../core/BaseApi';
import { callApi } from '../core/apiClient';
import { API_ENDPOINTS } from '../core/apiEndpoints';
export const reportApi = {
createReport:(data)=>{
  
            return callApi(
                () => apiclient.post(API_ENDPOINTS.REPORT.REPORT_COURSE,data),
                { errorMessage: 'Không thể update' }
            );
       
}
}