# FormEditor.vue
<template>
  <div class="editor-wrapper">
    <!-- Información Básica -->
    <div class="basic-info">
      <h2 class="form-label">Información Básica</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="form-label">Título del Proyecto</label>
          <input 
            v-model="basicInfo.title" 
            type="text"
            class="form-input"
            placeholder="Título de tu proyecto"
          >
        </div>
        <div>
          <label class="form-label">Localización</label>
          <select 
            v-model="basicInfo.location"
            class="form-select"
          >
            <option value="">Selecciona una ciudad</option>
            <option value="bilbao">Bilbao</option>
            <option value="donostia">Donostia-San Sebastián</option>
            <option value="vitoria">Vitoria-Gasteiz</option>
          </select>
        </div>
        <div>
          <label class="form-label">Fechas Propuestas</label>
          <input 
            v-model="basicInfo.dates" 
            type="text"
            class="form-input"
            placeholder="Periodo propuesto"
          >
        </div>
        <div>
          <label class="form-label">Presupuesto Total</label>
          <input 
            v-model="basicInfo.budget" 
            type="number"
            class="form-input"
            placeholder="Máximo 15.000€"
            max="15000"
          >
        </div>
      </div>
    </div>

    <!-- Secciones del Editor -->
    <div v-for="(section, index) in sections" :key="index" class="section-container">
      <div class="section-header">
        <div>
          <h3 class="section-title">{{ section.title }}</h3>
          <p class="section-description">{{ section.description }}</p>
        </div>
        <div class="text-right">
          <span 
            class="character-counter"
            :class="{ 'over-limit': isOverLimit(index) }"
          >
            {{ characterCount(index) }}/{{ section.limit }}
          </span>
          <div class="progress-container">
            <div 
              class="progress-bar"
              :class="{ 'within-limit': !isOverLimit(index), 'over-limit': isOverLimit(index) }"
              :style="{ width: progressWidth(index) }"
            ></div>
          </div>
        </div>
      </div>

      <div class="editor-content">
        <!-- Barra de herramientas para cada editor -->
        <div class="editor-toolbar">
          <button 
            v-for="(tool, i) in toolbarItems" 
            :key="i"
            @click="tool.action(index)"
            :class="{ 'is-active': tool.isActive ? tool.isActive(index) : false }"
            class="toolbar-button"
          >
            {{ tool.label }}
          </button>
        </div>
        <editor-content :editor="editors[index]" />
      </div>
    </div>

    <!-- Controles principales -->
    <div class="flex gap-4 mt-8">
      <button @click="saveProgress" class="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
        Guardar Borrador
      </button>
      <button 
        @click="submitForm" 
        class="submit-button"
        :disabled="hasOverflowingSections"
      >
        Enviar Propuesta
      </button>
    </div>

    <!-- Modal código recuperación -->
    <div v-if="showRecoveryCode" class="modal">
      <div class="modal-content">
        <h3 class="text-xl font-bold mb-4">Tu código de recuperación</h3>
        <p class="text-lg text-black mb-2">{{ recoveryCode }}</p>
        <p class="text-sm text-gray-600 mb-4">
          Guarda este código para recuperar tu progreso más tarde
        </p>
        <button @click="closeModal" class="primary-button">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

