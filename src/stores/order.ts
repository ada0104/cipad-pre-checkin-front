import { ref } from 'vue'
import { defineStore } from 'pinia'

interface OrderDataResponse {
  order_number: string;
  name: string;
  pms: string;
  domain: string;
}

interface OrderDetailDataResponse {
  code: string;
  message: string;
  data: Array<{
    room_name: string;
    status: string;
    name: string;
    email: string;
    phone: string;
    check_in: string;
    check_out: string;
    paid_amount: number;
    amount_due: number;
  }>;
}

interface CombinedOrderData {
  orderData: OrderDataResponse;
  orderDetailData: OrderDetailDataResponse;
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