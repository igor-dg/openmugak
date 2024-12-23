# views/FormDetail.vue
<template>
  <div class="form-detail-view px-4 sm:px-8 py-4 sm:py-8">
    <div class="detail-container">
      <!-- Loading state -->
      <div v-if="loading" class="loading-state">
        <p>Cargando memoria...</p>
      </div>
  
      <!-- Error state -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <div class="error-actions">
          <button @click="loadForm" class="secondary-button">
            Reintentar
          </button>
          <router-link to="/submitted" class="secondary-button">
            Volver al listado
          </router-link>
        </div>
      </div>
  
      <!-- Form content -->
    <div v-else-if="form" class="form-content">
      <div class="form-header">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4">
          <router-link to="/submitted" class="back-link">
            ← Volver al listado
          </router-link>
          <div class="form-meta">
            <p>Presentada el {{ formatDate(form.submittedAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Información Básica -->
      <div class="basic-info prose">
        <h2>Información Básica</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Título del Proyecto:</strong> 
            <p>{{ form?.basicInfo?.title }}</p>
          </div>
          <div>
            <strong>Localización:</strong>
            <p>{{ form?.basicInfo?.location }}</p>
          </div>
          <div>
            <strong>Fechas Propuestas:</strong>
            <p>{{ form?.basicInfo?.dates }}</p>
          </div>
          <div>
            <strong>Presupuesto Total:</strong>
            <p>{{ form?.basicInfo?.budget }}€</p>
          </div>
        </div>
      </div>

      <!-- Secciones -->
      <div v-for="(section, index) in sections" :key="index" class="section prose">
        <h3>{{ section.title }}</h3>
        <p class="text-gray-600">{{ section.description }}</p>
        <div v-html="form?.sections[index]"></div>
      </div>

      <div class="form-actions">
        <button @click="downloadPDF" class="secondary-button w-full sm:w-auto">
          Descargar PDF
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const formId = route.params.id

const form = ref(null)
const loading = ref(true)
const error = ref(null)

const loadForm = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch(`https://idg.eus/mugak/opensite/api/get_form.php?id=${formId}`)
    if (!response.ok) {
      throw new Error('Error al cargar la memoria')
    }
    
    const data = await response.json()
    if (data.success) {
      form.value = data.form
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

const downloadPDF = () => {
  // Implementar la descarga de PDF
  alert('Funcionalidad de PDF pendiente de implementar')
}

const sections = [
  {
    title: 'Descripción del Proyecto',
    description: 'Describe los objetivos y aspectos principales del proyecto'
  },
  {
    title: 'Metodología y Plan de Trabajo',
    description: 'Detalla cómo se llevará a cabo el proyecto'
  },
  {
        title: 'Vinculación con "Castillos en el aire"',
        description: 'Explica la relación con el tema de la bienal'
      },
      {
        title: 'Innovación y Originalidad',
        description: 'Destaca los aspectos innovadores de la propuesta'
      },
      {
        title: 'Público Objetivo y Alcance',
        description: 'Define el público y el impacto esperado'
      },
      {
        title: 'Hibridación con otras disciplinas',
        description: 'Describe la integración con otros campos'
      },
      {
        title: 'Plan de Difusión',
        description: 'Estrategia de comunicación y difusión'
      },
      {
        title: 'Viabilidad y Cronograma',
        description: 'Planificación temporal y recursos necesarios'
      },
      {
        title: 'Presupuesto Detallado',
        description: 'Desglose del presupuesto por partidas'
      },
      {
        title: 'Equipo y Colaboradores',
        description: 'Describe el equipo y entidades colaboradoras'
      }
]

onMounted(() => {
  loadForm()
})
</script>

<style scoped>
.form-detail-view {
  width: 100%;
  min-height: 100vh;
  padding: 1rem;
}

.detail-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  padding: 1rem;
}

@media (min-width: 640px) {
  .detail-container {
    padding: 2rem;
  }
}

.form-detail {
  width: 100%;
  color: black;
}

.basic-info {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
    max-width: 100%;
}

.section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
    max-width: 100%;
}

.section h3 {
  margin-top: 0;
  color: #2c3e50;
}

.form-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: black;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 2rem 0;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.back-link {
  color: #6c757d;
  text-decoration: none;
  transition: color 0.2s;
}

.back-link:hover {
  color: #5a6268;
}

.form-meta {
  color: #6c757d;
  font-size: 0.9rem;
}

.form-body {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
}

.secondary-button {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}

.secondary-button:hover {
  background: #5a6268;
}

:deep(.prose img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 4px;
}

:deep(.prose h1) {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1rem;
}

:deep(.prose h2) {
  color: #2c3e50;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

:deep(.prose h3) {
  color: #2c3e50;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

:deep(.prose p) {
  margin: 1rem 0;
  line-height: 1.7;
}

:deep(.prose ul),
:deep(.prose ol) {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

:deep(.prose li) {
  margin: 0.5rem 0;
}

:deep(.prose blockquote) {
  margin: 1.5rem 0;
  padding-left: 1rem;
  border-left: 4px solid #e9ecef;
  color: #6c757d;
}

:deep(.prose code) {
  background: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}

:deep(.prose pre) {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

:deep(.prose pre code) {
  background: none;
  padding: 0;
}

:deep(.prose table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

:deep(.prose th),
:deep(.prose td) {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  text-align: left;
}

:deep(.prose th) {
  background: #f8f9fa;
}

:deep(.prose a) {
  color: #42b983;
  text-decoration: none;
  transition: color 0.2s;
}

:deep(.prose a:hover) {
  color: #3aa876;
  text-decoration: underline;
}

:deep(.prose hr) {
  margin: 2rem 0;
  border: 0;
  border-top: 1px solid #dee2e6;
}
</style>