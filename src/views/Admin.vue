<!-- AdminHome.vue -->
<template>
  <div class="admin-home">
    <!-- <h1>管理面板</h1> -->
    <div class="tabs">
      <button 
        :class="['tab-button', { active: activeTab === 'categories' }]"
        @click="activeTab = 'categories'"
      >
        Category Management
      </button>
      <button 
        :class="['tab-button', { active: activeTab === 'products' }]"
        @click="activeTab = 'products'"
      >
        Product Management
      </button>
    </div>

    <div class="tab-content">
      <CategoryAdmin v-if="activeTab === 'categories'" />
      <ProductAdmin v-if="activeTab === 'products'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CategoryAdmin from './CategoryAdmin.vue'
import ProductAdmin from './ProductAdmin.vue'

const activeTab = ref('categories') // 默认显示分类管理
</script>

<style scoped>
.admin-home {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #ddd;
}

.tab-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background: none;
  transition: all 0.3s;
}

.tab-button.active {
  border-bottom: 2px solid #409eff;
  color: #409eff;
}

.tab-button:hover {
  background-color: #f5f5f5;
}

.tab-content {
  padding: 20px 0;
}
</style>