<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useAuth } from '../composables/useAuth';
import { Search } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const isActive = (path) => {
  return route.path === path;
}

const appName = 'GriCine'
const listItems = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Movies',
    path: '/movies'
  },
  {
    name: 'Shows',
    path: '/shows'
  },
]

const search = [
  {
    name: 'Search',
    path: '/search'
  }
]

const loginMenu = [
  {
    name: 'Login',
    path: '/login'
  }
]

const authStore = useAuthStore();
const { handleLogout} = useAuth();

</script>

<template>
  <nav class="pointer-events-none fixed top-6 z-50 hidden h-[4rem] transition-[left,right,width,opacity,transform] duration-200 lg:flex left-1/2 w-[min(980px,calc(100vw-8rem))] -translate-x-1/2 opacity-100">
    <div class="pointer-events-auto w-full h-[4rem] rounded-[24px] flex items-center gap-2 px-2.5 py-2 backdrop-blur-[42px] bg-black/[0.2] backdrop-saturate-150  border-gray-700 ring-1 ring-white/[0.045] shadow-[0_20px_64px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.06)]">
      
      <!-- App Name -->
      <div class="flex items-center mx-auto justify-center">
        <router-link 
          to="/"
          class="text-xl font-bold text-white hover:text-gray-300 transition-colors"
        >
          {{ appName }}
        </router-link>
      </div>

      <!-- Media Menu -->
      <div class="mx-auto flex items-center gap-4">
        <ul class="flex gap-[20px] items-center">
          <router-link
            v-for="(item, index) in listItems"
            :key="index"
            :to="item.path"
            :class="[
              'text-gray-300 font-semibold transition-colors duration-200 p-3',
              isActive(item.path)
                ? 'text-white rounded-xl bg-white/35 px-3 py-2'
                : 'hover:text-white rounded-xl hover:bg-white/15 py-2 px-3'
            ]"
          >
            {{ item.name }}
          </router-link>
        </ul>
      </div>

      <div class="mx-auto flex items-center gap-4">

        <!-- Search -->
        <div class="px-2 flex items-center">
          <router-link
            v-for="(search, index) in search"
            :key="search"
            :to="search.path"
            :class="[
              'text-gray-300 font-semibold transition-colors duration-200 p-3',
                isActive(search.path)
                  ? 'text-white rounded-xl bg-white/35 py-2 px-3'
                  : 'hover:text-white rounded-xl hover:bg-white/15 py-2 px-3'
            ]"
          >
            <span class="flex gap-3 items-center">
              <Search :size="20" />
              <p class="font-semibold">Search</p>
            </span>
          </router-link>
        </div>

        <!-- Login & Logout-->
        <ul class="flex gap-6 items-center">
          <router-link 
            v-if="authStore.user" 
            to="/profile"
            class="flex gap-4 items-center">
            <span class="text-gray-300 bg-white/50 border-2 border-gray-300 rounded-full p-3">
              {{ authStore.user?.name }}
            </span>
            <!-- <button
              @click="handleLogout"
              class="text-gray-300 font-semibold hover:text-white rounded-xl hover:bg-white/15 transition-colors duration-200 py-2 px-3 cursor-pointer"
            >
              Logout
            </button> -->
          </router-link>
  
          <router-link
            v-else
            v-for="(login, index) in loginMenu"
            :key="index"
            :to="login.path"
            :class="[
              'text-gray-300 font-semibold transition-colors duration-200 p-3',
                isActive(login.path)
                  ? 'text-white rounded-xl bg-white/35 py-2 px-3'
                  : 'hover:text-white rounded-xl hover:bg-white/15 py-2 px-3'
            ]"
          >
            {{ login.name }}
          </router-link>
        </ul>
      </div>
    </div>
  </nav>
</template>