<script setup>
import Navbar from './components/Navbar.vue';
import { onMounted } from 'vue';
import { supabase } from './config/supabase.js';
import { useAuthStore } from './stores/authStore.js';

const authStore = useAuthStore();

onMounted(async () => {
  authStore.checkAuth();

  const accessToken = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refresh_token');

  if (accessToken && refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    if (error) {
      console.log("Session re-sync failed:", error.message);
      authStore.logout();
    }
  }

  supabase.auth.onAuthStateChange(async (event, session) => {

    if (session && (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN')) {
      authStore.updateToken(session);
    }
  });
});

</script>
<template>
  <div class="app-container min-h-screen">
    <Navbar />
    <router-view />
  </div>
</template>
