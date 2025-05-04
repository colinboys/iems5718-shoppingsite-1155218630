<template>
    <div class="payment-result">
      <div class="result-card">
        <!-- 添加支付状态加载动画 -->
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Verifying payment...</p>
        </div>
        
        <div v-else :class="{ success: paymentStatus === 'success', error: paymentStatus === 'error' }">
          <i class="icon" :class="paymentStatus === 'success' ? 'success-icon' : 'error-icon'"></i>
          <h2>{{ paymentStatus === 'success' ? 'Payment Successful!' : 'Payment Failed' }}</h2>
          <p>{{ statusMessage }}</p>
          <div class="buttons">
            <button @click="goToOrders" class="view-orders">View My Orders</button>
            <button @click="goToHome" class="continue-shopping">Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
import request from '@/utils/request'

export default {
  data() {
    return {
        loading: true,
      paymentStatus: '',
      statusMessage: '',
    }
  },
  async created() {
    // 从URL获取PayPal返回的参数
    const token = this.$route.query.token
    const PayerID = this.$route.query.PayerID

    if (token && PayerID) {
      try {
        // 验证支付状态
        const response = await request.get(`/api/payment-success?token=${token}&PayerID=${PayerID}`)
        if (response.data.status === 'success') {
          this.paymentStatus = 'success'
          this.statusMessage = 'Your payment has been processed successfully.'
        } else {
          this.paymentStatus = 'error'
          this.statusMessage = 'There was an issue processing your payment.'
        }
      } catch (error) {
        this.paymentStatus = 'error'
        this.statusMessage = 'Payment verification failed. Please contact support.'
      }
    } else {
      this.paymentStatus = 'error'
      this.statusMessage = 'Invalid payment response'
    }
    this.loading = false // 停止加载动画
  },
  methods: {
    goToOrders() {
      this.$router.push('/orders')
    },
    goToHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
/* 添加加载动画样式 */
.loading {
  text-align: center;
  padding: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 20px auto;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.payment-result {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.result-card {
  background: white;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.success-icon::before {
  content: "✓";
  color: #4CAF50;
}

.error-icon::before {
  content: "✕";
  color: #f44336;
}

.buttons {
  margin-top: 30px;
  display: flex;
  gap: 15px;
  justify-content: center;
}

button {
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.view-orders {
  background-color: #4CAF50;
  color: white;
}

.continue-shopping {
  background-color: #2196F3;
  color: white;
}

button:hover {
  opacity: 0.9;
}
</style>
