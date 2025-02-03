<template>
  <div class="main-page">
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
            <li><a href="#" @click="goToHome">Home</a></li>
            <li v-if="selectedCategory"><a href="#" @click="goToCategoryPage(selectedCategory)">{{ selectedCategory }}</a></li>
          </ul>
        </nav>
      </header>

      <!-- Main content: Products wrapped in a card -->
      <section class="product-list">
        <div v-for="product in filteredProducts" :key="product.id" class="product-item card">
          <img
            :src="product.thumbnail"
            alt="Product Thumbnail"
            @mouseover="hoverProduct(product.id)"
            @click="goToProductPage(product.id)"
          />
          <h3 @click="goToProductPage(product.id)" class="product-name">{{ product.name }}</h3>
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
      selectedCategory: this.$route.params.category || null, // Get category from URL parameter
      products: [
        { id: 1, name: 'Prod1', price: 3.3, category: 'Furniture', thumbnail: require('../assets/images/sofa1.png' )},
        { id: 2, name: 'Prod2', price: 1.0, category: 'Furniture', thumbnail: require('../assets/images/sofa2.png' )},
        { id: 3, name: 'Prod3', price: 0.5, category: 'Furniture', thumbnail: require('../assets/images/sofa3.png' ) },
        { id: 4, name: 'Prod4', price: 5.0, category: 'Category2', thumbnail: require('../assets/images/yd.jpg' ) },
        { id: 5, name: 'Prod5', price: 2.5, category: 'Category3', thumbnail: require('../assets/images/student.jpg' ) },
        { id: 6, name: 'Prod6', price: 4.0, category: 'Category3', thumbnail: require('../assets/images/teacher.jpg' )},
      ],
      cart: JSON.parse(localStorage.getItem('cart')) || [],
      hoverCart: false,
    };
  },
  computed: {
    filteredProducts() {
      if (this.selectedCategory) {
        return this.products.filter(product => product.category === this.selectedCategory);
      }
      return this.products; // If no category selected, show all products
    },
    totalPrice() {
      return this.cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    },
  },
  methods: {
    addToCart(product) {
      const cart = this.cart;
      const existingProduct = cart.find(item => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    },
    goToProductPage(productId) {
      this.$router.push(`/product/${productId}`);
    },
    goToHome() {
      this.selectedCategory = null; // reset selectedCategory
      this.$router.push('/'); // turn to home page
    },
    filterByCategory(category) {
      this.selectedCategory = category;
      this.$router.push(`/category/${category}`); // Change route to display products for selected category
    },
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
