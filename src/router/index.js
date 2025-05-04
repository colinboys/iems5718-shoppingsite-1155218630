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
    path: '/login',  // 新增登录页路由
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/product/:id',
    name: 'Product',
    component: Product,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/category/:category', 
    component: Home, 
    name: 'category' 
  },
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
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: () => import('../views/ChangePassword.vue')
  },
  {
    path: '/payment-complete',
    name: 'PaymentComplete',
    component: () => import('../views/PaymentComplete.vue'),
    // 添加 props 来接收查询参数
    props: route => ({ token: route.query.token, PayerID: route.query.PayerID })
  },
  {
    path: '/payment-cancel',
    name: 'PaymentCancel',
    redirect: '/'  // 支付取消直接返回首页
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/Orders.vue'),
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue')
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPasswordConfirm',
    component: () => import('../views/ResetPassword.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 添加全局路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth_token') // 假设令牌存储在localStorage
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') // 未登录时跳转到登录页
  } else {
    next()
  }
})
export default router
// curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -