import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore.js";
import LoginPage from "../views/authView/LoginPage.vue";
import HomePage from "../views/homeView/HomePage.vue";

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = !!authStore.token;

  if (to.name !== "Login" && !isLoggedIn) {
    next({ name: "Login" });
  } else if (to.name === "Login" && isLoggedIn) {
    next({ path: "/" });
  } else {
    next();
  }
});

export default router;