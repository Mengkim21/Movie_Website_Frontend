import { defineStore } from "pinia";
import api from "../api/httpRequest";

export const useDetailStore = defineStore('details', {
  state: () => ({
    item: null,
    isLoading: false,
    isError: null,
  }),

  actions: {
    async fetchDetails(id, type) {
      this.isLoading = true;
      this.item = null;
      
      const resource = type === 'movie' ? 'movies' : type;
      try {
        const { data } = await api.get(`/${resource}/${id}`);
        this.item = data;
      } catch (err) {
        this.isError = err.response?.data?.message || `Failed to load details ${type}`;
        return { message: this.isError  };
      } finally {
        this.isLoading = false;
      }
    }
  }
});