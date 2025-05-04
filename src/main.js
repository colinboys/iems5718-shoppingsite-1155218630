import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Import the store

import ElementUI from 'element-plus';

createApp(App)
  .use(ElementUI)
  .use(router)
  .use(store) // Use the store
  .mount('#app');





