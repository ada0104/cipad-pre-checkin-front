import { createRouter, createWebHistory } from 'vue-router'
import { useOrderStore , useUrlTokenStore} from '@/stores/order';
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
  const urlTokenStore = useUrlTokenStore();
  const idStore = useIdImageStore();

  const hasOrderData = Object.values(orderStore.orderData.orderData).length > 0;
  const hasIdImages = Object.keys(idStore.idImages).length > 0;
  const hasUrlToken = !!urlTokenStore.urlToken;

  if (!to.name) {
    const fullPath = to.fullPath;
    const match = fullPath.match(/\/([a-zA-Z0-9]+)$/);

    if (match) {
      const urlToken = match[1];
      urlTokenStore.setUrlToken(urlToken);
    }
  }
  // 重新整理的時候會遺失urlToken
  if (to.name !== 'home' && !hasOrderData && !hasUrlToken) {
    return next({ name: 'home' });
  }

  if (to.name == 'form' && !hasIdImages ) {
    return next({ name: 'upload' });
  }

  next();
});

export default router