<template>
  <div id="nav">
    <template v-if = "!isAdmin">
      <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    </template>
    
    <template v-if="isLoggedIn">
      <router-link v-if="isAdmin" to="/admin">Admin Panel  | </router-link>
      <!-- <router-link to="/change-password">Change Password</router-link> | -->
      <router-link v-if="!isAdmin" to="/orders">Orders | </router-link>
      <a href="#" @click.prevent="handleLogout">Logout</a>
    </template>
    <template v-else>
      <router-link to="/login">Login</router-link>
    </template>
  </div>
  <span>Welcome, {{ username || 'Guest' }}!</span>
  <div id="app">
    <router-view/>
    <Footer />
  </div>
</template>

<script>
import Footer from "./components/Footer.vue";
import { mapGetters, mapActions } from 'vuex';
import { useStore } from 'vuex';
import { onMounted } from 'vue';
import request from '@/utils/request';

export default {
  name: "App",
  components: { Footer },
  computed: {
    ...mapGetters(['isLoggedIn', 'username', 'isAdmin'])
  },
  methods: {
    ...mapActions(['logout']),
    async handleLogout() {
      try {
        await request.post('/api/logout');
        localStorage.removeItem('auth_token');
        this.logout();
        this.$router.push('/');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  },
  setup() {
    const store = useStore();

    onMounted(() => {
      // 从 localStorage 恢复登录状态
      const username = localStorage.getItem('username');
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      const token = localStorage.getItem('auth_token');
      
      if (token && username) {
        store.dispatch('login', {
          username,
          isAdmin
        });
      }
    });
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
