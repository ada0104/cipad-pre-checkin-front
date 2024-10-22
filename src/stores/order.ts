import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type OrderDataResponse, type OrderDetailDataResponse } from '@/api/api'

interface CombinedOrderData {
  orderData: OrderDataResponse;
  orderDetailData?: OrderDetailDataResponse;
}

export const useOrderStore = defineStore('orderData', () => {
  const orderData = ref<CombinedOrderData>({
    orderData: {} as OrderDataResponse,
    orderDetailData: {} as OrderDetailDataResponse
  });

  function setOrderData(data: CombinedOrderData) {
    orderData.value = data;
  }

  function clearStore() {
    orderData.value = {
      orderData: {} as OrderDataResponse,
      orderDetailData: {} as OrderDetailDataResponse
    };
  }

  return {
    orderData,
    setOrderData,
    clearStore
  };
});

export const useUrlTokenStore = defineStore('urlToken', () => {
  const urlToken = ref<string>('');

  function setUrlToken(data:string) {
    urlToken.value = data;
  }

  return {
    urlToken,
    setUrlToken,
  };
});