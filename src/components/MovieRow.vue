<script setup>
import MovieCard from './MovieCard.vue';
defineProps({
  title: String,
  movies: Array
});
</script>

<template>
  <section class="mb-12">
    <div class="flex items-center justify-between mb-6 px-6 lg:px-20">
      <h2 class="text-2xl font-semibold text-white tracking-wide">{{ title }}</h2>
      <button class="text-gray-400 text-sm hover:text-white transition">View All</button>
    </div>

    <div class="flex gap-4 overflow-x-auto px-6 lg:px20 scrollbar-none pb-4 scroll-smooth">
      <div 
        v-for="movie in movies"
        :key="movie.id"
        class="min-w-[130px] md:min-w-[160px] lg:min-w-[180px]"
      >
        <MovieCard :movie="movie"/>
      </div>
    </div>
  </section>
</template>