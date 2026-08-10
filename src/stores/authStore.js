import { defineStore } from "pinia";
import api from "../api/httpRequest";
import { useProfileStore } from "./profileStore";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    profile: null,
    error: null,
    success: null,
    token: localStorage.getItem('token') || null,
    isValidated: false
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

        await this.getProfile();

        this.error = null;
        this.success = data.message;
        return { 
          success: true, 
          message: data.message || "Log in successful!"
        };
      } catch (err) {
        this.error = err.response?.data?.message;
        return {
          success: false,
          message: err.response?.data?.message || "Log in failed",
        }
      }
    },

    async register(credentials) {
      try {
        const { data } = await api.post('/auth/register', credentials);
        this.token = data.session?.access_token;
        this.user = data.user;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', this.token);

        this.error = null;
        this.success = data.message;
        return {
          success: true,
          message: data.message || "Register successful!",
        }
      } catch (err) {
        this.error = err.response?.data?.message;
        return {
          success: false,
          message: err.response?.data?.message || "Register failed",
        }
      }
    },

    async updateProfile(credential) {
      try {
        const { data } = await api.patch('/auth/update', credential);
        this.profile = data.user;

        this.success = data.message;
        return {
          success: true,
          message: data.message || "Profile updated successfully",
        }
      } catch (err) {
        this.error = err.response?.data?.message;
        return {
          success: false,
          message: err.response?.data?.message || "Failed to update profile",
        }
      }
    },

    async getProfile() {
      try {
        const { data } = await api.get('/auth/me');
        this.profile = data.user;
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to load profile";
        return {
          success: false,
          message: this.error
        }
      }
    },

    async checkAuth() {
      if (!this.token) {
        this.isValidated = false;
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        this.user = data.user;
        this.isValidated = true;
      } catch (error) {
        console.error('Session expired');
        this.logout();
      } 
    },

    updateToken(newToken) {
      this.token = newToken;
      localStorage.setItem('token', newToken);
    },
    
    logout() {
      this.user = null;
      this.token = null;
      this.isValidated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const profileStore = useProfileStore();
      profileStore.resetCollections();
      
      window.location.href = '/login';
    }
  }
})