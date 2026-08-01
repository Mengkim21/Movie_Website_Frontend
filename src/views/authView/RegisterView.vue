<script setup>
import { ref } from 'vue';
import { useAuth } from '../../composables/useAuth';
import { Mail, Eye, EyeOff } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

const { handleRegister, isLoading, isError } = useAuth();
const showPassword = ref(false);
const registerForm = ref({
  username: '',
  email: '',
  password: '',
});

const handleNavigation = () => {
  router.push('/login');
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center text-white">
    <div class="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
      <div class="space-y-3 mb-[3rem] text-center">
        <p class="text-xl text-white font-semibold">Create An Account</p>
      </div>

      <!-- Error Message -->
      <div v-if="isError" class="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
        {{ isError }}
      </div>

      <div class="container ">
        <form @submit.prevent="handleRegister(registerForm)" class="flex flex-col items-center justify-center gap-4">
          <input 
            v-model="registerForm.username"
            type="text" 
            placeholder="Username"
            required
            class="w-full p-3 rounded-xl bg-gray-700 border-gray-600 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-blue-500 text-white"
          />

          <input 
            v-model="registerForm.email"
            type="email" 
            placeholder="Email address"
            required
            class="w-full p-3 rounded-xl bg-gray-700 border-gray-600 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-blue-500 text-white"
          />

          <div class="flex w-full justify-between relative">
            <input 
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Password"
              required
              class="w-full p-3 rounded-xl bg-gray-700 border-gray-600 placeholder:text-gray-300 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-blue-500 text-white"
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
            {{ isLoading ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <div class="flex items-center gap-2 mt-3">
          <p class="text-sm text-gray-400">Already have an account?</p>
          <button 
            @click="handleNavigation" 
            class="text-blue-400 cursor-pointer hover:text-blue-500 hover:underline">
            Log in
          </button>
        </div>
      </div>
    </div>
  </div>
</template>