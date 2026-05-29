const BASE_URL = ''; // Relative path, resolved by Vite dev proxy automatically

export const api = {
  getToken() {
    return localStorage.getItem('nutrisi_token');
  },

  setToken(token) {
    localStorage.setItem('nutrisi_token', token);
  },

  clearToken() {
    localStorage.removeItem('nutrisi_token');
    localStorage.removeItem('nutrisi_user');
  },

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = 'Terjadi kesalahan sistem.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // Fallback if not json
      }
      throw new Error(errorMessage);
    }
    return await response.json();
  },

  async get(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  },

  async post(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  },

  async delete(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
};
