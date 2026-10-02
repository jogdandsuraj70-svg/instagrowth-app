import { fetchApi } from '../config/api';

export const deviceService = {
  async submitDeviceRecord(payload) {
    return await fetchApi('/submissions', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getMySubmissions() {
    return await fetchApi('/submissions/mine');
  }
};
