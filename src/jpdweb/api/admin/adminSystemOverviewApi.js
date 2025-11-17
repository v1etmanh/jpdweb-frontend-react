import { apiclient } from '../core/BaseApi';
import { callApi } from '../core/apiClient';
import { API_ENDPOINTS } from '../core/apiEndpoints';

export const adminSystemOverviewApi = {
  /**
   * 🌐 Lấy thông tin tổng quan hệ thống (CPU, Memory, Disk, DB, HTTP, App)
   */
  getOverview: () => {
    return callApi(
      () => apiclient.get(API_ENDPOINTS.ADMIN.ADMIN_OVERVIEW),
      {
        errorMessage: 'Không thể tải thông tin tổng quan hệ thống',
      }
    );
  },
 
 getChart: () => {
    return callApi(
      () => apiclient.get(API_ENDPOINTS.ADMIN.ADMIN_CHART),
      {
        errorMessage: 'Không thể tải thông tin tổng quan hệ thống',
      }
    );
  },
  /**
   * 💓 Lấy trạng thái sức khỏe của hệ thống (UP / DOWN / UNKNOWN)
   */
  getHealthStatus: () => {
    return callApi(
      () => apiclient.get(API_ENDPOINTS.APP_OVERVIEW.GET_HEALTH),
      {
        errorMessage: 'Không thể tải trạng thái hệ thống',
      }
    );
  },
};
