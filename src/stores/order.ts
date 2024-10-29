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

  const qrimg = ref<string>('');

  function setOrderData(data: CombinedOrderData) {
    orderData.value = data;
  }

  function setQRCodeImage(img: string) {
    qrimg.value = img;
  }

  function clearStore() {
    orderData.value = {
      orderData: {} as OrderDataResponse,
      orderDetailData: {} as OrderDetailDataResponse
    };
  }

  return {
    qrimg,
    orderData,
    setOrderData,
    setQRCodeImage,
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