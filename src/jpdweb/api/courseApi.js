// src/api/services/courseApi.js
import { apiclient } from "./BaseApi";
import { callApi } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";

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
  searchCourse: (keyword) => {
    return callApi(
      () =>
        apiclient.get(API_ENDPOINTS.COURSE.SEARCH, {
          params: { name: keyword },
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

  /**
   * Tìm kiếm, lọc và phân trang khóa học
   * @param {object} filters - Đối tượng DTO chứa các bộ lọc (keyword, minPrice, ...)
   * @param {object} pageable - Đối tượng chứa { page, size, sort }
   */
  searchCoursesPaginated: (filters, pageable) => {
    return callApi(
      () =>
        apiclient.post(
          API_ENDPOINTS.COURSE.SEARCH_PAGINATION,
          filters, // Gửi filters DTO làm Request Body
          {
            params: {
              // Gửi pageable làm Query Params
              page: pageable.page,
              size: pageable.size,
              // sort: pageable.sort (Ví dụ: 'name,asc')
            },
          }
        ),
      { errorMessage: "Không thể tìm kiếm khóa học" }
    );
  },
};
