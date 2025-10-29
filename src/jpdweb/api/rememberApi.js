
import { replace } from 'react-router-dom';
import {apiclient }from './BaseApi';
import { callApi } from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

export const rememberWordApi = {
      getAll: () => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.REMEMBERWORD.RETRIEVE_ALL),
            { errorMessage: 'Không thể tải your words' }
        );
    },
    /** 
    ** @param {data} data 
    */
    createNew: (data) => {
        return callApi(
            () => apiclient.post(API_ENDPOINTS.REMEMBERWORD.CREATE_NEW,data),
            { errorMessage: 'Không thể tải your words' }
        );
    },
    /** 
    * @param {number} id
    */
      deleteWord: (id) => {
        return callApi(
            () => apiclient.post(API_ENDPOINTS.REMEMBERWORD.DELETE_WORD.replace(':id',id)),
            { errorMessage: 'Không thể tải your words' }
        );
    },

}
    /**/