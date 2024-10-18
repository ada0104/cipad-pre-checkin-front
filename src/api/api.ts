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

const buildQueryParams = <T extends Record<string, any>>(params: T): string => {
  const missingParams = Object.entries(params)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingParams.length > 0) {
    throw new Error(`Missing required parameters: ${missingParams.join(", ")} are required.`);
  }

  return new URLSearchParams(params).toString();
};

export interface OrderDataRequest {
  url_token: string;
};

export interface OrderDetailDataRequest {
  pms: string,
  domain: string,
  order_number: string,
};

export interface OcrDataRequest {
  order_number: string;
  image_type: string;
  image1: string;
  image2?: string;
};

export interface DefaultMemberDataRequest {
  pms: string;
  email: string;
  order_number: string;
}

export interface NewMemberDataRequest {
  source: string; // 來源，從哪個PMS來的
  country_codes: string; // 手機國碼
  phone: string;
  name: string;
  email: string;
  birthday: string;
  order_number: string;
  is_default: boolean; // 是否要存為預設資料
  compiled?: string; // 公司統編
  company?: string; // 公司抬頭
  barcode?: string; // 手機載具
};

export interface QRcodeDataRequest {
  order_number: string,
  url_token: string,
  barcode?: string,
  compiled?: string,
  company?: string,
}

export interface OrderDataResponse {
  code: string;
  order_number: string;
  name: string;
  pms: string;
  domain: string;
  email: string;
  img?: string;
}

