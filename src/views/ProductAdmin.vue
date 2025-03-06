<!-- ProductAdmin.vue -->
<template>
  <div class="admin-container">
    <!-- 操作按钮组 -->
    <div class="action-bar">
      <button class="btn primary" @click="showCreateDialog">Add Product</button>
    </div>

    <!-- 数据表格 -->
    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Prooduct Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Description</th>
          <th>Picture</th>
          <th>Operation</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.pid">
          <td>{{ item.pid }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.cname }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.description }}</td>
          <td>
            <img 
              v-if="item.thumbnail_url" 
              :src="url_prefix+item.thumbnail_url" 
              class="thumbnail"
            >
            <span v-else>Not Found Image</span>
          </td>
          <td class="actions">
            <button class="btn edit" @click="showEditDialog(item)">Edit</button>
            <button class="btn danger" @click="deleteItem(item.pid)">Delete</button>
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
            <label>Name</label>
            <input 
              type="text" 
              v-model="formData.name" 
              required
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label>Category</label>
            <select 
              v-model="formData.catid" 
              required
              class="form-input"
            >
              <option 
                v-for="category in categories" 
                :key="category.catid" 
                :value="category.catid"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Price</label>
            <input 
              type="number" 
              v-model="formData.price" 
              step="0.01"
              required
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="formData.description" 
              class="form-input"
            ></textarea>
          </div>
          <div class="form-group">
            <label>Upload Picture</label>
            <input 
              type="file" 
              @change="handleFileUpload"
              accept="image/*"
            >
            <div v-if="uploadStatus" class="upload-status">
              {{ uploadStatus }}
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn" @click="closeDialog">Cancel</button>
            <button type="submit" class="btn primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'


const url_prefix = ref("http://localhost:8000")
// 数据状态
const products = ref([])
const categories = ref([])
const showDialog = ref(false)
const formData = ref({
  name: '',
  catid: '',
  price: 0,
  description: '',
  image_url: '',
  thumbnail_url: ''
})
const currentId = ref(null)
const isEditMode = ref(false)
const uploadStatus = ref('')

// 计算属性
const dialogTitle = computed(() => 
  isEditMode.value ? 'Edit Product' : 'Add Product'
)

// 加载商品数据
const loadProducts = async () => {
  const res = await axios.get('http://localhost:8000/api/products')
  products.value = res.data
  console.log(products.value)
  for (let i = 0; i < products.value.length; i++) {
    // products.value[i].catid = categories.value.find(item => item.catid === products.value[i].catid).name
    products.value[i].append('cname',categories.value.find(item => item.catid === products.value[i].catid).name )
  }
}

// 加载分类数据
const loadCategories = async () => {
  const res = await axios.get('http://localhost:8000/api/categories')
  categories.value = res.data
}

// 显示创建弹窗
const showCreateDialog = () => {
  isEditMode.value = false
  formData.value = {
    name: '',
    catid: '',
    price: 0,
    description: '',
    image_url: '',
    thumbnail_url: ''
  }
  showDialog.value = true
}

// 显示编辑弹窗
const showEditDialog = (item) => {
  isEditMode.value = true
  formData.value = { ...item }
  currentId.value = item.pid
  showDialog.value = true
}


// 表单验证规则
const validateForm = () => {
  if (!formData.value.name.trim()) {
    alert('Product name can not be blank')
    return false
  }
  if (!formData.value.catid) {
    alert('Please select product category')
    return false
  }
  if (formData.value.price <= 0) {
    alert('The price must be greater than 0')
    return false
  }
  return true
}

// 提交表单
const submitForm = async () => {
  if (!validateForm()) return
  try {
    if (isEditMode.value) {
      await axios.put(`http://localhost:8000/api/products/${currentId.value}`, formData.value)
    } else {
      await axios.post('http://localhost:8000/api/products', formData.value)
    }

    await loadProducts()
    closeDialog()
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// 删除条目
const deleteItem = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await axios.delete(`http://localhost:8000/api/products/${id}`)
    await loadProducts()
    confirm('Delete Successful')
  }
}

// 文件上传处理
const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const formData1 = new FormData()
  formData1.append('file', file)

  try {
    const res = await axios.post('http://localhost:8000/api/upload-image', formData1, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    // 更新表单图片字段
  
    formData.value.image_url = res.data.image_url
    formData.value.thumbnail_url = res.data.thumbnail_url

    uploadStatus.value = 'Upload Successful'
  } catch (error) {
    uploadStatus.value = 'Upload Failed'
  }
}

// 关闭弹窗
const closeDialog = () => {
  showDialog.value = false
}

onMounted(() => {
  loadCategories()
  loadProducts()
})
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