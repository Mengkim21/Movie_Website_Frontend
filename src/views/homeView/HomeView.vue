<script setup>
import { computed, onMounted } from 'vue';
import { useMovie } from '../../composables/useMovie.js';
import { useTV } from '../../composables/useTV.js';
import { useMovieStore } from '../../stores/movieStore.js';
import { useTVStore } from '../../stores/tvStore.js';
import HeroBanner from '../../components/HeroBanner.vue';
import MediaRow from '../../components/MediaRow.vue';
import SkeletonCard from '../../components/SkeletonCard.vue';

const { isLoading, isError, loadHomeMovies } = useMovie();
const { loadHomeTV } = useTV();
const movieStore = useMovieStore();
const tvStore = useTVStore();

onMounted(() => {
  loadHomeMovies();
  loadHomeTV();
})

const featuredMovies = computed(() => {
  return movieStore.trending.length > 0 ? movieStore.trending[0] : null;
});
</script>

<template>
  <div class="min-h-screen pb-20">
    
    <div v-if="featuredMovies" class="animate-in fade-in duration-700">
      <HeroBanner :movie="movieStore.featured"/>
    </div>
    <div v-else class="h-[80vh] bg-white/5 animate-pulse"></div>

    <div class="relative -mt-20 z-20 space-y-10">

      <SkeletonCard v-if="movieStore.trending.length === 0" />
      <MediaRow v-else title="Trending Movies This Week" :items="movieStore.trending"/>

      <SkeletonCard v-if="tvStore.trending.length === 0" />
      <MediaRow v-else title="Trending Shows This Week" :items="tvStore.trending"/>

      <SkeletonCard v-if="movieStore.popular.length === 0" />
      <MediaRow v-else title="Popular Movies" :items="movieStore.popular"/>

      <SkeletonCard v-if="movieStore.popular.length === 0" />
      <MediaRow v-else title="Popular Shows" :items="tvStore.popular"/>
    </div>
  
    <!-- <div v-else>
      <HeroBanner v-if="featuredMovies" :movie="featuredMovies"/>

      <div class="relative -mt-20 z-20 space-y-10">
        <MediaRow title="Trending Movies This Week" :items="movieStore.trending"/>
        <MediaRow title="Trending Shows This Week" :items="tvStore.trending"/>
        <MediaRow title="Popular Movies" :items="movieStore.popular"/>
        <MediaRow title="Popular Shows" :items="tvStore.popular"/>
      </div>
    </div> -->

    <!-- <div v-if="isError" class="fixed bottom-10 right-10 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl">
      {{  isError }}
    </div> -->
  </div>
</template>