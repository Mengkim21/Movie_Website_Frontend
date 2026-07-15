<script setup>
import { computed, onMounted } from 'vue';
import { useMovie } from '../../composables/useMovie';
import { useMovieStore } from '../../stores/movieStore';
import HeroBanner from '../../components/HeroBanner.vue';
import MovieRow from '../../components/MovieRow.vue';

const { isLoading, isError, loadHomeMovies } = useMovie();
const movieStore = useMovieStore();

onMounted(async () => {
  if (movieStore.trending.length === 0) {
    await loadHomeMovies();
  }
})

const featuredMovies = computed(() => movieStore.trending[0]);
</script>

<template>
  <div class="min-h-screen">
    <div v-if="isLoading" class="h-screen flex items-center justify-center">
      <div class="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
    </div>

    <div v-else>
      <HeroBanner :movie="featuredMovies"/>

      <div class="relative -mt-20 z-20 space-y-8">
        <MovieRow title="Trending This Week" :movies="movieStore.trending"/>
        <MovieRow title="Popular Movies" :movies="movieStore.popular"/>
        <MovieRow title="Top Rated Movies" :movies="movieStore.topRated"/>
      </div>
    </div>

    <div v-if="isError" class="fixed bottom-10 right-10 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl">
      {{  isError }}
    </div>
  </div>
</template>