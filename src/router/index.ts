import { createRouter, createWebHistory } from 'vue-router'
import { useOrderStore } from '@/stores/order';
import { useIdImageStore } from '@/stores/idimage';

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
      component: () => import('@/views/OcrIdUploader.vue'),
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('@/views/CheckInForm.vue'),
      props: true
    },
    {
      path: '/checkin',
      name: 'checkin',
      component: () => import('@/views/CheckinCode.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const orderStore = useOrderStore();
  const idStore = useIdImageStore();

  const hasOrderData = Object.values(orderStore.orderData.orderData).length > 0;
  const hasIdImages = Object.keys(idStore.idImages).length > 0;

  // 如果沒有訂單資料，跳回首頁
  if (to.name !== 'home' && !hasOrderData) {
    return next({ name: 'home' });
  }

  // 如果在 form 頁面，且沒有身分證資料，回到上傳身分證頁面
  if (to.name == 'form' && !hasIdImages ) {
    return next({ name: 'upload' });
  }

  next();
});



export default router
