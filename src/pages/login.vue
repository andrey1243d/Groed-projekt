<template>
  <div class="login-container">
    <h1>Login</h1>
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="login">Login</button>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        alert("Будь ласка, заповніть всі поля!");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Помилка входу");
          return;
        }

        // Зберігаємо токен у localStorage
        localStorage.setItem("token", data.token);

        // Тепер правильний доступ до username через data.user
        alert(`Вхід успішний! Ласкаво просимо, ${data.user.username}`);

        // Очистка форми
        this.email = "";
        this.password = "";

      } catch (err) {
        console.error(err);
        alert("Сталася помилка при підключенні до сервера");
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 20px auto;
}

input {
  margin: 5px 0;
  padding: 8px;
  font-size: 14px;
}

button {
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}
</style>
