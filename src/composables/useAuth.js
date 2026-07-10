import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";

export function useAuth() {
  const store = useAuthStore();
  const router = useRouter();

  const isLoading = ref(false);
  const isError = ref(null);
  const isSuccess = ref(null);

  const handleLogin = async (credentials) => {
    isLoading.value = true;
    isError.value = null;
    isSuccess.value = null;

    try {
      const res = await store.login(credentials);
      if (res.success) {
        isSuccess.value = res.message;
        setTimeout(() => router.push('/'), 1000 );
      } else {
        isError.value = res.message;
      }
    } catch (err) {
      isError.value =  err.response?.data?.message || "Login failed"
    } finally {
      isLoading.value = false;
    }
  }

  const handleRegister = async (credentials) => {
    isLoading.value = true;
    isError.value = false;
    isSuccess.value = false;

    try {
      const res = await store.register(credentials);
      if (res.success) {
        isSuccess.value = res.message;
        setTimeout(() => router.push('/'), 1000);
      } else {
        isError.value = res.message;
      }
    } catch (err) {
      isError.value = err.response?.data?.message || "Register failed"
    } finally {
      isLoading.value = false;
    }
  }

  const handleLogout = () => {
    store.logout();
    router.push('/login');
  }

  return { isLoading, isError, isSuccess, handleLogin, handleRegister, handleLogout }
}