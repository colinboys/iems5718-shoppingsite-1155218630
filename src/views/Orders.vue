<template>
  <div class="orders-page">
    <!-- <h2>My Orders</h2> -->
    <div class="orders-list">
      <div v-for="order in orders" :key="order.order_id" class="order-card">
        <div class="order-header">
          <span class="order-id">Order #{{ order.order_id }}</span>
          <span class="order-status" :class="order.status">{{ order.status }}</span>
        </div>
        <div class="order-items">
          <div v-for="item in order.items" :key="item.pid" class="order-item">
            <!-- 添加商品图片 -->
            <div class="item-image">
              <img :src="url_prefix + item.thumbnail_url" :alt="'Product ' + item.pid" />
            </div>
            <span class="item-name">{{ item.name }}</span>
            <span class="item-quantity">x{{ item.quantity }}</span>
            <span class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
        <div class="order-footer">
          <span class="total-label">Total:</span>
          <span class="total-price">${{ order.total_price }}</span>
          <span class="payment-status" :class="order.payment_status">
            {{ order.payment_status }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="orders.length === 0" class="no-orders">
      <p>You haven't placed any orders yet.</p>
      <button @click="$router.push('/')" class="shop-now">Shop Now</button>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  name: 'Orders',
  data() {
    return {
      orders: [],
      // url_prefix: "http://localhost:8000", // 添加url前缀
      url_prefix: "https://s20.iems5718.ie.cuhk.edu.hk:8000", // 生产环境使用
    }
  },
  async created() {
    try {
      const response = await request.get('/api/orders', {
        headers: { 'Authorization': `${localStorage.getItem('auth_token')}` }
      })
      this.orders = response.data
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
    console.log(this.orders)
  }
}
</script>

<style scoped>
.orders-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.order-id {
  font-weight: bold;
  color: #333;
}

.order-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.order-status.pending {
  background-color: #fff3cd;
  color: #856404;
}

.order-status.completed {
  background-color: #d4edda;
  color: #155724;
}

.order-items {
  margin: 15px 0;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
  gap: 15px; /* 添加间距 */
}

/* 新增商品图片样式 */
.item-image {
  width: 60px;
  height: 60px;
  min-width: 60px; /* 防止图片被压缩 */
  border-radius: 4px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-name {
  flex: 1; /* 让商品名称占据剩余空间 */
}

.order-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 15px;
  gap: 15px;
}

.total-label {
  font-weight: bold;
}

.total-price {
  font-size: 1.2em;
  color: #2c3e50;
}

.payment-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.payment-status.paid {
  background-color: #d4edda;
  color: #155724;
}

.payment-status.unpaid {
  background-color: #f8d7da;
  color: #721c24;
}

.no-orders {
  text-align: center;
  padding: 40px;
}

.shop-now {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.shop-now:hover {
  background-color: #0056b3;
}
</style>
