<template>
  <div class="registration-container">
    <h1>Registration</h1>
    <input type="text" v-model="username" placeholder="Username" />
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <input type="password" v-model="confirmPassword" placeholder="Confirm Password" />
    <button @click="register">Register</button>
  </div>
</template>

<script>
export default {
  name: 'Registration',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  },
  methods: {
    async register() {
      // Перевірка пароля
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        // Надсилаємо запит на сервер
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password
          })
        });

        const data = await response.json();

        // Перевірка на помилки від сервера
        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }

        // ✅ Зберігаємо токен у localStorage для авторизації на інших сторінках
        localStorage.setItem("token", data.token);

        alert(`User ${data.user.username} registered successfully!`);

        // Очищаємо форму
        this.username = '';
        this.email = '';
        this.password = '';
        this.confirmPassword = '';

      } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}`);
      }
    }
  }
};
</script>

<style scoped>
.registration-container {
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
