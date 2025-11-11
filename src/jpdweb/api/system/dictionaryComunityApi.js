import { apiclient } from '../core/BaseApi';
import { callApi } from '../core/apiClient';
import { API_ENDPOINTS } from '../core/apiEndpoints';

export const dictionaryCommunityApi = {
    /**
     * Lấy danh sách từ vựng (phân trang)
     * @param {number} page 
     * @param {number} size 
     */
    getAllWords: (page = 0, size = 20) => {
        return callApi(
            () => apiclient.get(`${API_ENDPOINTS.DICTIONARY_COMMUNITY.GET_ALL_WORDS}?page=${page}&size=${size}`),
            { errorMessage: 'Không thể tải danh sách từ vựng' }
        );
    },

    /**
     * Tìm kiếm từ vựng theo keyword
     * @param {string} keyword 
     * @param {number} page 
     * @param {number} size 
     */
    searchWords: (keyword, page = 0, size = 20) => {
        return callApi(
            () => apiclient.get(`${API_ENDPOINTS.DICTIONARY_COMMUNITY.SEARCH_WORDS}?keyword=${keyword}&page=${page}&size=${size}`),
            { errorMessage: 'Không thể tìm kiếm từ vựng' }
        );
    },

    /**
     * Lấy chi tiết 1 từ vựng
     * @param {number} id 
     */
    getWordDetail: (id) => {
        return callApi(
            () => apiclient.get(API_ENDPOINTS.DICTIONARY_COMMUNITY.GET_WORD_DETAIL.replace(':id', id)),
            { errorMessage: 'Không thể tải chi tiết từ vựng' }
        );
    },

    /**
     * Vote cho 1 từ
     * @param {number} id 
     */
    voteWord: (id) => {
        return callApi(
            () => apiclient.post(API_ENDPOINTS.DICTIONARY_COMMUNITY.VOTE_WORD.replace(':id', id)),
            { errorMessage: 'Không thể vote cho từ này' }
        );
    },

    /**
     * Hủy vote cho 1 từ
     * @param {number} id 
     */
    unvoteWord: (id) => {
        return callApi(
            () => apiclient.delete(API_ENDPOINTS.DICTIONARY_COMMUNITY.UNVOTE_WORD.replace(':id', id)),
            { errorMessage: 'Không thể hủy vote từ này' }
        );
    },

    /**
     * Lấy top các từ được vote nhiều nhất
     * @param {number} limit 
     */
    getTopVotedWords: (limit = 10) => {
        return callApi(
            () => apiclient.get(`${API_ENDPOINTS.DICTIONARY_COMMUNITY.GET_TOP_VOTED}?limit=${limit}`),
            { errorMessage: 'Không thể tải top từ được vote nhiều nhất' }
        );
    }
};
