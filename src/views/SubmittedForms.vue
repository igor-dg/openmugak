# views/SubmittedForms.vue
<template>
  <div class="submitted-forms">
    <div class="header">
        <h1 class="text-xl font-bold sm:text-2xl lg:text-3xl">Memorias Presentadas</h1>
        <p class="subtitle text-sm sm:text-base">Listado de todas las memorias enviadas</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <p>Cargando memorias...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadForms" class="secondary-button">
        Reintentar
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="forms.length === 0" class="empty-state">
      <p>No hay memorias presentadas todavía.</p>
      <router-link to="/form" class="primary-button">
        Presentar una memoria
      </router-link>
    </div>

    <!-- Forms list -->
    <div class="forms-list">
        <div v-for="form in forms" :key="form.id" class="form-card flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
            <div class="form-content flex-1">
  <h2 class="text-lg sm:text-xl font-semibold text-gray-900">
    {{ form.basicInfo?.title || 'Sin título' }}
  </h2>
  <p class="mt-2 text-sm text-gray-600">{{ getPreviewText(form) }}</p>
  <div class="mt-2 text-sm text-gray-500">
    <span class="block">
      {{ form.basicInfo?.location }} | Presupuesto: {{ formatBudget(form.basicInfo?.budget) }}
    </span>
    <span class="block">
      Presentada el {{ formatDate(form.submittedAt) }}
    </span>
  </div>
</div>
    <div class="form-actions w-full sm:w-auto">
      <button 
        @click="viewForm(form.id)" 
        class="w-full sm:w-auto px-4 py-2 bg-black text-white rounded hover:bg-primary-dark transition-colors"
      >
        Ver Memoria
      </button>
    </div>
  </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const forms = ref([])
const loading = ref(true)
const error = ref(null)

const loadForms = async () => {
  loading.value = true
  error.value = null
  
  try {
    const timestamp = new Date().getTime()
    const response = await fetch(`https://idg.eus/mugak/opensite/api/get_forms.php?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
    if (!response.ok) {
      throw new Error('Error al cargar las memorias')
    }
    
    const data = await response.json()
    if (data.success) {
      forms.value = data.forms
    } else {
      throw new Error(data.error || 'Error desconocido')
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPreviewText = (form) => {
  if (!form.sections || form.sections.length === 0) return 'Sin contenido';
  // Tomamos la primera sección (Descripción del Proyecto) para el preview
  const description = form.sections[0];
  // Eliminamos las etiquetas HTML y limitamos el texto
  const plainText = description.replace(/<[^>]*>/g, '');
  return plainText.length > 150 ? plainText.slice(0, 150) + '...' : plainText;
}

const formatBudget = (budget) => {
  if (!budget) return 'No especificado';
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(budget);
}

const viewForm = (formId) => {
  router.push(`/form/${formId}`)
}

onMounted(() => {
  loadForms()
})
</script>

<style scoped>
.submitted-forms {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.subtitle {
  color: #6c757d;
  margin-top: 0.5rem;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 2rem 0;
}

.forms-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.form-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.form-content {
  flex: 1;
}

.form-title {
  margin: 0 0 0.5rem;
  color: #2c3e50;
  font-size: 1.25rem;
}

.form-preview {
  color: #6c757d;
  margin: 0.5rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.form-meta {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
}

.primary-button {
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.primary-button:hover {
  background: #3aa876;
}

.secondary-button {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.secondary-button:hover {
  background: #5a6268;
}
</style>