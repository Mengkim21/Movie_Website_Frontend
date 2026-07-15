import { useMovieStore } from "../stores/movieStore";
import { ref } from "vue";

export function useMovie() {
  const store = useMovieStore();

  const isLoading = ref(false);
  const isError = ref(null);

  const loadHomeMovies = async () => {
    isLoading.value = true;
    isError.value = null;

    try {
      await Promise.all([
        store.fetchTrendingMovies(),
        store.fetchTopRatedMovies(),
        store.fetchUpcomingMovies(),
        store.fetchPopularMovies(),
        store.fetchFeaturedMovies(),
      ]);
    } catch (err) {
      isError.value = err.response?.data?.message || "Unable to load movies.";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    isError,
    loadHomeMovies,
    trending: store.trending,
    topRated: store.topRated,
    upcoming: store.upcoming,
    popular: store.popular,
    featured: store.featured,
  }
}