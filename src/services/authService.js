import { fetchApi } from '../config/api';

export const authService = {
  async login(email, password) {
    return await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async register(email, password, name) {
    return await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
  },

  async connectOAuth(provider, oauthToken, email, name) {
    return await fetchApi('/auth/oauth', {
      method: 'POST',
      body: JSON.stringify({ provider, oauthToken, email, name })
    });
  },

  async getCurrentUser() {
    return await fetchApi('/auth/me');
  }
};
