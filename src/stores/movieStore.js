import api from "../api/httpRequest";
import { defineStore } from "pinia";

export const useMovieStore = defineStore('movies', {
  state: () => ({
    featured: null,
    trending: [],
    popular: [],
    topRated: [],
    upcoming: [],
    discoverMovie: [],
    totalPages: 0,
    currentPage: 1,
    discoverLoading: false
  }),

  actions: {
    async fetchTrendingMovies() {
      try {
        const { data } = await api.get('/movies/trending/week');
        this.trending = data.results;
        return { message: data.message };
      } catch (err) {
        return { message: err.response?.data?.message || "Failed to load trending movies." }
      }
    },

    async fetchTopRatedMovies() {
      try {
        const { data } = await api.get('/movies/top_rated');
        this.topRated = data.results;
        return { message: data.message };
      } catch (err) {
        return { message: err.response?.data?.message || "Failed to load top rated movies." }
      }
    },

    async fetchUpcomingMovies() {
      try {
        const { data } = await api.get('/movies/upcoming');
        this.upcoming = data.results;
        return { message: data.message };
      } catch (err) {
        return { message: err.response?.data?.message || "Failed to load upcoming movies." }
      }
    },

    async fetchPopularMovies() {
      try {
        const { data } = await api.get('/movies/popular');
        this.popular = data.results;
        return { message: data.message };
      } catch (err) {
        return { message: err.response?.data?.message || "Failed to load popular movies." }
      }
    },

    async fetchFeaturedMovies() {
      try {
        const { data } = await api.get('/movies/featured');
        this.featured = data;
        return { message: data.message };
      } catch (err) {
        return { message: err.response?.data?.message || "Failed to load featured movies." };
      }
    },

    async fetchDiscover(params = {}) {
      this.discoverLoading = true;
      try {
        const { data } = await api.get('/movies/discover', { params });
        
        if (params.page > 1) {
          this.discoverMovie = [...this.discoverMovie, ...data.results]
        } else {
          this.discoverMovie = data.results;
        }
        this.totalPages = data.total_pages;
        this.currentPage = params.page || 1;
      } catch (err) {
        return { message: err.response?.data?.message || "Failed to load discover movie" };
      } finally {
        this.discoverLoading = false;
      }
    },

    clearDiscover() {
      this.discoverMovie = [];
      this.currentPage = 1;
    },
  },
})