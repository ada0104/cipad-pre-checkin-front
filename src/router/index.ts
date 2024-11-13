import { createRouter, createWebHistory } from 'vue-router'
import { useOrderStore, useUrlTokenStore } from '@/stores/order';
import { useIdImageStore } from '@/stores/idimage';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:urlToken?',
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
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/Test.vue')
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

  // 處理帶有 token 的路徑
  if (to.params.urlToken) {
    const urlToken = Array.isArray(to.params.urlToken)
    ? to.params.urlToken[0]
    : to.params.urlToken;
    urlTokenStore.setUrlToken(urlToken);
    localStorage.setItem('urlToken', urlToken);
  }

  if (!to.name && to.path !== '/') {
    const match = to.path.match(/\/([a-zA-Z0-9]+)$/);
    if (match) {
      urlTokenStore.setUrlToken(match[1]);
      // 只在確實需要重定向時才返回
      if (to.path !== `/${match[1]}`) {
        return next({ path: `/${match[1]}` });
      }
    }
  }

  // 防止影響 /test 路徑
  if (to.name === 'test') {
    return next();
  }

  // 檢查訪問權限
  if (!hasUrlToken && !hasOrderData) {
    if (to.name === 'home') {
      const storedUrlToken = localStorage.getItem('urlToken');
      return next({ path: `/${storedUrlToken}` });
    }
    if (to.name !== 'home') {
      return next({ name: 'home' });
    }
  } else if (to.name === 'form' && !hasIdImages) {
    return next({ name: 'upload' });
  }

  // 正常導航，不需要重定向
  next();
});

export default router
