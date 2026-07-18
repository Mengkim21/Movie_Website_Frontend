import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore.js";
import LoginPage from "../views/authView/LoginPage.vue";
import HomePage from "../views/homeView/HomePage.vue";
import MoviePage from "../views/moviesView/MoviePage.vue";

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
    component: MoviePage
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = !!authStore.token;

  const publicPages = ['Login', 'Home', 'Movies', 'Shows'];
  const authRequired = !publicPages.includes(to.name);

  if (to.name !== "Login" && !isLoggedIn && authRequired) {
    next({ name: "Login" });
  } else if (to.name === "Login" && isLoggedIn) {
    next({ path: "/" });
  } 
  next();
});

export default router;