// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import FormView from '../views/FormView.vue'
import SubmittedForms from '../views/SubmittedForms.vue'
import FormDetail from '../views/FormDetail.vue'
import DraftsList from '../views/DraftsList.vue'
import DraftView from '../views/DraftView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/form',
    name: 'form',
    component: FormView
  },
  {
    path: '/submitted',
    name: 'SubmittedForms',
    component: SubmittedForms
  },
  {
    path: '/form/:id',
    name: 'FormDetail',
    component: FormDetail
  },
  {
    path: '/drafts',
    name: 'Drafts',
    component: DraftsList
  },
  {
    path: '/draft/:code',
    name: 'DraftView',
    component: DraftView
  }
]

const router = createRouter({
    history: createWebHistory('/mugak/opensite/'), // Define el subdirectorio aquí
    routes
  });
  
  export default router;