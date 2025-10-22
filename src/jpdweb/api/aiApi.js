import { replace } from 'react-router-dom';
import {apiclient }from './BaseApi';
import { callApi } from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

export const aiApi = {

  evaluateWriting: (data) => {
    console.log(data)
        return callApi(
            () => apiclient.post(API_ENDPOINTS.AI.WRITING_EVALUATE,data,{headers: { 'Content-Type': 'application/json' }}),
            { errorMessage: 'Không thể lấy thông tin tài khoản' }
        );
    },
}