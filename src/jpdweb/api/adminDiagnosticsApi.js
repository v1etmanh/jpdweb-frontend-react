import { apiclient } from './BaseApi';
import { callApi } from './apiClient';
import { API_ENDPOINTS } from './apiEndpoints';

export const adminDiagnosticsApi = {
  /**
   * 🧵 Lấy tóm tắt thread (tổng số thread, trạng thái, daemon,...)
   */
  getThreadSummary: () => {
    return callApi(
      () => apiclient.get(API_ENDPOINTS.APP_DIAGNOSTICS.GET_THREAD_SUMMARY),
      {
        errorMessage: 'Không thể tải thông tin thread summary',
      }
    );
  },

  /**
   * 📜 Lấy danh sách loggers và mức log hiện tại
   * @param {string} filter (tuỳ chọn)
   */
  getLoggers: (filter = '') => {
    return callApi(
      () =>
        apiclient.get(API_ENDPOINTS.APP_DIAGNOSTICS.GET_LOGGERS, {
          params: { filter },
        }),
      {
        errorMessage: 'Không thể tải danh sách loggers',
      }
    );
  },

  /**
   * 🌿 Lấy thông tin environment (các property source)
   * @param {string} filter (tuỳ chọn)
   */
  getEnvironment: (filter = '') => {
    return callApi(
      () =>
        apiclient.get(API_ENDPOINTS.APP_DIAGNOSTICS.GET_ENVIRONMENT, {
          params: { filter },
        }),
      {
        errorMessage: 'Không thể tải thông tin environment',
      }
    );
  },

  /**
   * 🫘 Lấy tóm tắt beans (tổng số bean, thống kê theo package)
   */
  getBeansSummary: () => {
    return callApi(
      () => apiclient.get(API_ENDPOINTS.APP_DIAGNOSTICS.GET_BEANS_SUMMARY),
      {
        errorMessage: 'Không thể tải thông tin beans summary',
      }
    );
  },
};
