import { replace } from 'react-router-dom';
import {apiclient }from '../core/BaseApi';
import { callApi } from '../core/apiClient';
import { API_ENDPOINTS } from '../core/apiEndpoints';

export const aiApi = {

  evaluateWriting: (data) => {
    console.log(data)
        return callApi(
            () => apiclient.post(API_ENDPOINTS.AI.WRITING_EVALUATE,data,{headers: { 'Content-Type': 'application/json' }}),
            { errorMessage: 'Không thể lấy thông tin tài khoản' }
        );
    },
}