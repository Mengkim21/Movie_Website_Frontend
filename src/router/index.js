import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore.js";
import LoginView from "../views/authView/LoginView.vue";
import HomeView from "../views/homeView/HomeView.vue";
import MoviesView from "../views/moviesView/MoviesView.vue";
import ShowsView from "../views/showView/ShowsView.vue";
import DetailsView from "../views/detailsView/DetailsView.vue";
import SearchView from "../views/searchView/SearchView.vue";
import ProfileView from "../views/authView/ProfileView.vue";
import RegisterView from "../views/authView/RegisterView.vue";

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
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
  },
  {
    path: '/movie/:id',
    name: 'movie-details',
    component: DetailsView
  },
  {
    path: '/tv/:id',
    name: 'tv-details',
    component: DetailsView
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchView
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// router.beforeEach((to, from) => {
//   const authStore = useAuthStore();
//   const isLoggedIn = !!authStore.token;

//   const publicPages = ['Login', 'Register', 'Home', 'Movies', 'Shows', 'movie-details', 'tv-details', 'Search', 'Profile'];
//   const authRequired = !publicPages.includes(to.name);

//   if (to.name !== "Login" && !isLoggedIn && authRequired) {
//     return { name: "Login" };
//   } else if (to.name === "Login" && isLoggedIn) {
//     return { path: "/" };
//   } 

//   if (to.name !== "Register" && !isLoggedIn && authRequired) {
//     return { name: "Register" };
//   } else if (to.name === 'Register' && isLoggedIn) {
//     return { path: "/" };
//   }
// });

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore(); 

  if (!authStore.authStatus === 'loading') {
    await authStore.checkAuth();
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'Login' };
  }

  if ((to.name === 'Login' || to.name === 'Register') && authStore.isLoggedIn) {
    return { name: 'Home' };
  }

  return true;
});

export default router;