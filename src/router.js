import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/home.vue';
import register from './pages/registration.vue';
import login from './pages/login.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
