<script setup>
import { ChevronLeft, ChevronRight, Leaf } from 'lucide-vue-next';
import MovieCard from './MovieCard.vue';
import { ref } from 'vue';
defineProps({
  title: String,
  movies: Array
});

const scrollRow = ref(null);
const scroll = (direction) => {
  if (scrollRow.value) {
    const scrollAmount = scrollRow.value.clientWidth * 0.25;

    scrollRow.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
}
</script>

<template>
  <section class="mb-12 group relative">

    <!-- Title Section -->
    <div class="flex items-center justify-between px-6 lg:px-10">
      <h2 class="text-2xl font-semibold text-white tracking-wide">{{ title }}</h2>
      <button class="text-gray-400 text-sm hover:text-white transition">View All</button>
    </div>

    <!-- Container Slider -->
    <div class="relative w-full">
      <button 
        @click="scroll('left')"
        class="absolute top-0 left-0 z-30 h-full w-12 lg:w-20 bg-gradient-to-r from-black/70 to-transparent flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div class="rounded-full p-2 bg-black/50 text-white hover:scale-105 transition">
          <ChevronLeft :size="30"/>
        </div>
      </button>

      <!-- Movie List -->
      <div 
        ref="scrollRow"
        class="relative flex gap-4 px-6 py-4 overflow-x-auto scrollbar-none scroll-smooth"
      >
        <div 
          v-for="movie in movies"
          :key="movie.id"
          class="min-w-[130px] md:min-w-[160px] lg:min-w-[170px] transition-transform duration-300"
        >
          <MovieCard :movie="movie"/>
        </div>
      </div>
      <button 
        @click="scroll('right')"
        class="absolute top-0 right-0 z-30 flex items-center justify-center h-full w-12 lg:w-20 bg-gradient-to-l from-black/70 to-transparent cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div class="rounded-full p-2 bg-black/50 text-white hover:scale-105 transition">
          <ChevronRight :size="30"/>
        </div>
      </button>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

</style>