import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js'; // <-- підключаємо роутер

const app = createApp(App);

app.use(router);

app.mount('#app');
