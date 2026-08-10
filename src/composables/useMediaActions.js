import { useToast } from "vue-toastification";
import { useAuthStore } from "../stores/authStore";
import { useProfileStore } from "../stores/profileStore";

export function useMediaActions() {
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const toast = useToast();

  const playMedia = async (item, type = 'movie') => {
    if (!authStore.isLoggedIn) {
      toast.warning('Please login to save your history!');
      return false;
    }

    if (!item) {
      toast.error('No media selected.');
      return false;
    }

    await profileStore.addToHistory(item.id, type, item.title);
    console.log("Simulating stream for ID: ", item.id);
  };

  return { playMedia };
}