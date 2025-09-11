<template>
  <div class="worken-page">
    <h1>Welcome, {{ user.username || 'Guest' }}!</h1>
    <p>Email: {{ user.email || '-' }}</p>
    <p>Role: {{ user.role || 'user' }}</p>

    <button @click="logout">Logout</button>

    <hr />

    <h2>Additional Info</h2>
    <p>Тут можна показувати інші дані користувача або робочі функції.</p>
  </div>
</template>

<script>
export default {
  name: 'WorkenPage',
  data() {
    return {
      user: {}  // тут буде інформація з профілю
    };
  },
  async created() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.$router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/me", { // змінив /profile на /me
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) {
        console.error("Помилка отримання профілю:", res.status);
        this.$router.push("/login");
        return;
      }

      this.user = await res.json();

    } catch (err) {
      console.error("Помилка при fetch:", err);
      this.$router.push("/login");
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.user = {};
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.worken-page {
  max-width: 500px;
  margin: 20px auto;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  margin-top: 10px;
  padding: 8px 12px;
  cursor: pointer;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #2980b9;
}
</style>
