import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/authView/LoginPage.vue";

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;