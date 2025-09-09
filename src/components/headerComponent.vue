<template>
  <header class="header">
    <h1>My App</h1>
    <router-link to="/">home</router-link>
    <router-link to="/register">register</router-link>
    <router-link to="/login">login</router-link>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data() {
    return {
      user: null
    };
  },
  created() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.user = { username: payload.username };
    } catch (err) {
      console.error("Неможливо отримати дані користувача з токена:", err);
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.user = null;
      // можна перенаправити на логін
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f0f0f0;
}

button {
  margin-left: 10px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
