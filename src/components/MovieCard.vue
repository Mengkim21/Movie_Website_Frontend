<script setup>
import { Star, StarsIcon } from 'lucide-vue-next';
defineProps({
  movie: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <router-link
    :to="`/movie/${movie.id}`"
    class="relative block overflow-hidden rounded-xl bg-gray-800 transition-transform hover:scale-105 duration-300"
  >
    <img
      :src="movie.poster || 'https://via.placeholder.com/500x750?text=No+Poster+Found'"
      :alt="movie.title"
      class="h-full w-full object-cover transition-opacity duration-300 hover:opacity-70"
    />   

    <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent duration-300">
      <h3 class="text-sm font-bold text-white truncate">{{ movie.title }}</h3>
      <div class="flex items-center gap-2 mt-1">
        <Star :size="20" fill="green" color="green" :stroke-width="0"/>
        <span class="text-white">
          {{ movie?.rating }}
        </span>
      </div>
    </div>
  </router-link>
</template>