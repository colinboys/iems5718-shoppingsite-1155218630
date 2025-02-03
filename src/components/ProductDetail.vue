<template>
  <div class="product-page">
    <div class="sidebar">
      <!-- Left side: Category filter list -->
      <div class="category-card">
        <h3>Categories</h3>
        <ul class="category-list">
          <li v-for="(category, index) in categories" :key="index" @click="filterByCategory(category)">
            {{ category }}
          </li>
        </ul>
      </div>
    </div>

    <div class="content">
      <header>
        <nav class="level-menu">
          <ul>
            <li><a href="#">Home</a></li>
            <li v-if="selectedCategory">
              <a href="#" @click="goToCategoryPage(selectedCategory)">{{ selectedCategory }}</a>
            </li>
            <li>{{ product.name }}</li>
          </ul>
        </nav>
      </header>

      <!-- Product Details Section -->
      <section class="product-details">
        <div class="product-image">
          <img :src="product.image" alt="Product Image" />
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
          <li v-for="item in cart" :key="item.id">
            {{ item.name }} [{{ item.quantity }}] @ ${{ item.price * item.quantity }}
          </li>
        </ul>
        <button>Checkout</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: ['Furniture', 'Category2', 'Category3'],
      selectedCategory: null, // Category selected from the list
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      hoverCart: false,
      product: {
        id: 1,
        name: 'Prod1',
        description: 'Detailed description of Prod1',
        price: 3.3,
        category: 'Furniture',
        image: 'prod1-fullsize.jpg',
      },
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    },
  },
  methods: {
    addToCart(product) {
      let cart = this.cart;
      const existingProduct = cart.find(item => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      this.cart = [...cart]; // Make a new reference to trigger reactivity
      localStorage.setItem('cart', JSON.stringify(cart)); // Sync with localStorage
    },
    goToCategoryPage(category) {
      this.$router.push(`/category/${category}`);
    },
    filterByCategory(category) {
      this.selectedCategory = category;
      this.$router.push(`/category/${category}`); // Change route to display products for selected category
    },
  },
  created() {
    // Mock product data
    const productId = this.$route.params.id;
    const products = [

      { id: 1, name: 'Prod1', description: 'Detailed description of Prod1', price: 3.3, category: 'Furniture', image: require('../assets/images/sofa1.png' )},
      { id: 2, name: 'Prod2', description: 'Detailed description of Prod2', price: 1.0, category: 'Furniture', image: require('../assets/images/sofa2.png' )},
      { id: 3, name: 'Prod3', description: 'Detailed description of Prod3', price: 0.5, category: 'Furniture', image: require('../assets/images/sofa3.png' ) },
      { id: 4, name: 'Prod4', description: 'Detailed description of Prod4', price: 5.0, category: 'Category2', image: require('../assets/images/yd.jpg' ) },
      { id: 5, name: 'Prod5', description: 'Detailed description of Prod5', price: 2.5, category: 'Category3', image: require('../assets/images/student.jpg' ) },
      { id: 6, name: 'Prod6', description: 'Detailed description of Prod6', price: 4.0, category: 'Category3', image: require('../assets/images/teacher.jpg' )},
    ];
    this.product = products.find(p => p.id === parseInt(productId));
    this.selectedCategory = this.product.category; // Set the category of the selected product
  },
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
