<script setup>
import { ref } from 'vue';
import { useAuth } from '../../composables/useAuth';
import { Eye, EyeOff } from 'lucide-vue-next';

const { handleLogin, isLoading, isError } = useAuth();
const showPassword = ref(false);
const loginForm = ref({
  email: '',
  password: ''
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-900 text-white">
    <div class="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
      <div class="space-y-3 mb-[3rem]">
        <p class="text-sm text-gray-500 font-semibold">SIGN IN</p>
        <p class="text-xl text-gray-100 font-semibold">Welcome Back</p>
        <p class="text-sm text-gray-400 font-semibold">Continue with your profile and saved lists</p>
      </div>

      <!-- Error Message -->
      <div v-if="isError" class="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
        {{ isError }}
      </div>

      <div class="container ">
        <form @submit.prevent="handleLogin(loginForm)" class="flex flex-col items-center justify-center gap-2">
          <input 
            v-model="loginForm.email"
            type="email" 
            placeholder="Email address"
            required
            class="w-full p-3 rounded-xl bg-gray-700 border-gray-600 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-blue-500 text-white"
          />

          <div class="flex w-full justify-between relative mt-2">
            <input 
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Password"
              required
              class="w-full p-3 rounded-xl bg-gray-700 border-gray-600 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-blue-500 text-white"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              <component :is="showPassword ? Eye : EyeOff" :size="20" />
            </button>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full py-2 mt-4 text-gray-800 bg-white hover:bg-gray-300 rounded font-semibold transition"
          >
            {{ isLoading ? 'Signing in...' : 'Sign in with email' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>