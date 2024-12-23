// App.vue
<template>
  <div class="app">
    <header v-if="!isHome" class="header">
      <nav>
        <router-link to="/" class="logo">Volver al inicio</router-link>
      </nav>
    </header>

    <main class="main">
      <router-view></router-view>
    </main>

    <footer class="footer">
      <p>&copy; 2024 bienalmugak</p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden; /* Previene scroll horizontal no deseado */
}

.header {
  width: 100%;
  padding: 1rem;
  background-color: #00d702;
  border-bottom: 1px solid #e9ecef;
}

.logo {
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.main {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.footer {
  padding: 1rem;
  background-color: #00d702;
  border-top: 1px solid #e9ecef;
  text-align: center;
  color: white;
}
</style>