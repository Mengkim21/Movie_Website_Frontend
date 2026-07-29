import { defineStore } from "pinia";
import api from "../api/httpRequest";

export const useSearchStore = defineStore('search', {
  state: () => ({
    searchResults: [],
    isLoading: false
  }),

  actions: {
    async searchMulti(query) {
      if (!query) return;
      this.isLoading = true;

      try {
        const { data } = await api.get('/search/multi', { params: { query } });

        this.searchResults = data.results;
      } catch (err) {
        return { message: err.response?.data?.message || "Search error" };
      } finally {
        this.isLoading = false;
      }
    }
  }
})