import api from "../api/httpRequest";
import { defineStore } from "pinia";

export const useShowStore = defineStore('tv', {
  state: () => ({
    trending: [],
    popular: [],
    topRated: [],
    airingToday: [],
    discoverShow: [],
    meta: { title: '', description: '' },
    totalPages: 0,
    currentPage: 1,
    discoverLoading: false,
  }),

  actions: {
    async fetchPopularShows() {
      try {
        const { data } = await api.get('/tv/popular');
        this.popular = data.results;
        return { message: data.message };
      } catch (err) {
        return { message: err.response?.data?.message || "Failed to load popular shows" };
      }
    },

    async fetchTopRatedShows() {
      try {
        const { data } = await api.get('/tv/top_rated');
        this.popular = data.results;
        return { message: data.message };
      } catch (err) {
        return { message: err.response?.data?.message || "Failed to top rated shows" };
      }
    },

    async fetchAiringTodayShows() {
      try {
        const { data } = await api.get('/tv/airing_today');
        this.popular = data.results;
        return { message: data.message };
      } catch (err) {
        return { message: err.response?.data?.message || "Failed to load airing today shows" };
      }
    },

    async fetchDiscoverShows(params = {}) {
      const page = parseInt(params.page || 1);

      if (page === 1) {
        this.discoverShow = []; 
        this.meta = { title: 'Loading...', description: '' };
      }

      this.discoverLoading = true;
      try {
        const { data } = await api.get('/tv/discover', {params});

        if (page > 1) {
          this.discoverShow = [...this.discoverShow, ...data.results]
        } else {
          this.discoverShow = data.results;
        }

        this.meta = data.meta;
        this.totalPages = data.total_pages;
        this.currentPage = data.page;
        return data.results.length;
      } catch (err) {
        return { message: err.response?.data?.message || "Failed to load discover shows" };
      } finally {
        this.discoverLoading = false;
      }
    },
  }
});