<template>
  <div class="auth-container">
    <div class="form-container">
      <h2 v-if="isLogin">Login</h2>
      <h2 v-else>Register</h2>
      <form @submit.prevent="isLogin ? handleLogin() : handleRegister()">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>
        <div v-if="!isLogin" class="form-group">
          <label>Username</label>
          <input v-model="username" type="text" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
        <div v-if="!isLogin" class="form-group">
          <label>Confirm Password</label>
          <input v-model="confirmPassword" type="password" required />
        </div>
        <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p class="reset-link">
          <router-link to="/reset-password">Forgot password?</router-link>
        </p>
      </form>
      <p @click="toggleForm" class="toggle-link">
        {{ isLogin ? 'Don\'t have an account? Register' : 'Already have an account? Login' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import request from '@/utils/request';

const email = ref('');
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const isLogin = ref(true);
const router = useRouter();
const store = useStore();

const toggleForm = () => {
  isLogin.value = !isLogin.value;
  errorMessage.value = '';
};

const handleLogin = async () => {
  try {
    const response = await request.post('/api/login', {
      email: email.value,
      password: password.value
    });

    // 保存登录信息到 localStorage
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('username', response.data.username);
    localStorage.setItem('isAdmin', response.data.is_admin);
    
    store.dispatch('login', {
      username: response.data.username,
      isAdmin: response.data.is_admin
    });

    if (response.data.is_admin) {
      router.push('/admin');
    } else {
      router.push('/');
    }
  } catch (error) {
    errorMessage.value = 'Invalid email or password';
  }
};

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  try {
    const response = await request.post('/api/register', {
      email: email.value,
      username: username.value,
      password: password.value
    });

    errorMessage.value = 'Registration successful. Please login.';
    toggleForm();
  } catch (error) {
    errorMessage.value = 'Registration failed: ' + error.response.data.detail;
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  text-align: center;
  background-color: #ace6bd33;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.form-container {
  margin-bottom: 1rem;
}
.form-group {
  margin-bottom: 1rem;
  margin-left: 120px;
  /* align-items: center; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
}
.form-group label {
  margin-bottom: 0.5rem;
}
.error {
  color: red;
}
.toggle-link {
  color: #23b372;
  cursor: pointer;
}
.reset-link {
  margin-top: 1rem;
  font-size: 0.9em;
}
</style>