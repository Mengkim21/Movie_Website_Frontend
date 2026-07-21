import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore.js";
import LoginPage from "../views/authView/LoginPage.vue";
import HomePage from "../views/homeView/HomePage.vue";
import MoviesPage from "../views/moviesView/MoviesPage.vue";
import ShowsPage from "../views/showView/ShowsPage.vue";

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/movies',
    name: 'Movies',
    component: MoviesPage
  },
  {
    path: '/shows',
    name: 'Shows',
    component: ShowsPage
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