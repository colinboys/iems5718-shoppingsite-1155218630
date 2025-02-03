<template>
    <div class="shopping-cart">
      <h2>Shopping Cart</h2>
      <ul>
        <li v-for="item in cart" :key="item.id">
          <img :src="item.thumbnail" alt="" class="thumbnail" />
          <span>{{ item.name }}</span>
          <input type="number" v-model="item.quantity" min="1" />
          <span>${{ item.price * item.quantity }}</span>
        </li>
      </ul>
      <button @click="checkout">Checkout</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "ShoppingCart",
    props: ["cart"],
    methods: {
      checkout() {
        alert("Checkout successful!");
      },
    },
  };
  </script>
  
  <style scoped>
  .shopping-cart {
    padding: 20px;
  }
  .thumbnail {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  button {
    background-color: #333;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
  }
  button:hover {
    background-color: #555;
  }
  </style>