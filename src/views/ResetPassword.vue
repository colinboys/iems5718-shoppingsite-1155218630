<template>
  <div class="reset-password">
    <div class="form-container">
      <!-- 输入邮箱请求重置页面 -->
      <div v-if="!token">
        <h2>Reset Password</h2>
        <div v-if="step === 1">
          <form @submit.prevent="requestReset">
            <div class="form-group">
              <label>Email Address</label>
              <input v-model="email" type="email" required />
            </div>
            <button type="submit">Send Reset Link</button>
          </form>
        </div>
        <div v-if="step === 2">
          <p class="success-message">
            If an account exists with this email, you will receive a password reset link.
          </p>
        </div>
      </div>

      <!-- 重置密码页面 -->
      <div v-else>
        <h2>Set New Password</h2>
        <form @submit.prevent="resetPassword">
          <div class="form-group">
            <label>New Password</label>
            <input v-model="newPassword" type="password" required />
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <input v-model="confirmPassword" type="password" required />
          </div>
          <button type="submit">Reset Password</button>
        </form>
      </div>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    return {
      token: route.params.token
    }
  },
  data() {
    return {
      email: '',
      step: 1,
      errorMessage: '',
      successMessage: '',
      newPassword: '',
      confirmPassword: ''
    }
  },
  methods: {
    async requestReset() {
      try {
        const formData = new FormData()
        formData.append('email', this.email)
        
        await request.post('/api/reset-password-request', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        this.step = 2
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = error.response?.data?.detail || 'An error occurred'
      }
    },
    
    async resetPassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match'
        return
      }

      try {
        const formData = new FormData()
        formData.append('new_password', this.newPassword)
        
        await request.post(`/api/reset-password/${this.token}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        this.successMessage = 'Password has been reset successfully'
        // 3秒后跳转到登录页
        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)
      } catch (error) {
        this.errorMessage = error.response?.data?.detail || 'Failed to reset password'
      }
    }
  }
}
</script>

<style scoped>
.reset-password {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
}

.form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 15px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}

.error {
  color: red;
  margin-top: 1rem;
}

.success-message {
  color: #42b983;
  text-align: center;
  margin-top: 1rem;
}
</style>
