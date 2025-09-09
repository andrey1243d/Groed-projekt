<template>
  <div id="app">
    <!-- Хедер, завжди на всіх сторінках -->
    <HeaderComponent />

    <!-- Основний контент залежно від маршруту -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import HeaderComponent from '@/components/headerComponent.vue'; // зверни увагу на правильний шлях та назву файлу

export default {
  name: 'App',
  components: {
    HeaderComponent
  }
};
</script>

<style>
/* Загальні стилі додатку */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
}

main {
  padding: 20px;
}
</style>
