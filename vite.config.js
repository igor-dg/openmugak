import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/mugak/opensite/', // Asegúrate de que coincida con tu subcarpeta
});
