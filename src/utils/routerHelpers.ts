import { type Router } from 'vue-router';
import { useUrlTokenStore } from '@/stores/urlToken';

const navigateTo = (router: Router, routeName: string, params = {}) => {
  const urlTokenStore = useUrlTokenStore();
  const urlToken = urlTokenStore.urlToken;

  router.push({ name: routeName, params: { ...params, urlToken } });
};

export { navigateTo };
