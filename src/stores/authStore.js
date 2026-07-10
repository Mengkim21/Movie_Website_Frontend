import { defineStore } from "pinia";
import api from "../api/httpRequest";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    error: null,
    success: null,
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    async login(credentials) {
      try {
        const res = await api.post('/auth/login', credentials);
        this.token = res.data.session.access_token;
        this.user = res.data.user;
        localStorage.setItem('token', this.token);

        this.error = null;
        return { success: true, message: res.data.message };
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
        const res = await api.post('/auth/register', credentials);
        this.token = res.data.session.access_token;
        this.user = res.data.user;
        localStorage.setItem('token', this.token);

        this.success = res.data.message || "Register successful!";
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
    }
  }
})