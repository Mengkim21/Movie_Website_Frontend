import { defineStore } from "pinia";
import api from "../api/httpRequest";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useReviewStore = defineStore('reviews', {
  state: () => ({
    mediaReviews: [],
    isLoading: false,
    isError: null,
  }),

  actions: {
    async fetchMediaReviews(id, type) {
      this.isLoading = true;

      try {
        const { data } = await api.get(`/reviews/${type}/${id}`);
        this.mediaReviews = data.results;
      } catch (err) {
        this.isError = err.response?.data?.message || "Failed to load reviews";
      } finally {
        this.isLoading = false;
      }
    },

    async postReview(reviewData) {
      try {
        await api.post('/reviews/add', reviewData);
        toast.success("Review posted!");

        this.fetchMediaReviews(reviewData.media_id, reviewData.media_type);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to post reviews")
      }
    }
  }
});