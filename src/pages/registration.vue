<template>
  <div>
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
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Registration failed");
        }

        const data = await response.json();
        alert(`User ${data.username} registered successfully!`);

        // Очистка форми
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
div {
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
