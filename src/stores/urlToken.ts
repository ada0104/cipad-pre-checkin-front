import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUrlTokenStore = defineStore('urlToken', () => {
  const urlToken = ref<string>((''));

  function setUrlToken(data: string) {
    urlToken.value = data;
  }

  return {
    urlToken,
    setUrlToken,
  };
});
