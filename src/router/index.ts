import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/upload',
      name: 'upload',
      component: () => import('@/views/OcrIdUploader.vue')
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('@/views/CheckInForm.vue')
    },
    {
      path: '/checkin',
      name: 'checkin',
      component: () => import('@/views/CheckinCode.vue')
    }
  ]
})

export default router
