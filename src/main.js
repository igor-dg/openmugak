// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import './style.css';

const app = createApp(App)
app.use(router)  // Aquí es donde conectas el router con la aplicación
app.mount('#app')