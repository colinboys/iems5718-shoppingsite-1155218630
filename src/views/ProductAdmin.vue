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
              @change="handleImage"
              accept="image/*"
              ref="fileInput"
            >
            <!-- <div v-if="preview" class="preview-container">
              <img :src="preview" class="preview-image" alt="Preview">
              <button @click="clearImage" class="clear-preview">×</button>
            </div> -->
            <div v-if="uploadStatus" class="upload-status">
              {{ uploadStatus }}
            </div>
          </div>

          <!-- 添加拖放上传区域 -->
          <div 
            class="drop-zone"
            @drop.prevent="handleDrop"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            :class="{ 'drag-over': isDragging }"
          >
            <span v-if="!preview">Drag & drop image here or click to upload</span>
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileSelect" 
              accept="image/*"
              style="display: none"
            >
            <img v-if="preview" :src="preview" class="image-preview" alt="Preview">
            <button v-if="preview" @click.prevent="clearImage" class="clear-image">×</button>
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
import request from '@/utils/request'

const url_prefix = ref("https://s20.iems5718.ie.cuhk.edu.hk:8000")
// const url_prefix = ref("http://localhost:8000")
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
const preview = ref('')
const isDragging = ref(false)

// 计算属性
const dialogTitle = computed(() => 
  isEditMode.value ? 'Edit Product' : 'Add Product'
)

// 加载商品数据
const loadProducts = async () => {
  
  // const res = await axios.get('http://localhost:8000/api/products')
  const res = await request.get('/api/products')
  products.value = res.data
  console.log(products.value)
  for (let i = 0; i < products.value.length; i++) {
    // products.value[i].catid = categories.value.find(item => item.catid === products.value[i].catid).name
    // products.value[i].append('cname',categories.value.find(item => item.catid === products.value[i].catid).name )
    products.value[i].cname  = categories.value.find(item => item.catid === products.value[i].catid).name 
  }
}

// 加载分类数据
const loadCategories = async () => {
  // const res = await axios.get('http://localhost:8000/api/categories')
  const res = await request.get('/api/categories')
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
      // await axios.put(`http://localhost:8000/api/products/${currentId.value}`, formData.value)
      await request.put(`/api/products/${currentId.value}`, formData.value, {
      headers: { 'Authorization': `${localStorage.getItem('auth_token')}` }
    })
    } else {
      // await axios.post('http://localhost:8000/api/products', formData.value)
      await request.post('/api/products', formData.value, {
      headers: { 'Authorization': `${localStorage.getItem('auth_token')}` }
    })
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
    // await axios.delete(`http://localhost:8000/api/products/${id}`)
    await request.delete(`/api/products/${id}`, {
      headers: { 'Authorization': `${localStorage.getItem('auth_token')}` }
    })
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
    const res = await request.post('/api/upload-image', formData1, {
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

// 处理拖放上传
const handleDragOver = (e) => {
  isDragging.value = true
}

const handleDragLeave = (e) => {
  isDragging.value = false
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    handleImage(file)
  } else {
    alert('Please drop an image file')
  }
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    handleImage(file)
  }
}

const handleImage = (event) => {
  const file = event.target.files[0] || event.dataTransfer.files[0];
  
  if (!file) return;

  // 验证文件类型和大小
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB限制
    alert('Image size should be less than 5MB');
    return;
  }

  // 创建预览
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.value = e.target.result;
  };
  reader.readAsDataURL(file);

  // 上传图片
  uploadImage(file);
};

const uploadImage = async (file) => {
  const formData1 = new FormData()
  formData1.append('file', file)
  
  try {
    const response = await request.post('/api/upload-image', formData1, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `${localStorage.getItem('auth_token')}`
      }
    })
    
    formData.value.image_url = response.data.image_url
    formData.value.thumbnail_url = response.data.thumbnail_url
  } catch (error) {
    console.error('Failed to upload image:', error)
    alert('Failed to upload image')
  }
}

const clearImage = () => {
  preview.value = '';
  formData.value.image_url = '';
  formData.value.thumbnail_url = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

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

  .drop-zone {
    width: 100%;
    height: 200px;
    border: 2px dashed #ddd;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .drop-zone:hover {
    border-color: #409eff;
  }

  .drag-over {
    border-color: #409eff;
    background-color: rgba(64, 158, 255, 0.1);
  }

  .image-preview {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .clear-image {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clear-image:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .preview-container {
    margin-top: 10px;
    position: relative;
    display: inline-block;
  }

  .preview-image {
    max-width: 200px;
    max-height: 200px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }

  .clear-preview {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .clear-preview:hover {
    background: rgba(0, 0, 0, 0.7);
  }
</style>