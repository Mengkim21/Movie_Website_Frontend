<script setup>
import { computed, onMounted } from 'vue';
import { useMovie } from '../../composables/useMovie.js';
import { useTV } from '../../composables/useTV.js';
import { useMovieStore } from '../../stores/movieStore.js';
import { useTVStore } from '../../stores/tvStore.js';
import HeroBanner from '../../components/HeroBanner.vue';
import MediaRow from '../../components/MediaRow.vue';

const { isLoading, isError, loadHomeMovies } = useMovie();
const { loadHomeTV } = useTV();
const movieStore = useMovieStore();
const tvStore = useTVStore();

onMounted(async () => {
  if (movieStore.trending.length === 0) {
    await loadHomeMovies();
  } else {
    await loadHomeTV();
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
        <MediaRow title="Trending Movies This Week" :items="movieStore.trending"/>
        <MediaRow title="Trending Shows This Week" :items="tvStore.trending"/>
        <MediaRow title="Popular Movies" :items="movieStore.popular"/>
        <MediaRow title="Popular Shows" :items="tvStore.popular"/>
        <MediaRow title="Top Rated Movies" :items="movieStore.topRated"/>
        <MediaRow title="Top Rated Shows" :items="tvStore.topRated"/>
      </div>
    </div>

    <div v-if="isError" class="fixed bottom-10 right-10 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl">
      {{  isError }}
    </div>
  </div>
</template>