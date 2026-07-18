import { defineStore } from "pinia";
import api from "../api/httpRequest";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    error: null,
    success: null,
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token && !!state.user,
  },

  actions: {
    async login(credentials) {
      try {
        const { data } = await api.post('/auth/login', credentials);
        this.token = data.session.access_token;
        this.user = data.user;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', this.token);

        this.error = null;
        return { 
          success: true, 
          message: data.message 
        };
      } catch (err) {
        this.error = err.response?.data?.message;
        return {
          success: false,
          message: err.response?.data?.message || "Login failed"
        }
      }
    },

    async register(credentials) {
      try {
        const { data } = await api.post('/auth/register', credentials);
        this.token = data.session.access_token;
        this.user = data.user;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', this.token);

        this.success = data.message || "Register successful!";
        return {
          success: true,
          message: this.success,
        }
      } catch (err) {
        this.error = err.response?.data?.message;
        return {
          success: false,
          message: err.response?.data?.message || "Register failed"
        }
      }
    },
    
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
})