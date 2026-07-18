import api from "../api/httpRequest";
import { defineStore } from "pinia";

export const useGenreStore = defineStore('genre', {
  state: () => ({
    movieGenres: [],
    loading: false
  }),

  actions: {
    async fetchMovieGenre() {
      if (this.movieGenres.length > 0) return;
      this.loading = true;

      try {
        const { data } = await api.get('/genre/movie');
        this.movieGenres = data.genres;
        return { message: data.message };
      } catch (err) {
        return { message: err.response?.data?.message || "Failed to load movie gnere"};
      } finally {
        this.loading = false;
      }
    }
  }
})