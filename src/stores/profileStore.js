import { defineStore } from "pinia";
import api from "../api/httpRequest";
import { useToast } from "vue-toastification";

const toast = useToast();

export const useProfileStore = defineStore('profile', {
  state: () => ({
    watchlist: [],
    history: [],
    reviews: [],
    isLoading: false,
    isError: null
  }),

  actions: {
    async fetchUserCollections() {
      this.isLoading = true;
      this.isError = null;
      
      try {
        const [ watchlistRes, historyRes, reviewsRes ] = await Promise.all([
          api.get('/watchlist/view'),
          api.get('/history/view'),
          api.get('/reviews/me')
        ]);

        this.watchlist = watchlistRes.data.results || [];
        this.history = historyRes.data.results || [];
        this.reviews = reviewsRes.data.results || [];
      } catch (err) {
        this.isError = err.response?.data?.message || "Failed to load profile data";
      } finally {
        this.isLoading = false;
      }
    },

    async addToWatchlist(media) {
      try {
        await api.post('/watchlist/add', {
          media_id: media.id,
          media_type: media.media_type
        });

        toast.success(`"${media.title}" added to your watchlist.!`);
        this.fetchUserCollections();
      } catch (err) {
        toast.info(err.response?.data?.message || "Already in watchlist");
      }
    },

    async removeFromWatchlist(mediaId, mediaType) {
      try {
        await api.delete('/watchlist/remove', {
          data: { media_id: mediaId, media_type: mediaType }
        });
        
        toast.success('Removed from watchlist.');
        this.fetchUserCollections();
      } catch (error) {
        toast.error("Failed to remove item.");
      }
    },

    async addToHistory(mediaId, mediaType, title) {
      try {
        await api.post('/history/add', {
           media_id: mediaId,
           media_type: mediaType
        });

        toast.info(`Now playing: ${title}. Added to history.`);
        this.fetchUserCollections();
      } catch (err) {
        console.error("History error");
      }
    },

    resetCollections() {
      this.watchlist = [];
      this.history = [];
      this.reviews = [];
      this.isError = null;
    }
  }
});