export interface OrderDetailDataResponse {
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

export interface OcrDataResponse {
  code: string;
  message: string;
  data: {
    name: string;
    age: string;
    birthday: string;
  };
}

export interface DefaultMemberDataResponse {
  code: string;
  message: string;
  data: {
    country_codes: string;
    phone: string;
    name: string;
    email: string;
    birthday: string;
    invoice: {
      barcode: null,
      Compiled: null,
      company: null
    },
    image_type: string;
    image1: string;
    image2: string;
  }
}

export interface NewMemberDataResponse {
  code: string;
  message: string;
}

export interface QRcodeDataResponse {
  code: string;
  message: string;
  img?: string;
}

const fetchOrderData = async (orderDataRequest: OrderDataRequest): Promise<OrderDataResponse> => {
  try {
    const { url_token } = orderDataRequest;

    const data = await fetchApi<OrderDataResponse>(
      `/dunqian/pre_checkin/${url_token}`
    );

    return data;
  } catch (error) {
    console.error("Failed to fetch order data:", error);
    throw error;
  }
};

const fetchOrderDetailData = async (orderDetailDataRequest: OrderDetailDataRequest): Promise<OrderDetailDataResponse> => {
  try {
    const queryParams = buildQueryParams(orderDetailDataRequest);
    const data = await fetchApi<OrderDetailDataResponse>(
      `/dunqian/pms/get_order_data?${queryParams}`
    );

    return data;
  } catch (error) {
    console.error("Failed to fetch order detail data:", error);
    throw error;
  }
};

const fetchOcrData = async (ocrRequestData: OcrDataRequest): Promise<OcrDataResponse> => {
  try {
    // 再請後端改為json格式
    const formData = new FormData();
    formData.set('order_number', ocrRequestData.order_number);
    formData.set('image_type', ocrRequestData.image_type);
    formData.set('image1', ocrRequestData.image1);

    if(ocrRequestData.image2) {
      formData.set('image2', ocrRequestData.image2);
    }

    const postResponse = await fetch(
      '/dunqian/pre_checkin/upload_image',
      {
        method: 'POST',
        body: formData,
      }
    );

    return await postResponse.json()
  } catch (error) {
    console.error("Failed to fetch OCR data:", error);
    throw error;
  }
};

const addMemberData = async (newMemberDataRequest: NewMemberDataRequest): Promise<NewMemberDataResponse> => {
  const formData = new FormData();
  formData.set('source', newMemberDataRequest.source);
  formData.set('country_codes', newMemberDataRequest.country_codes);
  formData.set('phone', newMemberDataRequest.phone);
  formData.set('name', newMemberDataRequest.name);
  formData.set('email', newMemberDataRequest.email);
  formData.set('birthday', newMemberDataRequest.birthday);
  formData.set('order_number', newMemberDataRequest.order_number);

  if (newMemberDataRequest.barcode) {
    formData.set('barcode', newMemberDataRequest.barcode);
  }

  if (newMemberDataRequest.compiled) {
    formData.set('compiled', newMemberDataRequest.compiled);
  }

  if (newMemberDataRequest.company) {
    formData.set('company', newMemberDataRequest.company);
  }

  formData.set('is_default', String(newMemberDataRequest.is_default));

  try {
    const postResponse = await fetch(
      '/dunqian/pre_checkin/add_member_data',
      {
        method: 'POST',
        body: formData,
      }
    );

    return await postResponse.json()
  } catch (error) {
    console.error("Failed to fetch add member data:", error);
    throw error;
  }
};

const fetchMemberData = async (defaultMemberDataRequest: DefaultMemberDataRequest): Promise<DefaultMemberDataResponse> => {
  try {
    const queryParams = buildQueryParams(defaultMemberDataRequest);
    const data = await fetchApi<DefaultMemberDataResponse>(
      `/dunqian/pre_checkin/get_member_data?${queryParams}`
    );

    return data;
  } catch (error) {
    console.error("Failed to fetch default member data:", error);
    throw error;
  }
};

const fetchQRcodeData = async (qrcodeDataRequest:QRcodeDataRequest): Promise<QRcodeDataResponse> => {
  try {

    const queryParams = buildQueryParams(qrcodeDataRequest);
    console.log(queryParams);
    const data = await fetchApi<QRcodeDataResponse>(
      `/dunqian/pre_checkin/get_checkin_qr?${queryParams}`
    );

    return data;
  } catch (error) {
    console.error("Failed to fetch QRcode data:", error);
    throw error;
  }
};

const getData = async (orderDataRequest: OrderDataRequest) => {
  try {
    const orderData = await fetchOrderData(orderDataRequest);

    if (orderData.code === '0') {
      const { pms, domain, order_number } = orderData;
      const orderDetailDataRequest: OrderDetailDataRequest = {
        pms: pms,
        domain: domain,
        order_number: order_number,
      };
      const orderDetailData = await fetchOrderDetailData(orderDetailDataRequest);

      return { orderData, orderDetailData };
    }

    if (orderData.code === '1001') {
      const { pms, domain, order_number } = orderData;
      const orderDetailDataRequest: OrderDetailDataRequest = {
        pms: pms,
        domain: domain,
        order_number: order_number,
      };
      const orderDetailData = await fetchOrderDetailData(orderDetailDataRequest);

      return { orderData, orderDetailData };
    }

    return { orderData }
  } catch (error) {
    console.error("Error in getData:", error);
    throw error;
  }
};

const getOcrData = async (ocrDataRequest: OcrDataRequest) => {
  try {
    const ocrData = await fetchOcrData(ocrDataRequest);

    return { ocrData };
  } catch (error) {
    console.error("Error in getOcrData:", error);
    throw error;
  }
};

const getMemberData = async (defaultMemberDataRequest: DefaultMemberDataRequest) => {
  try {
    const defaultMemberData = await fetchMemberData(defaultMemberDataRequest);

    return defaultMemberData;
  } catch (error) {
    console.error("Error in getMemberData:", error);
    throw error;
  }
};

const setMemberData = async (newMemberDataRequest: NewMemberDataRequest) => {
  try {
    const newMember = await addMemberData(newMemberDataRequest);

    return newMember;
  } catch (error) {
    console.error("Error in setMemberData:", error);
    throw error;
  }
};

const getQRcodeData = async (qrcodeDataRequest:QRcodeDataRequest) => {
  try {
    const QRcodeData = await fetchQRcodeData(qrcodeDataRequest);

    return QRcodeData;
  } catch (error) {
    console.error("Error in getQRcodeData:", error);
    throw error;
  }
};

export {
  getData,
  getOcrData,
  getMemberData,
  setMemberData,
  getQRcodeData,
};