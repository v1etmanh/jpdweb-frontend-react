// src/api/services/courseApi.js
import { apiclient } from "../core/BaseApi";
import { callApi } from "../core/apiClient";
import { API_ENDPOINTS } from "../core/apiEndpoints";

export const courseApi = {
  /**
   * Lấy chi tiết khóa học
   * @param {number} id - ID khóa học
   */
  getCourseDetail: (id) => {
    return callApi(
      () => apiclient.get(API_ENDPOINTS.COURSE.GET_DETAIL.replace(":id", id)),
      { errorMessage: "Không thể lấy chi tiết khóa học" }
    );
  },

  /**
   * Tìm kiếm khóa học
   * @param {string} keyword - Từ khóa tìm kiếm
   */
  searchCourse: (keyword, currentPage, pageSize, sortParam) => {
    return callApi(
      () =>
        apiclient.get(API_ENDPOINTS.COURSE.SEARCH, {
          params: {
            name: keyword,
            page: currentPage,
            size: pageSize,
            sort: sortParam,
          },
        }),
      { errorMessage: "Không thể tìm kiếm khóa học" }
    );
  },

  /**
   * Lấy khóa học được khuyến nghị
   */
  getRecommendCourses: () => {
    return callApi(() => apiclient.get(API_ENDPOINTS.COURSE.GET_RECOMMEND), {
      errorMessage: "Không thể lấy khóa học được khuyến nghị",
    });
  },
};
