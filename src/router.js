// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import Home from './pages/home.vue';
import WorkenPage from './pages/workenPage.vue';
import Login from './pages/login.vue';
import Register from './pages/registration.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/worken', component: WorkenPage, meta: { requiresRole: 'worken' } },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Глобальний guard для перевірки ролі з токена
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresRole) {
    if (!token) return next("/login");

    try {
      // Перевіряємо тип імпорту
      const decodeFunction = jwt_decode_module.default || jwt_decode_module;
      const payload = decodeFunction(token);
      
      if (!payload.role || payload.role !== to.meta.requiresRole) {
        return next("/login");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      return next("/login");
    }
  }

  next();
});

export default router;