<template>
  <div class="main-page">
    <div class="sidebar">
      <!-- Left side: Category filter list -->
      <div class="category-card">
        <h3>Categories</h3>
        <ul class="category-list">
          <li v-for="category in categories" :key="category.catid" @click="filterByCategory(category)">
            {{ category.name }}
          </li>
        </ul>
      </div>
    </div>

    <div class="content">
      <header>
        <nav class="level-menu">
          <ul>
            <li><a href="#" @click="goToHome">Home</a></li>
            <li v-if="selectedCategory"><a>|{{ selectedCategory }}</a></li>
          </ul>
        </nav>
      </header>

      <!-- Main content: Products wrapped in a card -->
      <section class="product-list">
        <div v-for="product in products" :key="product.pid" class="product-item card">
          <img
            :src="url_prefix+product.thumbnail_url"
            alt="Product Thumbnail"
            @mouseover="hoverProduct(product.pid)"
            @click="goToProductPage(product.pid)"
          />
          <h3 @click="goToProductPage(product.pid)" class="product-name">{{ product.name }}</h3>
          <p>${{ product.price }}</p>
          <button @click="addToCart(product)">Add to Cart</button>
        </div>
      </section>
    </div>

    <!-- Shopping List in the top-right corner -->
    <div class="shopping-list" :class="{ expanded: hoverCart }" @mouseover="hoverCart = true" @mouseleave="hoverCart = false">
      <h4 v-if="!hoverCart">Shopping List (Total: ${{ totalPrice }})</h4>
      <div v-if="hoverCart">
        <h4>Shopping List (Total: ${{ totalPrice }})</h4>
        <ul>
          <li v-for="item in cart" :key="item.pid">
            {{ item.name }}
            <input 
              type="number" 
              v-model="item.quantity" 
              min="1" 
              @change="updateQuantity(item.pid, item.quantity)"
            />
            @ ${{ item.price * item.quantity }}
            <button @click="removeFromCart(item.pid)">Remove</button>
          </li>
        </ul>
        <button>Checkout</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import request from '@/utils/request'


export default {
  data() {
    return {
      // url_prefix: "http://localhost:8000",
      url_prefix: "http://13.215.48.147:8000",
      categories: [],
      selectedCategory: this.$route.params.category || null, // Get category from URL parameter
      products: [],
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      hoverCart: false,
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    },
  },
  methods: {
    async addToCart(product) {
      const cart = this.cart;
      const existingProduct = cart.find(item => item.pid === product.pid);
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        //  AJAX 获取商品信息
        const response = await request.get(`/api/one_product/${product.pid}`);
        // const response = await axios.get(`http://localhost:8000/api/one_product/${product.pid}`);
        const productDetails = response.data;
        cart.push({ ...productDetails, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    },
    removeFromCart(productId) {
      this.cart = this.cart.filter(item => item.pid !== productId);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    updateQuantity(productId, quantity) {
      const item = this.cart.find(item => item.pid === productId);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }
    },
    goToProductPage(productId) {
      this.$router.push(`/product/${productId}`);
    },
    goToHome() {
      this.selectedCategory = null; // reset selectedCategory
      this.fetchProducts();
      this.$router.push('/'); // turn to home page
    },
    filterByCategory(category) {
      this.selectedCategory = category.name;
      this.fetchProducts(category.catid);
      this.$router.push(`/category/${category.name}`);
       // Change route to display products for selected category
      
    },
    async fetchCategories() {
      const _this = this
        // await axios.get('http://localhost:8000/api/categories').then(resp => {
        //   _this.categories = resp.data
        // })
        await request.get('/api/categories').then(resp => {
          _this.categories = resp.data
        })
      
    },
    async fetchProducts(cid) {
      if (cid) {
        const _this = this
        // await axios.get(`http://localhost:8000/api/products?catid=${cid}`).then(resp => {
        //   _this.products = resp.data
        // })
        await request.get(`/api/products?catid=${cid}`).then(resp => {
          _this.products = resp.data
        })
      } else {
        const _this = this
        // await axios.get('http://localhost:8000/api/products').then(resp => {
        //   _this.products = resp.data
        // })
        await request.get('/api/products').then(resp => {
          _this.products = resp.data
        })
      }
  
    },
  },
  created() {
    // localStorage.clear()
    this.fetchCategories();
    this.fetchProducts(this.$route.query.cid);
  },

};
</script>

<style scoped>
.main-page {
  display: flex;
  gap: 20px;
}

.sidebar {
  width: 200px;
}

.category-card {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.category-list ul {
  list-style-type: none;
  padding: 0;
}

.category-list li {
  cursor: pointer;
}

.content {
  flex: 1;
}

.level-menu ul {
  display: flex;
  gap: 10px;
  list-style: none;
  padding: 0;
}

.level-menu li {
  cursor: pointer;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.product-item {
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.product-item img {
  width: 100%;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.product-item:hover img {
  transform: scale(1.05);
}

.product-name {
  cursor: pointer;
}

.product-name:hover {
  color: #007bff;
}

/* Shopping List in the top-right corner */
.shopping-list {
  position: fixed;
  top: 10px;
  right: 10px;
  background: #fff;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 100;
  width: 250px;
  max-height: 300px;
  overflow-y: auto;
}

.shopping-list h4 {
  margin: 0;
}

.shopping-list ul {
  list-style-type: none;
  padding: 0;
}

.shopping-list button {
  margin-top: 10px;
}

.shopping-list.expanded {
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
}
</style>