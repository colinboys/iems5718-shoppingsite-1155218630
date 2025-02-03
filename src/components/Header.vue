<template>
    <header>
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/category1">Category 1</router-link></li>
          <li><router-link to="/category2">Category 2</router-link></li>
        </ul>
      </nav>
    </header>
  </template>
  
  <script>
  export default {
    name: "Header",
  };
  </script>
  
  <style scoped>
  header {
    background-color: #333;
    color: white;
    padding: 10px 0;
    text-align: center;
  }
  nav ul {
    list-style-type: none;
    padding: 0;
  }
  nav ul li {
    display: inline;
    margin: 0 10px;
  }
  nav ul li a {
    color: white;
    text-decoration: none;
  }
  </style>