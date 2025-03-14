import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import ElementUI from 'element-plus';

createApp(App).use(ElementUI).use(store).use(router).mount('#app')





