const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('omniconnect_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({ success: false, error: 'Invalid server response' }));

  if (!response.ok && response.status === 401 && endpoint !== '/auth/login') {
    // Session expired or unauthenticated
    localStorage.removeItem('omniconnect_token');
    localStorage.removeItem('omniconnect_user');
  }

  return { status: response.status, ok: response.ok, ...data };
}

export default API_BASE;
