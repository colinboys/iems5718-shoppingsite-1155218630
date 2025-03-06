<template>
  <div class="product-page">
    <!-- Left side: Category filter list -->
    <div class="sidebar">
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
            <li><a href="#">Home</a></li>
            <li><a @click="goToCategoryPage(selectedCategory)">|{{ selectedCategory }}</a></li>
            <li>|{{ product.name }}</li>
          </ul>
        </nav>
      </header>

      <!-- Main content -->
      <section class="product-details">
        <div class="product-image">
          <img :src="url_prefix+product.image_url" alt="Product Image" />
        </div>
        <div class="product-info">
          <h2>{{ product.name }}</h2>
          <p>{{ product.description }}</p>
          <p class="product-price">${{ product.price }}</p>
          <button @click="addToCart(product)" class="add-to-cart-btn">Add to Cart</button>
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
            @ ${{ (item.price * item.quantity).toFixed(2) }}
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

export default {
  data() {
    return {
      url_prefix: "http://localhost:8000",
      categories: [],
      selectedCategory: null,
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      hoverCart: false,
      product: {},
      pid: ''
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    }
  },
  methods: {
    // 添加商品到购物车（AJAX）
    async addToCart(product) {
      try {
        const response = await axios.get(`http://localhost:8000/api/one_product/${product.pid}`);
        const productDetails = response.data;
        
        const existingProduct = this.cart.find(item => item.pid === product.pid);
        if (existingProduct) {
          existingProduct.quantity++;
        } else {
          this.cart.push({ ...productDetails, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(this.cart));
      } catch (error) {
        console.error("Failed to add to cart:", error);
      }
    },

    // 删除商品
    removeFromCart(productId) {
      this.cart = this.cart.filter(item => item.pid !== productId);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },

    // 更新数量
    updateQuantity(productId, quantity) {
      const item = this.cart.find(item => item.pid === productId);
      if (item && quantity >= 1) {
        item.quantity = Number(quantity);
        localStorage.setItem('cart', JSON.stringify(this.cart));
      }
    },


    goToCategoryPage(cname) {
      this.selectedCategory = cname;
      this.$router.push({
        path: `/category/${cname}`,
        query: { cid: this.categories.find(item => item.name === cname).catid }
      });
    },
    filterByCategory(category) {
      this.selectedCategory = category.name;
      this.$router.push({
        path: `/category/${category.name}`,
        query: { cid: category.catid }
      });
    },
    async fetchCategories() {
      const response = await axios.get('http://localhost:8000/api/categories');
      this.categories = response.data;
      this.selectedCategory = this.categories.find(item => item.catid === this.product.catid)?.name;
    },
    async fetchProduct() {
      const response = await axios.get(`http://localhost:8000/api/one_product/${this.pid}`);
      this.product = response.data;
    }
  },
  created() {
    this.pid = this.$route.params.id;
    this.fetchProduct();
    this.fetchCategories();
  }
};
</script>



<style scoped>
.product-page {
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

.product-details {
  display: flex;
  gap: 30px;
  padding: 20px;
}

.product-image img {
  width: 400px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-info {
  max-width: 600px;
}

.product-info h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.product-info p {
  font-size: 18px;
  margin-bottom: 10px;
}

.product-price {
  font-size: 20px;
  color: green;
  margin-bottom: 20px;
}

.add-to-cart-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

.add-to-cart-btn:hover {
  background-color: #0056b3;
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