export default {
  components: {
    EditorContent,
  },

  props: {
    initialCode: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const sections = [
      {
        title: 'Descripción del Proyecto',
        description: 'Describe los objetivos y aspectos principales del proyecto',
        limit: 3000
      },
      {
        title: 'Metodología y Plan de Trabajo',
        description: 'Detalla cómo se llevará a cabo el proyecto',
        limit: 2000
      },
      {
        title: 'Vinculación con "Castillos en el aire"',
        description: 'Explica la relación con el tema de la bienal',
        limit: 1500
      },
      {
        title: 'Innovación y Originalidad',
        description: 'Destaca los aspectos innovadores de la propuesta',
        limit: 1500
      },
      {
        title: 'Público Objetivo y Alcance',
        description: 'Define el público y el impacto esperado',
        limit: 1500
      },
      {
        title: 'Hibridación con otras disciplinas',
        description: 'Describe la integración con otros campos',
        limit: 1500
      },
      {
        title: 'Plan de Difusión',
        description: 'Estrategia de comunicación y difusión',
        limit: 1500
      },
      {
        title: 'Viabilidad y Cronograma',
        description: 'Planificación temporal y recursos necesarios',
        limit: 1500
      },
      {
        title: 'Presupuesto Detallado',
        description: 'Desglose del presupuesto por partidas',
        limit: 1000
      },
      {
        title: 'Equipo y Colaboradores',
        description: 'Describe el equipo y entidades colaboradoras',
        limit: 1000
      }
    ]

    const basicInfo = ref({
      title: '',
      location: '',
      dates: '',
      budget: null
    })

    const editors = ref([])
    const showRecoveryCode = ref(false)
    const recoveryCode = ref(props.initialCode || '')

    const initializeEditor = (index, content = '') => {
      return new Editor({
        extensions: [
          StarterKit.configure({
            heading: {
              levels: [1, 2]
            }
          }),
          Image.configure({
            inline: true,
            allowBase64: true
          })
        ],
        content,
        editorProps: {
          attributes: {
            class: 'w-full text-base leading-relaxed focus:outline-none min-h-[100px]',
          },
        },
        onUpdate: ({ editor }) => {
          editors.value[index] = editor
        }
      })
    }

    const addImage = (index) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (event) => {
        const file = event.target.files?.[0]
        if (file && editors.value[index]) {
          const reader = new FileReader()
          reader.onload = (e) => {
            if (e.target && e.target.result && typeof e.target.result === 'string') {
              editors.value[index].chain()
                .focus()
                .setImage({ src: e.target.result })
                .run()
            }
          }
          reader.readAsDataURL(file)
        }
      }
      input.click()
    }

    const toolbarItems = [
      {
        label: 'Negrita',
        action: (index) => editors.value[index]?.chain().focus().toggleBold().run(),
        isActive: (index) => editors.value[index]?.isActive('bold')
      },
      {
        label: 'Cursiva',
        action: (index) => editors.value[index]?.chain().focus().toggleItalic().run(),
        isActive: (index) => editors.value[index]?.isActive('italic')
      },
      {
        label: 'Subtítulo',
        action: (index) => editors.value[index]?.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: (index) => editors.value[index]?.isActive('heading', { level: 2 })
      },
      {
        label: 'Lista',
        action: (index) => editors.value[index]?.chain().focus().toggleBulletList().run(),
        isActive: (index) => editors.value[index]?.isActive('bulletList')
      },
      {
        label: 'Imagen',
        action: addImage
      }
    ]

    onMounted(async () => {
      // Inicializar array de editores
      editors.value = new Array(sections.length)
      
      // Crear los editores
      sections.forEach((_, index) => {
        editors.value[index] = initializeEditor(index)
      })

      // Si hay código de recuperación, cargar el contenido guardado
      if (recoveryCode.value) {
        try {
          const timestamp = new Date().getTime()
          const response = await fetch(
            `https://idg.eus/mugak/opensite/api/get_draft.php?code=${recoveryCode.value}&t=${timestamp}`,
            {
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              }
            }
          )
          
          if (response.ok) {
            const data = await response.json()
            if (data.success && data.draft) {
              // Cargar información básica
              basicInfo.value = data.draft.basicInfo || basicInfo.value
              
              // Cargar contenido de las secciones
              data.draft.sections?.forEach((content, index) => {
                if (editors.value[index]) {
                  editors.value[index].commands.setContent(content)
                }
              })
            }
          }
        } catch (error) {
          console.error('Error al cargar el borrador:', error)
        }
      }
    })

    const characterCount = (index) => {
      const editor = editors.value[index]
      if (!editor) return 0
      
      // Obtener el texto sin formato
      const text = editor.getText()
      // Contar caracteres excluyendo espacios en blanco al inicio y final
      return text.trim().length
    }

    const isOverLimit = (index) => {
      return characterCount(index) > sections[index].limit
    }

    const progressWidth = (index) => {
      const percentage = (characterCount(index) / sections[index].limit) * 100
      return `${Math.min(percentage, 100)}%`
    }

    const hasOverflowingSections = computed(() => {
      return editors.value.some((_, index) => isOverLimit(index))
    })

    const saveProgress = async () => {
      try {
        if (!recoveryCode.value) {
          recoveryCode.value = Math.random().toString(36).substring(2, 15) +
                              Math.random().toString(36).substring(2, 15)
        }

        const content = {
          basicInfo: basicInfo.value,
          sections: editors.value.map(editor => editor.getHTML()),
          recoveryCode: recoveryCode.value,
          timestamp: new Date().toISOString()
        }

        const response = await fetch('https://idg.eus/mugak/opensite/api/save_draft.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify(content)
        })

        const result = await response.json()
        
        if (result.success) {
          showRecoveryCode.value = true
          console.log('Borrador guardado con éxito')
        } else {
          throw new Error(result.error || 'Error al guardar')
        }
      } catch (error) {
        console.error('Error al guardar:', error)
        alert('Error al guardar el borrador: ' + error.message)
      }
    }

    const submitForm = async () => {
      if (hasOverflowingSections.value) {
        alert('Por favor, ajusta el contenido a los límites establecidos')
        return
      }

      try {
        const formData = {
          basicInfo: basicInfo.value,
          sections: editors.value.map(editor => editor.getHTML()),
          submittedAt: new Date().toISOString()
        }

        const response = await fetch('https://idg.eus/mugak/opensite/api/save.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }

        const result = await response.json()
        
        if (result.success) {
          if (recoveryCode.value) {
            // Eliminar el borrador después de enviar
            await fetch(`https://idg.eus/mugak/opensite/api/delete_draft.php?code=${recoveryCode.value}`, {
              method: 'DELETE'
            })
          }
          alert('Propuesta enviada correctamente')
          // Redirigir o mostrar confirmación
        }
      } catch (error) {
        console.error('Error al enviar:', error)
        alert('Error al enviar la propuesta: ' + error.message)
      }
    }

    const closeModal = () => {
      showRecoveryCode.value = false
    }

    onBeforeUnmount(() => {
      editors.value.forEach(editor => editor?.destroy())
    })

    return {
      sections,
      basicInfo,
      editors,
      showRecoveryCode,
      recoveryCode,
      characterCount,
      isOverLimit,
      progressWidth,
      hasOverflowingSections,
      saveProgress,
      submitForm,
      closeModal,
      addImage,
      toolbarItems
    }
  }
}
</script>

