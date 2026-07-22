import { useTVStore } from "../stores/tvStore";
import { ref } from "vue";

export function useTV() {
  const store = useTVStore();
  
  const isLoading = ref(false);
  const isError = ref(null);

  const loadHomeTV = async () => {
    isLoading.value = true;
    isError.value = null;

    try {
      await Promise.all([
        store.fetchTrendingShows(),
        store.fetchPopularShows(),
        store.fetchTopRatedShows(),
        store.fetchAiringTodayShows(),
        store.fetchDiscoverShows(),
      ]);
    } catch (err) {
      isError.value = err.response?.data?.message || 'Unable to load tv shows'
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    isError,
    loadHomeTV,
    trending: store.trending,
  }
}