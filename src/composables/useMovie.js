import { useMovieStore } from "../stores/movieStore";
import { ref } from "vue";

export function useMovie() {
  const store = useMovieStore();

  const isLoading = ref(false);
  const isError = ref(null);

  const loadHomeMovies = () => {
    isLoading.value = true;
    isError.value = null;

    try {
      // await Promise.all([
      //   store.fetchTrendingMovies(),
      //   store.fetchFeaturedMovies(),
      //   store.fetchPopularMovies(),
      //   store.fetchTopRatedMovies(),
      //   store.fetchUpcomingMovies()
      // ]);
      store.fetchTrendingMovies(),
      store.fetchFeaturedMovies(),
      store.fetchPopularMovies(),
      store.fetchTopRatedMovies(),
      store.fetchUpcomingMovies()
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
  }
}