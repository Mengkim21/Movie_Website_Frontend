<script setup>
import { watch, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSearchStore } from '../../stores/searchStore';
import MediaCard from '../../components/MediaCard.vue';
import { Loader2, Search, X } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const searchStore = useSearchStore();

const searchQuery = ref(route.query.q || '');
let deboundTimer = null;

watch(searchQuery, (newValue) => {
  clearTimeout(deboundTimer);

  if (!newValue.trim()) {
    router.push({ name: 'Search', query: {} });
    searchStore.searchResults = [];
    return;
  }

  deboundTimer = setTimeout(() => {
    router.push({ name: 'Search', query: { q: newValue } });
  }, 500);
});

const handleSearch = () => {
  if (!searchQuery.value.trim()) return;

  router.push({ name: 'Search', query: { q: searchQuery.value } });
}

const performSearch = () => {
  if (route.query.q) {
    searchStore.searchMulti(route.query.q);
  }
};

onMounted(() => performSearch());

watch(() => route.query.q, () => {
  performSearch();
});

const clearSearch = () => {
  searchQuery.value = '';
}
</script>

<template>
  <main class="min-h-screen pt-32 pb-20 px-6 lg:px-20 text-white">

    <div class="flex items-center justify-center mb-12">
      <div class="relative w-full max-w-4xl">
        <Search :size="25" class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors"/>
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search for movies or shows..."
          class="w-full px-10 lg:px-15 text-xl placeholder:text-gray-500 placeholder:italic bg-white/5 border border-white/20 rounded-full focus:ring-gray-300 focus:outline-none transition-all"
        />

        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <X :size="20"/>
        </button>
      </div>
    </div>

    <!-- Search Results Section -->
    <div v-if="route.query.q">
      <div v-if="searchStore.isLoading" class="flex flex-col items-center py-15">
        <Loader2 :size="40" class="animate-spin text-gray-300 mb-4"/>
        <p class="text-gray-400">Searching the library...</p>
      </div>

      <div v-else>
        <div v-if="searchStore.searchResults.length">
          <h1 class="text-3xl font-bold mb-8 mt-10">
            Top Results
          </h1>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <MediaCard v-for="item in searchStore.searchResults" :key="item.id" :item="item"/>
          </div>
        </div>

        <div v-else class="text-center py-20">
          <p class="text-gray-500 text-xl">No movies or shows found.</p>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-15">
      <div class="bg-white/5 p-5 rounded-full mb-6">
        <Search :size="50" class="text-gray-400"/>
      </div>
        <h1 class="text-4xl font-semibold text-white">Look for something to watch</h1>
        <p class="text-md text-gray-300">Find a movies or tv shows available for streaming.</p>
    </div>
  </main>
</template>