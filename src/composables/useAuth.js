import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const toast = useToast();

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
        toast.success("Account log in successfully!");
      } else {
        isError.value = res.message;
        toast.error("Invalid email or password!");
      }
    } catch (err) {
      isError.value =  err.response?.data?.message || "Log in failed";
    } finally {
      isLoading.value = false;
    }
  }

  const handleRegister = async (credentials) => {
    isLoading.value = true;
    isError.value = null;
    isSuccess.value = null;

    try {
      const res = await store.register(credentials);
      if (res.success) {
        isSuccess.value = res.message;
        setTimeout(() => router.push('/login'), 1500);
        toast.success("Account created successfully!");
      } else {
        isError.value = res.message;
        toast.error("Invalid field input!");
      }
    } catch (err) {
      isError.value = err.response?.data?.message;
    } finally {
      isLoading.value = false;
    }
  }

  const handleLogout = () => {
    store.logout();
    router.push('/');
  }

  return { isLoading, isError, isSuccess, handleLogin, handleRegister, handleLogout }
}