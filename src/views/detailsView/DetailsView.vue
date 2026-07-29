<script setup>
import { onMounted, watch, computed, ref } from 'vue';
import { useDetailStore } from '../../stores/detailStore';
import { useProfileStore } from '../../stores/profileStore.js';
import { useAuthStore } from '../../stores/authStore.js';
import { useRoute } from 'vue-router';
import { FastForward, Play, Plus, Star, X } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';
import MediaCard from '../../components/MediaCard.vue';

const route = useRoute();
const detailStore = useDetailStore();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const toast = useToast();

const mediaType = computed(() => 
  route.path.includes('movie') ? 'movies' : 'tv'
);

const loadData = () => {
  detailStore.fetchDetails(route.params.id, mediaType.value);
};

const handlePlaySimulation = async () => {
  const item = detailStore.item;
  const type = route.path.includes('movie') ? 'movie' : 'tv';

  if (!authStore.isLoggedIn) {
    return toast.warning("Please login to save your watch history!");
  }

  await profileStore.addToHistory(item.id, type, item.title);
  console.log("Simulating stream for ID: ", item.id);
};

const handleWatchlistClick = () => {
  if (!authStore.isLoggedIn) return toast.error("Login Required!");
  profileStore.addToWatchlist(detailStore.item);
};

onMounted(() => {
  loadData();
});

watch(() =>
  route.params.id, () =>
  loadData()
);
</script>

<template>
  <div v-if="detailStore.isLoading" class="h-screen flex items-center justify-center">
    <div class="h-12 w-12 border-4 border-t-white border-white/20 rounded-full animate-spin"></div>
  </div>

  <main v-else-if="detailStore.item" class="min-h-screen text-white pb-20">

    <!-- Hero Section -->
    <header class="relative h-[70vh] w-full overflow-hidden">
      <img :src="detailStore.item.backdrop" class="w-full h-full object-cover opacity-50" />
      <div class="absolute inset-0 bg-gradient-to-t from-theme via-theme/40 to-transparent"></div>

      <div class="absolute inset-0 flex flex-col justify-end px-6 lg:px-20">
        <div class="mb-8 max-w-[220px] lg:max-w-[300px]">
          <img
            v-if="detailStore.item?.logo_path"
            :src="detailStore.item.logo_path"
            class="w-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
          />
          
          <h1 v-else class="text-xl lg:text-4xl font-semibold text-white uppercase tracking-tighter">
            {{ detailStore.item.title }}
          </h1>
        </div>
      
        <div class="flex items-center gap-4 text-sm lg:text-base mb-3">
          <button @click="handlePlaySimulation" class="flex items-center gap-2 px-5 py-3 bg-white backdrop-blur-md text-black font-bold rounded-lg hover:bg-white/70 transition">
            <Play :size="20" fill="black"/> Play  
          </button>
          
          <a v-if="detailStore.item.trailer"
             :href="`https://www.youtube.com/watch?v=${detailStore.item.trailer}`"
             target="_blank"
             class="flex items-center gap-2 px-5 py-3 bg-white/30 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/50 transition">
            <Play :size="20" fill="white"/> Trailer
          </a>

          <button @click="handleWatchlistClick" class="flex items-center gap-2 px-5 py-3 bg-white/30 backdrop-blur-md text-white/70 font-bold rounded-lg hover:bg-white/50 transition">
            <Plus :size="20" /> Watchlist
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-3 text-sm lg:text-md font-bold mb-8">
          <span class="flex items-center">
            <div class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/20">
              <Star :size="13" fill="black"/>
              {{ detailStore.item.rating }}
            </div>
          </span>

          <span v-if="detailStore.item.runtime" class="flex items-center">
            <div class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/20">
              {{ detailStore.item.runtime }} min
            </div>
          </span>

          <span v-if="detailStore.item.number_of_episodes" class="flex items-center">
            <div class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/20">
              {{ detailStore.item.number_of_episodes }} episodes
            </div>
          </span>

          <span v-if="detailStore.item.number_of_seasons" class="flex items-center">
            <div class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/20">
              {{ detailStore.item.number_of_seasons }} Seasons
            </div>
          </span>

          <span class="flex items-center">
            <div class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/20">
              {{ detailStore.item.release_date?.split('-')[0] || detailStore.item.first_air_date?.split('-')[0] }} 
            </div>
          </span>

           <span class="flex items-center">
            <div class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/20">
              {{ detailStore.item.language }} 
            </div>
          </span>
        </div>
      </div>
    </header>

    <!-- Content Section -->
    <div class="px-6 md:px-15 lg:px-20 mt-10 relative flex flex-col">

      <!-- Description & Genres-->
      <section class="sm:flex md:flex-row lg:flex-row justify-between gap-4 mb-6">
        <div class="lg:max-w-2/3 flex flex-col">
          <p class="text-gray-300 text-xl lg:text-2xl mb-5 font-bold tracking-wide">Storyline Overview</p>
          <p class="text-gray-300 lg:text-base lg:line-clamp-5 mb-5 drop-shadow-md">
            {{ detailStore.item.overview }}
          </p>
        </div>
        <div class="h-10 flex sm:flex-col md:flex-col lg:flex-row items-start gap-2">
          <span 
            v-for="genre in detailStore.item.genres" 
            class="px-4 py-2 justify-start bg-white/10 border border-white/20 rounded-xl font-semibold"
          >
            {{ genre.name }}
          </span>
        </div>
      </section>

      <!-- Director -->
      <section v-if="detailStore.item.cast?.length" class="mb-6">
        <div>
          <h2 class="text-xl font-bold text-gray-300 tracking-wide">Top Cast</h2>
          <div class="flex gap-8 overflow-x-auto scrollbar-none mt-4">
            <div 
              v-for="actor in detailStore.item.cast"
              :key="actor.id"
              class="min-w-[120px] flex flex-col items-center"
            >
              <div class="w-28 h-28 mb-4 overflow-hidden rounded-full border-2 border-white/20 shadow-2xl">
                <img 
                  :src="actor.profile_path || 'https://placehold.co/200x300?text=No+Image'"
                  class="w-full h-full object-cover shadow-xl"
                />
              </div>
              <p class="text-sm font-bold">{{ actor.name }}</p>
              <p class="text-xs text-gray-400 font-semibold truncate">{{ actor.character }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Director -->
      <section v-if="detailStore.item.director?.length" class="mb-6">
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-300 tracking-wide">Director</h2>
          <div class="flex gap-6 mt-4">
            <div 
              v-for="director in detailStore.item.director"
              :key="director.id"
              class="flex flex-col text-center"
            >
              <div class="w-28 h-28 mb-4 overflow-hidden rounded-full border-2 border-white/20 shadow-2xl">
                <img 
                  :src="director.profile_path || 'https://placehold.co/200x300?text=No+Image'"
                  class="w-full h-full object-cover shadow-xl"
                />
              </div>
              <p class="text-sm font-bold">{{ director.name }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Similar Content Section -->
      <section v-if="detailStore.item.similar?.length" class="mt-6">
        <h2 class="text-3xl font-bold text-gray-300 tracking-wide mb-6">More Like This</h2>
        <div class="flex gap-6 overflow-x-auto scrollbar-none p-4">
          <MediaCard 
            v-for="similar in detailStore.item.similar" 
            :key="similar.id" 
            :item="similar" 
            class="min-w-[130px] md:min-w-[160px] lg:min-w-[200px]"
          />
        </div>
      </section>
    </div>
  </main>
</template>