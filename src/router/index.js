import { createRouter, createWebHashHistory } from 'vue-router'
// import Home from '../views/Home.vue'
import Home from '../components/ProductList.vue'
import Product from '../components/ProductDetail.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: Product
  },
  { path: '/category/:category', component: Home, name: 'category' },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import( '../views/Admin.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
// curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -