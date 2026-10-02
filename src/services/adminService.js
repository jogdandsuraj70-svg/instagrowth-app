import { fetchApi } from '../config/api';

export const adminService = {
  async getMetrics() {
    return await fetchApi('/admin/metrics');
  },

  async getSubmissions(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.platform) query.append('platform', params.platform);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await fetchApi(`/admin/submissions${queryString}`);
  },

  async deleteSubmission(id) {
    return await fetchApi(`/admin/submissions/${id}`, {
      method: 'DELETE'
    });
  }
};
