interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

const fetchApi = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  try {
    const { method = 'GET', headers = {}, body } = options;
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as T;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

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

interface OcrDataResponse {
  code: string;
  message: string;
  data: Array<{
    name: string;
    age: string;
    birthday: string;
  }>;
}

const fetchOrderData = async (): Promise<OrderDataResponse> => {
  try {
    const data = await fetchApi<OrderDataResponse>('/dunqian/pre_checkin/DsMEA');
    return data;
  } catch (error) {
    console.error("Failed to fetch order data:", error);
    throw error;
  }
};

const fetchOrderDetailData = async (
  pms: string,
  domain: string,
  order_number: string,
): Promise<OrderDetailDataResponse> => {
  try {
    const data = await fetchApi<OrderDetailDataResponse>(
      `/dunqian/pms/get_order_data?pms=${pms}&domain=${domain}&order_number=${order_number}`
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch order detail data:", error);
    throw error;
  }
};

// const fetchOcrData = async (
//   orderId: string,
//   image_type:string,
//   image1:string,
//   image2?:string
// ): Promise<OcrDataResponse> => {
//   try {
//     const postResponse = await fetchApi<OcrDataResponse>('/dunqian/pre_checkin/upload_image', {
//       method: 'POST',
//       body: {
//         orderId,
//         image_type,
//         image1,
//         image2,
//       }
//     });

//     return postResponse;
//   } catch (error) {
//     console.error("Failed to fetch another data:", error);
//     throw error;
//   }
// };

const getData = async () => {
  try {
    const orderData = await fetchOrderData();
    const { pms, domain, order_number } = orderData;
    const orderDetailData = await fetchOrderDetailData(pms, domain, order_number);

    return { orderData, orderDetailData };
  } catch (error) {
    console.error("Error in getData:", error);
    throw error;
  }
};

// const getOcrData = async (
//   image_type:string,
//   image1:string,
//   image2?:string
// ) => {
//   try {
//     const orderData = await fetchOrderData();
//     const { order_number } = orderData;
//     const ocrData = await fetchOcrData(order_number , image_type, image1, image2);

//     return { ocrData };
//   } catch (error) {
//     console.error("Error in getData:", error);
//     throw error;
//   }
// }

export {
  getData,
  // getOcrData,
};