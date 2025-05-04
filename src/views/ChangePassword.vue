<template>
  <div class="auth-container">
    <div class="form-container">
      <h2>Change Password</h2>
      <form @submit.prevent="handleChangePassword">
        <div class="form-group">
          <label>Current Password</label>
          <input v-model="currentPassword" type="password" required />
        </div>
        <div class="form-group">
          <label>New Password</label>
          <input v-model="newPassword" type="password" required />
        </div>
        <div class="form-group">
          <label>Confirm New Password</label>
          <input v-model="confirmNewPassword" type="password" required />
        </div>
        <button type="submit">Change Password</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import request from '@/utils/request'

const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const router = useRouter();
const store = useStore();

const handleChangePassword = async () => {
  if (newPassword.value !== confirmNewPassword.value) {
    errorMessage.value = 'New passwords do not match';
    return;
  }

  try {
    const response = await request.get('/api/change-password', {
      current_password: currentPassword.value,
      new_password: newPassword.value
    }, {
      headers: { 'Authorization': `${localStorage.getItem('auth_token')}` }
    });

    successMessage.value = 'Password changed successfully. You will be logged out.';
    errorMessage.value = '';

    // Log out the user
    localStorage.removeItem('auth_token');
    store.dispatch('logout');
    setTimeout(() => {
      router.push('/login');
    }, 2000); // Redirect to login page after 2 seconds
  } catch (error) {
    errorMessage.value = 'Password change failed: ' + error.response.data.detail;
    successMessage.value = '';
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
.success {
  color: green;
}
</style>
