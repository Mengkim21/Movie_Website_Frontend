<script setup>
import Navbar from './components/Navbar.vue';
import { onMounted } from 'vue';
import { supabase } from './config/supabase.js';
import { useAuthStore } from './stores/authStore.js';

const authStore = useAuthStore();

onMounted(() => {
  
  authStore.checkAuth();

  supabase.auth.onAuthStateChange(async (event, session) => {

    if (session && (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN')) {
      authStore.updateToken(session.access_token);

      if (!authStore.profile) {
        await authStore.getProfile();
      }
    }

    if (event === 'SIGNED_OUT') {
      authStore.logout();
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
