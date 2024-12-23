# views/Home.vue
<template>
  <div class="flex justify-center items-center min-h-[calc(100vh-300px)]">
    <div class="max-w-xl text-center p-0">
      <h1 class="mb-4 text-white">Convocatoria de Actividades</h1>
      <p>Bienvenido/a al formulario de presentación de memorias para las actividades de mugak/</p>
      
      <div class="mt-8">
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
  <router-link to="/form" class="w-full sm:w-auto flex justify-center">
    <button class="w-64 min-h-[5rem] px-8 py-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-bold transition-colors duration-300 flex items-center justify-center text-center">
      Presentar Nueva Memoria
    </button>
  </router-link>
  <router-link to="/submitted" class="w-full sm:w-auto flex justify-center">
    <button class="w-64 min-h-[5rem] px-8 py-4 bg-black hover:bg-gray-800 text-white rounded font-bold transition-colors duration-300 flex items-center justify-center text-center">
      Ver Memorias Presentadas
    </button>
  </router-link>
  <router-link to="/drafts" class="w-full sm:w-auto flex justify-center">
    <button class="w-64 min-h-[5rem] px-8 py-4 bg-black hover:bg-gray-800 text-white rounded font-bold transition-colors duration-300 flex items-center justify-center text-center">
      Ver Borradores
    </button>
  </router-link>
</div>        
        <div class="mt-8 pt-8 border-t border-gray-200">
          <p class="font-bold">¿Tienes un código de recuperación?</p>
          <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
  <div class="w-full sm:w-auto flex justify-center">
    <input 
      v-model="recoveryCode" 
      placeholder="Introduce tu código" 
      class="w-64 px-4 py-2 border border-gray-300 bg-white rounded"
    >
  </div>
  <div class="w-full sm:w-auto flex justify-center">
    <button 
      @click="recoverForm" 
      class="w-64 sm:w-auto px-8 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed text-white no-underline rounded font-bold transition-colors duration-300"
      :disabled="!recoveryCode"
    >
      Recuperar
    </button>
  </div>  
</div>
<div class="text-sm my-4 text-gray-500 text-center">
    <p class="flex items-center justify-center gap-2">
      (código de prueba: 
      <code class="bg-gray-100 px-2 py-1 rounded">dbkmumnx98ocegcc1xxe8c</code>
      <button 
        @click="copyCode" 
        class="p-1 hover:bg-gray-200 rounded transition-colors"
        title="Copiar código"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </p>
  </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const recoveryCode = ref('')
const testCode = 'dbkmumnx98ocegcc1xxe8c'

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(testCode)
    alert('Código copiado al portapapeles')
  } catch (err) {
    console.error('Error al copiar:', err)
  }
}

const recoverForm = () => {
  if (recoveryCode.value) {
    router.push({
      path: '/form',
      query: { code: recoveryCode.value }
    })
  }
}
</script>