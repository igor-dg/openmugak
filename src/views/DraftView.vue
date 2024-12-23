# views/DraftView.vue
<template>
  <div class="draft-view px-4 sm:px-8 py-4 sm:py-8">
    <div class="draft-container">
      <!-- Loading state -->
      <div v-if="loading" class="loading-state">
        <p>Cargando borrador...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <router-link to="/drafts" class="secondary-button">
          Volver a la lista
        </router-link>
      </div>

      <!-- Draft content -->
      <div v-else class="draft-content">
        <div class="draft-meta">
          <router-link to="/drafts" class="back-link">
            ← Volver a la lista
          </router-link>
          <div class="draft-info">
            <p>Código de recuperación: <span class="code">{{ draftCode }}</span></p>
            <p>Última modificación: {{ formatDate(draft?.timestamp) }}</p>
          </div>
        </div>

        <!-- Información Básica -->
        <div class="basic-info prose">
          <h2>Información Básica</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Título del Proyecto:</strong> 
              <p>{{ draft?.basicInfo?.title || '-' }}</p>
            </div>
            <div>
              <strong>Localización:</strong>
              <p>{{ draft?.basicInfo?.location || '-' }}</p>
            </div>
            <div>
              <strong>Fechas Propuestas:</strong>
              <p>{{ draft?.basicInfo?.dates || '-' }}</p>
            </div>
            <div>
              <strong>Presupuesto Total:</strong>
              <p>{{ draft?.basicInfo?.budget ? `${draft.basicInfo.budget}€` : '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Secciones -->
        <div v-for="(section, index) in sections" :key="index" class="section prose">
          <h3>{{ section.title }}</h3>
          <div v-html="draft?.sections[index]"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const draftCode = route.params.code
const draft = ref(null)
const loading = ref(true)
const error = ref(null)

const loadDraft = async () => {
  loading.value = true
  error.value = null

  try {
    const timestamp = new Date().getTime()
    const response = await fetch(
      `https://idg.eus/mugak/opensite/api/get_draft.php?code=${draftCode}&t=${timestamp}`,
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Error al cargar el borrador')
    }

    const data = await response.json()
    if (data.success && data.draft) {
      draft.value = data.draft
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
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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
  loadDraft()
})
</script>

<style scoped>
.draft-view {
  width: 100%;
  min-height: 100vh;
  padding: 1rem;
}

.draft-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  padding: 1rem;
}

@media (min-width: 640px) {
  .draft-container {
    padding: 2rem;
  }
}

.basic-info {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  max-width: 100%;
}

.section {
  background: #f8f9fa;
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
.draft-view {
  margin: 0 auto;
  padding: 2rem;
  color: #000;
  text-align: left;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 2rem 0;
}

.draft-meta {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.back-link {
  color: #6c757d;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 1rem;
}

.back-link:hover {
  color: #5a6268;
}

.draft-info {
  color: #6c757d;
  font-size: 0.9rem;
}

.code {
  font-family: monospace;
  background: #f8f9fa;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.content-wrapper {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.content-wrapper :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
}

.content-wrapper :deep(h1) {
  margin-top: 0;
}

.secondary-button {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.2s;
  display: inline-block;
}

.secondary-button:hover {
  background: #5a6268;
}
</style>