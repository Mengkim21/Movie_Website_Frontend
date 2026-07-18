<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useGenreStore } from '../stores/genreStore';

const route = useRoute();
const router = useRouter();
const genreStore = useGenreStore();

const categories = [
  {
    name: 'All Movies',
    value: 'all'
  },
  {
    name: 'Popular',
    value: 'popular',
  },
  {
    name: 'Top Rated',
    value: 'top_rated',
  },
  {
    name: 'Upcoming',
    value: 'upcoming',
  }
];

onMounted (() => {
  genreStore.fetchMovieGenre();
});

const filterOption = (type, value) => {
  const query = {...route.query, page: 1};

  if (type === 'category') {
    query.type = value;
    delete query.genre;
  } else {
    query.genre = value;
    delete query.type;
  }

  router.push({ query });
};

const isActive = (type, value) => {
  if (type === 'category') {
    return (route.query.type || 'all') === value && !route.query.genre;
  }
  return String(route.query.genre) === String(value);
}

</script>
<template>
  <div class="sticky h-[75vh] w-64 top-[7rem] overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-200/60 scrollbar-track-gray-600/60 self-start z-20">
    <div class="px-6 space-y-7">

      <!-- Category Column -->
      <div class="flex flex-col gap-3 px-3">
        <button
          v-for="cat in categories"
          :key="cat.value"
          @click="filterOption('category', cat.value)"
          :class="[
            'text-gray-400 text-start font-semibold transition-all duration-200 p-3 cursor-pointer',
            isActive('category', cat.value)
              ? 'text-white rounded-xl bg-white/30 px-3 py-2'
              : 'hover:text-gray-200 rounded-xl hover:bg-white/15 px-3 py-2'
          ]"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Genre Column -->
      <div class="flex flex-col gap-3 p-3 mt-6">
        <p class="text-gray-400 text-sm font-semibold">Genres</p>
        <button
          v-for="genre in genreStore.movieGenres"
          :key="genre.id"
          @click="filterOption('genre', genre.id)"
          :class="[
            'text-gray-400 text-start font-semibold transition-all duration-200 p-3 cursor-pointer',
            isActive('genre', genre.id)
              ? 'text-white rounded-xl bg-white/30 px-3 py-2'
              : 'hover:text-gray-200 rounded-xl hover:bg-white/15 px-3 py-2'
          ]"
        >
          {{ genre.name }}
        </button>
      </div>
    </div>
  </div>
</template>