import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orderData', () => {
  const orderData = ref({});

  function setOrderData(data: {}) {
    orderData.value = data;
  }

  function clearStore() {
    orderData.value = {};
  }

  return {
    orderData,
    setOrderData,
    clearStore
  };
});