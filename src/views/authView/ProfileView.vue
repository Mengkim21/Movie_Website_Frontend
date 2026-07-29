<script setup>
import { ref, onMounted } from 'vue';
import { useProfileStore } from '../../stores/profileStore';
import { useAuthStore } from '../../stores/authStore.js';
import { useAuth } from '../../composables/useAuth.js';
import { useToast } from 'vue-toastification';
import MediaCard from '../../components/MediaCard.vue';
import { 
  Bookmark, 
  History as HistoryIcon,
  MessageSquare,
  SettingsIcon, 
  LogOut,
  Mail,
  Calendar,
  Trash2
} from 'lucide-vue-next';

const profileStore = useProfileStore();
const authStore = useAuthStore();
const toast = useToast();

const activeTab = ref('watchlist');
const isEditing = ref(false);
const newUsername = ref(authStore.user?.username || '');

onMounted(async () => {
  await authStore.getProfile();
  await profileStore.fetchUserCollections();
})

const tablist = [
  { id: 'watchlist', name: 'Watchlist', icon: Bookmark },
  { id: 'history', name: 'Watch History', icon: HistoryIcon },
  { id: 'reviews', name: 'My Reviews', icon: MessageSquare },
  { id: 'settings', name: 'Settings', icon: SettingsIcon },
];

const handleUpdateUsername = async () => {
  if (!newUsername.value.trim()) return;
  try {
    // Assuming your authStore has an updateProfile action
    await authStore.updateProfile({ username: newUsername.value });
    isEditing.value = false;
    toast.success('Username updated successfully!');
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to update username');
  }
};

const { handleLogout} = useAuth();
</script>

<template>
  <main class="min-h-screen pt-32 px-6 lg:px-20 bg-brand-bg text-white">

     <!-- User profile section -->
      <section class="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-white/5 pb-12">
        <!-- Avatar Wrapper -->
        <div class="relative group">
          <div class="w-32 h-32 md:w-40 md:h-48 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center text-5xl font-black tracking-tighter shadow-2xl">
            {{ authStore.profile?.username?.charAt(0).toUpperCase() }}
          </div>
        </div>

        <!-- Meta Information -->
        <div class="text-center md:text-left flex-1 space-y-2">
          <div class="flex flex-col md:flex-row items-center gap-3">
            <h1 class="text-4xl font-black uppercase tracking-tighter">{{ authStore.profile?.username }}</h1>
            <span class="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/10 rounded-full text-xs font-bold uppercase tracking-wider">Premium Member</span>
          </div>
          
          <div class="flex flex-wrap justify-center md:justify-start items-center gap-6 text-sm text-gray-400">
            <span class="flex items-center gap-2"><Mail :size="16" /> {{ authStore.user?.email }}</span>
            <span class="flex items-center gap-2"><Calendar :size="16" /> Joined {{ new Date(authStore.user?.created_at).toLocaleDateString() }}</span>
          </div>
        </div>

        <div>
          <button @click="handleLogout" class="flex items-center gap-2 px-6 py-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition font-bold border border-red-500/10">
            <LogOut :size="18" /> Logout
          </button>
        </div>
      </section>

    <!-- Tabs -->
    <div class="flex gap-8 overflow-x-auto border-b border-white/10 mb-10">
      <button 
        v-for="tab in tablist" :key="tab.id"
        @click="activeTab = tab.id"
        :class="['flex items-center gap-2 pb-4 font-bold transition border-b-2 text-sm uppercase tracking-wider', 
                  activeTab === tab.id ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300']"
      >
        <component :is="tab.icon" :size="18" />
        {{ tab.name }}
      </button>
    </div>

    <!-- Content Section -->
    <div v-if="profileStore.isLoading" class="grid grid-cols-2 md:grid-cols-6 gap-6 animate-pulse">
       <div v-for="i in 6" :key="i" class="aspect-[2/3] bg-white/5 rounded-xl"></div>
    </div>

    <div v-else class="animate-in fade-in duration-500 mb-10">
      <!-- Watchlist Tab -->
      <div v-if="activeTab === 'watchlist'" class="p-3">
        <div v-if="profileStore.watchlist?.length" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div v-for="item in profileStore.watchlist" :key="item.media_id" class="relative group">
            
            <MediaCard :item="item.media" />
            <!-- Floating Trash Icon to Delete from Watchlist -->
            <button 
              @click="profileStore.removeFromWatchlist(item.media_id, item.media_type)"
              class="absolute top-3 right-3 p-2 bg-black/80 backdrop-blur-md rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition duration-200 hover:bg-red-600 hover:text-white"
            >
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
        <div v-else class="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
          <Bookmark :size="48" class="mx-auto mb-4 text-gray-600" />
          <p class="text-gray-400 font-medium">Your Watchlist is empty.</p>
        </div>
      </div>

      <!-- History Tab -->
       <div v-if="activeTab === 'history'" class="p-3">
        <div v-if="profileStore.history?.length" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div v-for="item in profileStore.history" :key="item.media_id">
            <MediaCard :item="item.media" />
            <!-- Simulated Progress Bar -->
            <div class="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 w-[75%]"></div>
            </div>
            <p class="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">Watched: {{ new Date(item.watched_at).toLocaleDateString() }}</p>
          </div>
        </div>
        <div v-else class="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
          <HistoryIcon :size="48" class="mx-auto mb-4 text-gray-600" />
          <p class="text-gray-400 font-medium">No watch history available.</p>
        </div>
      </div>

      <!-- Reviews Tab -->
      <div v-if="activeTab === 'reviews'" class="space-y-6">
        <div v-if="profileStore.reviews?.length" class="space-y-4">
          <div v-for="review in profileStore.reviews" :key="review.id" class="bg-white/5 p-6 rounded-2xl border border-white/10 flex gap-6">
            <img :src="review.media.poster_path" class="w-20 h-28 object-cover rounded-lg shadow-lg" />
            <div class="flex-1">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-blue-400">{{ review.media.title }}</h3>
                <span class="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-lg text-sm font-bold">★ {{ review.rating }}</span>
              </div>
              <p class="text-gray-300 italic mb-4">"{{ review.content }}"</p>
              <p class="text-xs text-gray-500">Reviewed on {{ new Date(review.created_at).toLocaleDateString() }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
          <MessageSquare :size="48" class="mx-auto mb-4 text-gray-600" />
          <p class="text-gray-400 font-medium">You haven't written any reviews yet.</p>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="max-w-2xl">
        <div class="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-6">
          <h2 class="text-2xl font-bold">Account Settings</h2>
          
          <form @submit.prevent="handleUpdateUsername" class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-400 mb-2">Update Username</label>
              <div class="flex gap-4">
                <input 
                  v-model="newUsername" 
                  type="text" 
                  class="flex-1 bg-white/10 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-blue-500 transition" 
                />
                <button type="submit" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

    </div>
  </main>
</template>