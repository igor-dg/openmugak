# views/DraftsList.vue
<template>
  <div class="drafts-list">
    <div class="header">
        <h1 class="text-xl font-bold sm:text-2xl lg:text-3xl">Borradores Guardados</h1>
      <p class="subtitle text-sm sm:text-base">Listado de todos los borradores en progreso de los participantes</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <p>Cargando borradores...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadDrafts" class="secondary-button">
        Reintentar
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="drafts.length === 0" class="empty-state">
      <p>No hay borradores guardados por los participantes.</p>
    </div>

    <!-- Drafts list -->
    <div v-else class="drafts-list">
        <div v-for="draft in drafts" :key="draft.recoveryCode" class="draft-card flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
            <div class="draft-content flex-1">
  <h2 class="text-lg sm:text-xl font-semibold text-gray-900">
    {{ draft.basicInfo?.title || 'Borrador sin título' }}
  </h2>
  <p class="mt-2 text-sm text-gray-600">{{ getPreviewText(draft) }}</p>
  <div class="mt-2 text-sm text-gray-500">
    <span class="draft-date block">
      {{ draft.basicInfo?.location }} | Presupuesto: {{ formatBudget(draft.basicInfo?.budget) }}
    </span>
    <span class="draft-date block">
      Última modificación: {{ formatDate(draft.lastSaved || draft.timestamp) }}
    </span>
    <span class="draft-code block mt-1">
      Código de recuperación: {{ draft.recoveryCode }}
    </span>
  </div>
</div>
        <div class="draft-actions">
          <button 
            @click="viewDraft(draft.recoveryCode)" 
            class="primary-button"
          >
            Ver Borrador
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
const drafts = ref([])
const loading = ref(true)
const error = ref(null)

const loadDrafts = async () => {
  loading.value = true
  error.value = null
  
  try {
    const timestamp = new Date().getTime()
    const response = await fetch(`https://idg.eus/mugak/opensite/api/get_drafts_list.php?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
    if (!response.ok) {
      throw new Error('Error al cargar los borradores')
    }
    
    const data = await response.json()
    if (data.success) {
      drafts.value = data.drafts
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

const viewDraft = (recoveryCode) => {
  router.push(`/draft/${recoveryCode}`)
}

onMounted(() => {
  loadDrafts()
})
</script>

<style scoped>
.drafts-list {
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

.draft-card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 1rem;
}

.draft-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.draft-content {
  flex: 1;
}

.draft-title {
  margin: 0 0 0.5rem;
  color: #2c3e50;
  font-size: 1.25rem;
}

.draft-preview {
  color: #6c757d;
  margin: 0.5rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.draft-meta {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 0.5rem;
  display: flex;
  gap: 1.5rem;
}

.draft-code {
  font-family: monospace;
  background: #f8f9fa;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.draft-actions {
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