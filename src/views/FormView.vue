<template>
  <div class="form-view px-4 sm:px-8 py-4 sm:py-8">
    <div class="form-container">
      <div class="form-header space-y-4 sm:space-y-6 mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">
          Memoria de Actividad
        </h1>
        <p class="instructions text-sm sm:text-base text-gray-600 max-w-2xl mx-auto text-center px-4">
          Por favor, complete los detalles de su propuesta. Puede guardar su progreso
          en cualquier momento y volver más tarde usando el código proporcionado.
        </p>
      </div>

      <FormEditor 
        :initialCode="recoveryCode"
        @saved="handleSaved"
        @submitted="handleSubmitted"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormEditor from '../components/FormEditor.vue'

const route = useRoute()
const router = useRouter()
const recoveryCode = route.query.code

const handleSaved = () => {
  // Puedes agregar notificaciones o feedback adicional aquí
}

const handleSubmitted = () => {
  // Redirigir a una página de confirmación o mostrar un mensaje
  router.push('/')
}

onMounted(() => {
  if (recoveryCode) {
    // Si hay un código en la URL, el FormEditor lo utilizará
    // para recuperar el contenido guardado
  }
})
</script>

<style scoped>
.form-view {
  width: 100%;
  min-height: 100vh;
  padding: 1rem;
}

.form-container {
  width: 100%;
  max-width: 1800px; /* Aumentamos el max-width */
  margin: 0 auto;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  padding: 1rem;
}

@media (min-width: 640px) {
  .form-container {
    padding: 2rem;
  }
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.instructions {
  color: #6c757d;
  max-width: 600px;
  margin: 1rem auto;
}
</style>