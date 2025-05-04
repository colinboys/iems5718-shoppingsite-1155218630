<!-- CategoryAdmin.vue -->
<template>
    <div class="admin-container">
      <!-- 操作按钮组 -->
      <div class="action-bar">
        <button class="btn primary" @click="showCreateDialog">Add Category</button>
      </div>
  
      <!-- 数据表格 -->
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in categories" :key="item.catid">
            <td>{{ item.catid }}</td>
            <td>{{ item.name }}</td>
            <td class="actions">
              <button class="btn edit" @click="showEditDialog(item)">Edit</button>
              <button class="btn danger" @click="deleteItem(item.catid)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- 弹窗 -->
      <div v-if="showDialog" class="modal">
        <div class="modal-content">
          <h3>{{ dialogTitle }}</h3>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label>Category Name</label>
              <input 
                type="text" 
                v-model="formData.name" 
                required
                class="form-input"
              >
            </div>
            <div class="form-actions">
              <button type="button" class="btn" @click="closeDialog">取消</button>
              <button type="submit" class="btn primary">提交</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import request from '@/utils/request'


  // 数据状态
  const categories = ref([])
  const showDialog = ref(false)
  const formData = ref({ name: '' })
  const currentId = ref(null)
  const isEditMode = ref(false)
  
  // 计算属性
  const dialogTitle = computed(() => 
    isEditMode.value ? 'Edit Category' : 'Add Category'
  )
  
  // 加载数据
  const loadData = async () => {
    // const res = await axios.get('http://localhost:8000/api/categories')
    const res = await request.get('/api/categories')
    categories.value = res.data
  }
 
  // 显示创建弹窗
  const showCreateDialog = () => {
    isEditMode.value = false
    formData.value = { name: '' }
    showDialog.value = true
  }
  
  // 显示编辑弹窗
  const showEditDialog = (item) => {
    isEditMode.value = true
    formData.value = { ...item }
    currentId.value = item.catid
    showDialog.value = true
  }
  
  // 提交表单
  const submitForm = async () => {
    try {
      if (isEditMode.value) {
        await request.put(`/api/categories/${currentId.value}`, formData.value, {
      headers: { 'Authorization': `${localStorage.getItem('auth_token')}` }
    })
        // await axios.put(`http://localhost:8000/api/categories/${currentId.value}`, formData.value)
      } else {
        await request.post('/api/categories', formData.value, {
      headers: { 'Authorization': `${localStorage.getItem('auth_token')}` }
    })
        // await axios.post('http://localhost:8000/api/categories', formData.value)
      }
      await loadData()
      closeDialog()
    } catch (error) {
      console.error('操作失败:', error)
    }
  }
  
  // 删除条目
  const deleteItem = async (id) => {
    if (confirm('确定要删除该分类吗？')) {
      // await axios.delete(`http://localhost:8000/api/categories/${id}`)
      await request.delete(`/api/categories/${id}`, {
      headers: { 'Authorization': `${localStorage.getItem('auth_token')}` }
    })
      await loadData()
    }
  }
  
  // 关闭弹窗
  const closeDialog = () => {
    showDialog.value = false
  }
  
  onMounted(loadData)
  </script>
  
  <style scoped>
  /* 基础样式 */
  .admin-container {
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .data-table th,
  .data-table td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  .data-table th {
    background-color: #f5f5f5;
  }
  
  .actions {
    min-width: 150px;
  }
  
  .btn {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 4px;
    transition: all 0.3s;
  }
  
  .btn.primary {
    background-color: #409eff;
    color: white;
    border: 1px solid #409eff;
  }
  
  .btn.edit {
    background-color: #e6a23c;
    color: white;
    border: 1px solid #e6a23c;
  }
  
  .btn.danger {
    background-color: #f56c6c;
    color: white;
    border: 1px solid #f56c6c;
  }
  
  /* 模态框样式 */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: white;
    padding: 24px;
    border-radius: 8px;
    min-width: 400px;
  }
  
  .form-group {
    margin-bottom: 16px;
  }
  
  .form-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .form-actions {
    margin-top: 20px;
    text-align: right;
  }
  </style>