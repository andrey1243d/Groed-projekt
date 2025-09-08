import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/home.vue';
import register from './pages/registration.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'About',
    component: register
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
