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

// 取得訂單基本資料
interface OrderDataResponse {
  order_number: string;
  name: string;
  pms: string;
  domain: string;
}

const fetchOrderData = async (): Promise<OrderDataResponse> => {
  try {
    const data = await fetchApi<OrderDataResponse>('/dunqian/pre_checkin/ogymE');

    return data;
  } catch (error) {
    console.error("Failed to fetch order data:", error);
    throw error;
  }
};

// 取得訂單詳細資料
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

const fetchOrderDetailData = async (
  pms: string,
  domain: string,
  order_number: string,
): Promise<OrderDetailDataResponse> => {
  try {
    const params = new URLSearchParams({
      pms,
      domain,
      order_number
    });

    const data = await fetchApi<OrderDetailDataResponse>(
      `/dunqian/pms/get_order_data?${params.toString()}`
    );

    return data;
  } catch (error) {
    console.error("Failed to fetch order detail data:", error);
    throw error;
  }
};

// 傳送ＯＣＲ辨識
type OcrDataRequest = {
  order_number: string;
  image_type: string;
  image1: string;
  image2?: string;
};

export interface OcrDataResponse {
  code: string;
  message: string;
  data: {
    name: string;
    age: string;
    birthday: string;
  };
}

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

// 新增會員資料
export type NewMemberDataRequest = {
  source: string; // 來源，從哪個PMS來的
  country_codes: string; // 手機國碼
  phone: string;
  name: string;
  email: string;
  birthday: string;
  order_number: string;
  is_default: boolean; // 是否為預設資料
  compiled?: string; // 公司統編
  company?: string; // 公司抬頭
  barcode?: string; // 手機載具
};

interface NewMemberDataResponse {
  code: string;
  message: string;
}

const fetchMemberData = async (newMemberDataRequest: NewMemberDataRequest): Promise<NewMemberDataResponse> => {
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
    console.error("Failed to fetch order detail data:", error);
    throw error;
  }
};

interface QRcodeDataResponse {
  code: string;
  message: string;
  img?: string;
}

const fetchQRcodeData = async (
  order_number: string,
  url_token: string,
  barcode?: string,
  compiled?: string,
  company?: string,
): Promise<QRcodeDataResponse> => {
  try {
    const params = new URLSearchParams({
      order_number,
      url_token,
      ...(barcode && { barcode }),
      ...(compiled && { compiled }),
      ...(company && { company }),
    });

    const data = await fetchApi<QRcodeDataResponse>(
      `/dunqian/pre_checkin/get_checkin_qr?${params.toString()}`
    );

    return data;
  } catch (error) {
    console.error("Failed to fetch order detail data:", error);
    throw error;
  }
};

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

const getOcrData = async ({ order_number, image_type, image1, image2 }: OcrDataRequest) => {
  try {
    const ocrData = await fetchOcrData({ order_number, image_type, image1, image2 });

    return { ocrData };
  } catch (error) {
    console.error("Error in getOcrData:", error);
    throw error;
  }
};

const setMemberData = async (newMemberDataRequest: NewMemberDataRequest) => {
  try {
    const newMember = await fetchMemberData(newMemberDataRequest);

    return newMember;
  } catch (error) {
    console.error("Error in setMemberData:", error);
    throw error;
  }
};

const getQRcodeData = async () => {
  try {
    const QRcodeData = await fetchQRcodeData();

    return QRcodeData;
  } catch (error) {
    console.error("Error in getData:", error);
    throw error;
  }
};

export {
  getData,
  getOcrData,
  setMemberData,
  getQRcodeData,
};