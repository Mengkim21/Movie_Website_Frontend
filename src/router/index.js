import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore.js";
import LoginView from "../views/authView/LoginView.vue";
import HomeView from "../views/homeView/HomeView.vue";
import MoviesView from "../views/moviesView/MoviesView.vue";
import ShowsView from "../views/showView/ShowsView.vue";

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/movies',
    name: 'Movies',
    component: MoviesView
  },
  {
    path: '/shows',
    name: 'Shows',
    component: ShowsView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  const isLoggedIn = !!authStore.token;

  const publicPages = ['Login', 'Home', 'Movies', 'Shows'];
  const authRequired = !publicPages.includes(to.name);

  if (to.name !== "Login" && !isLoggedIn && authRequired) {
    return { name: "Login" };
  } else if (to.name === "Login" && isLoggedIn) {
    return { path: "/" };
  } 
});

export default router;