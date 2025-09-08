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
    register() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      // Тут можна відправити дані на сервер
      console.log("Registering user:", this.username, this.email);
      alert(`User ${this.username} registered successfully!`);
      
      // Очистка форми
      this.username = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
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
