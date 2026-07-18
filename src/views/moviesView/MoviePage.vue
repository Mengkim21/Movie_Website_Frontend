<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMovieStore } from '../../stores/movieStore.js';
import MovieCard from '../../components/MovieCard.vue';
import FilterBar from '../../components/FilterBar.vue';

const route = useRoute();
const router = useRouter();
const movieStore = useMovieStore();

const observerTarget = ref(null);
let observer = null;

const setObserver = () => {
  observer = new IntersectionObserver((entries) => {

    if (entries[0].isIntersecting && !movieStore.discoverLoading) {
      if (movieStore.currentPage < movieStore.totalPages) {
        
        const nextPage = parseInt(route.query.page || 1) + 1;
        router.push({ query: {...route.query, page: nextPage} });
      }
    }
  }, {threshold: 1.0});

  if (observerTarget.value) observer.observe(observerTarget.value);
}

watch(
  () => route.query,
  (newQuery) => {
    movieStore.fetchDiscover({
      genreId: newQuery.genre,
      type: newQuery.type || 'all',
      page: newQuery.page || 1,
    });
  },
  { immediate: true }
);

onMounted(() => setObserver());
onUnmounted(() => observer?.disconnect());

</script>

<template>
  <div class="min-h-screen w-full px-5 pt-[7rem]">
    <div class="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 xl:gap-16">

      <!-- Sticky Filter Sidebar -->
      <FilterBar class="hidden md:block"/>

      <!-- Movie Grid -->
      <div class="flex flex-col">
        <h2 class="text-2xl font-bold text-white mb-8">Browse Movies</h2>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <MovieCard 
            v-for="movie in movieStore.discoverMovie"
            :key="movie.id"
            :movie="movie"
          />
        </div>

        <!-- Infinite scroll Intersection Observer -->
        <div
          ref="observerTarget" 
          class="h-20 w-full flex items-center justify-center mt-10"
        >
          <div
            v-if="movieStore.discoverLoading" 
            class="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"
          >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>