<template>
  <div class="home-container">
    <h1>Home</h1>
    <div v-if="user">
      <p>Вітаємо, {{ user.username }}!</p>
      <p>Email: {{ user.email }}</p>
    </div>
    <div v-else>
      <p>Ви не авторизовані. Будь ласка, увійдіть.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      user: null
    };
  },
  async created() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
  const res = await fetch("http://localhost:3000/profile", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error(errorData.error || `Помилка ${res.status}`);
    return;
  }

  const data = await res.json();
  this.user = data;

} catch (err) {
  console.error("Помилка при fetch:", err);
  }
}};
</script>

<style scoped>
.home-container {
  width: 400px;
  margin: 20px auto;
  text-align: center;
}

p {
  font-size: 16px;
  margin: 5px 0;
}
</style>
