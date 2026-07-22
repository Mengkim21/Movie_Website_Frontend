<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMovieStore } from '../../stores/movieStore.js';
import MediaCard from '../../components/MediaCard.vue';
import FilterBar from '../../components/FilterBar.vue';

const route = useRoute();
const router = useRouter();
const movieStore = useMovieStore();

const observerTarget = ref(null);
let observer = null;

const setObserver = () => {
  observer = new IntersectionObserver((entries) => {

    if (entries[0].isIntersecting ) {
      loadNextPage();
    }
  }, {
    rootMargin: '400px',
    threshold: 0.01
  });

  if (observerTarget.value) observer.observe(observerTarget.value);
};

const loadNextPage = async () => {

  if (movieStore.discoverLoading || movieStore.currentPage >= movieStore.totalPages) return;

  const nextPage = movieStore.currentPage + 1;

  await router.push({
    query: { ...route.query, page: nextPage }
  })
};

const checkScreenSpace = () => {
  if (!observerTarget.value) return;

  const rect = observerTarget.value.getBoundingClientRect();

  if (rect.top < window.innerHeight) {
    loadNextPage();
  }
}

watch(
  () => route.query,
  async (newQuery, oldQuery) => {

    // Checking if the type of genre change then reset to page 1
    const filterChange = newQuery.type != oldQuery?.type || newQuery.genre != oldQuery?.genre;

    if (filterChange && parseInt(route.query.page || 1) > 1) {
      return router.push({
        query: {...route.query, page: 1}
      });
    }

    await movieStore.fetchDiscover({
      genreId: newQuery.genre,
      type: newQuery.genre ? null : (newQuery.type || 'all'),
      page: parseInt(newQuery.page || 1),
    });

    nextTick(() => {
      checkScreenSpace();
    });
  },
  { immediate: true }
);

onMounted(() => {

  if (route.query.page && parseInt(route.query.page) > 1) {
    router.replace({
      query: {...route.query, page: 1}
    })
  }
  setObserver()
});
onUnmounted(() => observer?.disconnect());

</script>

<template>
  <div class="min-h-screen w-full px-5 lg:px-10 pt-[7rem]">
    <div class="flex items-start lg:gap-12 xl:gap-16">

      <!-- Sticky Filter Sidebar -->
      <FilterBar type="movie" class="hidden md:block"/>

      <!-- Movie Grid -->
      <div class="flex-1">
        <header class="mb-10">
          <h2 class="text-4xl font-bold text-white">
            {{ movieStore.meta.title }}
          </h2>
          <p class="text-md font-medium text-white/50 mt-2">
            {{ movieStore.meta.description }}
          </p>
        </header>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <MediaCard 
            v-for="movie in movieStore.discoverMovie"
            :key="movie.id"
            :item="movie"
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