# Formulario de Memorias para Mugak Bienal

## Descripción
Aplicación web desarrollada en Vue.js para la gestión y presentación de memorias de actividades para la Bienal Mugak. Permite a los participantes crear, guardar borradores y enviar propuestas de proyectos de manera estructurada.

## Características Principales

### 1. Gestión de Memorias
- Creación de nuevas memorias
- Guardado de borradores con código de recuperación
- Visualización de memorias enviadas
- Visualización de borradores en progreso

### 2. Formulario de Memoria
- Información básica del proyecto (título, localización, fechas, presupuesto)
- 10 secciones de contenido incluyendo:
  - Descripción del Proyecto
  - Metodología y Plan de Trabajo
  - Vinculación con "Castillos en el aire"
  - Innovación y Originalidad
  - Público Objetivo y Alcance
  - Hibridación con otras disciplinas
  - Plan de Difusión
  - Viabilidad y Cronograma
  - Presupuesto Detallado
  - Equipo y Colaboradores

### 3. Editor de Contenido
- Editor de texto enriquecido
- Soporte para imágenes
- Control de límites de caracteres por sección
- Barra de herramientas con opciones de formato

### 4. Sistema de Recuperación
- Generación de códigos de recuperación para borradores
- Capacidad de retomar el trabajo guardado
- Gestión de borradores en proceso

## Tecnologías Utilizadas
- Vue.js 3
- Vue Router
- TipTap Editor
- Tailwind CSS

## API Endpoints (Backend)
- `/get_forms.php` - Obtener listado de memorias enviadas
- `/get_form.php` - Obtener una memoria específica
- `/get_drafts_list.php` - Obtener listado de borradores
- `/get_draft.php` - Obtener un borrador específico
- `/save_draft.php` - Guardar borrador
- `/save.php` - Enviar memoria final
- `/delete_draft.php` - Eliminar borrador

## Estructura de Navegación
- `/` - Página de inicio
- `/form` - Formulario de nueva memoria
- `/submitted` - Listado de memorias enviadas
- `/drafts` - Listado de borradores
- `/form/:id` - Vista de memoria específica
- `/draft/:code` - Vista de borrador específico

## Notas de Desarrollo
- Las memorias tienen un sistema de límites de caracteres por sección
- Soporte para múltiples ciudades (Bilbao, Donostia-San Sebastián, Vitoria-Gasteiz)
- Sistema de guardado automático de borradores
- Interfaz responsive adaptada a diferentes dispositivos