<style>
.editor-wrapper {
  width: 100%;
  margin: 0 auto;
}

.basic-info {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section-container {
  margin-bottom: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  overflow: hidden;
}

.section-header {
  padding: 1rem;
  border-bottom: 1px solid rgb(229 231 235);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(17 24 39);
}

.section-description {
  font-size: 0.875rem;
  color: rgb(107 114 128);
  margin-top: 0.25rem;
}

.character-counter {
  font-size: 0.875rem;
  color: rgb(75 85 99);
}

.character-counter.over-limit {
  color: rgb(239 68 68);
}

.progress-container {
  width: 8rem;
  height: 0.5rem;
  background-color: rgb(229 231 235);
  border-radius: 9999px;
  margin-top: 0.25rem;
}

.progress-bar {
  height: 100%;
  border-radius: 9999px;
  transition: all 300ms;
}

.progress-bar.within-limit {
  background-color: rgb(34 197 94);
}

.progress-bar.over-limit {
  background-color: rgb(239 68 68);
}

.editor-content {
  padding: 1.5rem;
}

.editor-content :deep(.ProseMirror) {
  min-height: 120px;
  width: 100%;
  font-size: 1rem;
  line-height: 1.625;
  text-align: left;
}

.editor-content :deep(.ProseMirror p) {
  margin: 1rem 0;
  color: rgb(31 41 55);
}

.editor-content :deep(.ProseMirror h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1rem 0;
  color: rgb(17 24 39);
}

.editor-content :deep(.ProseMirror h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.75rem 0;
  color: rgb(17 24 39);
}

.editor-content :deep(.ProseMirror ul) {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin: 1rem 0;
}

.editor-content :deep(.ProseMirror ol) {
  list-style-type: decimal;
  padding-left: 1.25rem;
  margin: 1rem 0;
}

.editor-content :deep(.ProseMirror li) {
  margin: 0.5rem 0;
}

.editor-content :deep(.ProseMirror:focus) {
  outline: none;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgb(209 213 219);
  border-radius: 0.375rem;
}

.form-input:focus {
  outline: none;
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.form-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgb(209 213 219);
  border-radius: 0.375rem;
}

.form-select:focus {
  outline: none;
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(55 65 81);
  margin-bottom: 0.25rem;
}

.primary-button {
  padding: 0.5rem 1rem;
  background-color: rgb(37 99 235);
  color: white;
  border-radius: 0.375rem;
  transition: background-color 200ms;
}

.primary-button:hover {
  background-color: rgb(29 78 216);
}

.primary-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgb(37 99 235 / 0.2);
}

.submit-button {
  padding: 0.5rem 1rem;
  background-color: rgb(22 163 74);
  color: white;
  border-radius: 0.375rem;
  transition: background-color 200ms;
}

.submit-button:hover {
  background-color: rgb(21 128 61);
}

.submit-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgb(22 163 74 / 0.2);
}

.submit-button:disabled {
  background-color: rgb(156 163 175);
  cursor: not-allowed;
}

.modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  max-width: 28rem;
  width: 100%;
  margin: 0 1rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

.editor-toolbar {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  margin-bottom: 1rem;
}

.toolbar-button {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #374151;
  margin: 0;
}

.toolbar-button:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.toolbar-button.is-active {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.editor-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
}

@media (min-width: 768px) {
  .editor-wrapper {
    width: 100%;
    max-width: 100%;
  }
}
</style>