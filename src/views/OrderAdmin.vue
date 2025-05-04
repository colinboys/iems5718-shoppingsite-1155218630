<template>
  <div class="order-admin">
    <!-- <h2>Order Management</h2> -->
    
    <div class="orders-list">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Total Price</th>
            <th>Items</th>
            <th>Status</th>
            <th>Payment Status</th>
            <th>Created At</th>
            <th>Paid At</th>
            <!-- <th>Actions</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.order_id">
            <td>{{ order.order_id }}</td>
            <td>{{ order.user_id }}</td>
            <td>${{ order.total_price }}</td>
            <td>
              <button @click="showItems(order)" class="view-items-btn">
                View Items
              </button>
            </td>
            <td>
              <span :class="['status-badge', order.status]">
                {{ order.status }}
              </span>
            </td>
            <td>
              <span :class="['payment-badge', order.payment_status]">
                {{ order.payment_status }}
              </span>
            </td>
            <td>{{ formatDate(order.created_at) }}</td>
            <td v-if="order.payment_status=='paid'">{{ formatDate(order.paid_at) }}</td>
            <td v-if="order.payment_status=='unpaid'">Unpaid </td>
            <!-- <td>
              <select v-model="order.status" @change="updateOrderStatus(order)">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for displaying order items -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>Order Items</h3>
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in selectedOrderItems" :key="item.pid">
              <td>{{ item.pid }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="showModal = false" class="close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'

const orders = ref([])
const showModal = ref(false)
const selectedOrderItems = ref([])

const fetchOrders = async () => {
  try {
    const response = await request.get('/api/admin/orders', {
      headers: { 'Authorization': `${localStorage.getItem('auth_token')}` }
    })
    orders.value = response.data
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  }
}

const showItems = (order) => {
  try {
    // 检查 items 是否已经是对象
    selectedOrderItems.value = typeof order.items === 'string' 
      ? JSON.parse(order.items)
      : order.items;
    showModal.value = true;
  } catch (error) {
    console.error('Failed to parse order items:', error);
    alert('Error displaying order items');
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const updateOrderStatus = async (order) => {
  try {
    await request.put(`/api/admin/orders/${order.order_id}`, {
      status: order.status
    }, {
      headers: { 'Authorization': `${localStorage.getItem('auth_token')}` }
    })
  } catch (error) {
    console.error('Failed to update order status:', error)
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-admin {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
}

.status-badge, .payment-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.status-badge.pending { background-color: #fff3cd; color: #856404; }
.status-badge.processing { background-color: #cce5ff; color: #004085; }
.status-badge.completed { background-color: #d4edda; color: #155724; }
.status-badge.cancelled { background-color: #f8d7da; color: #721c24; }

.payment-badge.paid { background-color: #d4edda; color: #155724; }
.payment-badge.unpaid { background-color: #f8d7da; color: #721c24; }

.view-items-btn {
  padding: 4px 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 500px;
}

.close-btn {
  margin-top: 20px;
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
</style>
