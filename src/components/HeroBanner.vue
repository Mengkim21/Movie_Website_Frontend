<script setup>
import { Star } from 'lucide-vue-next';

defineProps({
  movie: Object
})
</script>

<template>
  <div class="relative h-[85vh] w-full">
    <div class="absolute inset-0">
      <img 
        :src="movie?.backdrop"
        class="h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-theme via-transparent to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-theme/80 via-transparent to-transparent"></div>
    </div>

    <div class="relative h-[85%] flex flex-col justify-end px-6 pb-20 lg:px-20 lg:pb-30">
      <div class="mb-6 max-w-[300px] md:max-w-[500px]">
        <img
          v-if="movie?.logo_path"
          :src="movie.logo_path"
          :alt="movie.title"
          class="w-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
        />
        
        <h1 v-else class="text-5xl lg:text-7xl font-semibold text-white uppercase tracking-tighter">
          {{ movie?.title }}
        </h1>
      </div>

      <p class="max-w-lg text-gray-300 text-xl line-clamp-3 mb-5 drop-shadow-md">
        {{ movie?.overview }}
      </p>

      <div class="flex gap-4">
        <button
          class="px-10 py-4 bg-white text-black font-black rounded-4xl hover:bg-gray-300 transition uppercase tracking-widest text-sm cursor-pointer"
        >
          Play
        </button>
        <button
          class="px-10 py-4 bg-gray-500/50 text-white backdrop-blur-md font-black rounded-4xl hover:bg-gray-500/70 transition uppercase tracking-widest text-sm cursor-pointer"
        >
          More Info
        </button>
      </div>
    </div>
  </div>
</template>