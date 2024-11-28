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
  phone?: string | null;
  name: string;
  email: string;
  birthday: string;
  order_number: string;
  is_default: boolean; // 是否要存為預設資料
  compiled?: string | null; // 公司統編
  company?: string | null; // 公司抬頭
  barcode?: string | null; // 手機載具
};

export interface QRcodeDataRequest {
  order_number: string,
  url_token: string,
  barcode?: string,
  compiled?: string,
  company?: string,
}

export interface SentEmailRequest {
  mail: string,
  name: string,
  domain: string,
  order_number: string,
  check_in_date: string,
  check_out_date: string,
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
    name?: string;
    age?: string;
    birthday?: string;
  } | Array<{
    code: string;
    description: string;
    severity: string;
    confidence: number;
    decision: string;
  }>;
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
      compiled: null,
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

export interface SentEmailResponse {
  code: string;
  message: string;
  data?: string;
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
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    // 再請後端改為json格式
    const urlencoded = new URLSearchParams();
    urlencoded.append("order_number", ocrRequestData.order_number);
    urlencoded.append("image_type", ocrRequestData.image_type);
    urlencoded.append("image1", ocrRequestData.image1);
    if(ocrRequestData.image2) {
      urlencoded.append("image2", ocrRequestData.image2);
    }

    const postResponse = await fetch(
      '/dunqian/pre_checkin/upload_image',
      {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
      }
    );

    return await postResponse.json()
  } catch (error) {
    console.error("Failed to fetch OCR data:", error);
    throw error;
  }
};

const addMemberData = async (newMemberDataRequest: NewMemberDataRequest): Promise<NewMemberDataResponse> => {

  const myHeaders = new Headers();
  // 再請後端改為json格式
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  const urlencoded = new URLSearchParams();

  urlencoded.append('source', newMemberDataRequest.source);
  urlencoded.append('country_codes', newMemberDataRequest.country_codes);
  urlencoded.append('name', newMemberDataRequest.name);
  urlencoded.append('email', newMemberDataRequest.email);
  urlencoded.append('birthday', newMemberDataRequest.birthday);
  urlencoded.append('order_number', newMemberDataRequest.order_number);

  if (newMemberDataRequest.phone) {
    urlencoded.append('phone', newMemberDataRequest.phone);
  }

  if (newMemberDataRequest.barcode) {
    urlencoded.append('barcode', newMemberDataRequest.barcode);
  }

  if (newMemberDataRequest.compiled) {
    urlencoded.append('compiled', newMemberDataRequest.compiled);
  }

  if (newMemberDataRequest.company) {
    urlencoded.append('company', newMemberDataRequest.company);
  }

  urlencoded.append('is_default', String(newMemberDataRequest.is_default));

  try {
    const postResponse = await fetch(
      '/dunqian/pre_checkin/add_member_data',
      {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
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
    const data = await fetchApi<QRcodeDataResponse>(
      `/dunqian/pre_checkin/get_checkin_qr?${queryParams}`
    );

    return data;
  } catch (error) {
    console.error("Failed to fetch QRcode data:", error);
    throw error;
  }
};

const fetchSentEmail = async (sentEmailRequest: SentEmailRequest): Promise<SentEmailResponse> => {
  try {
    const response = await fetchApi<SentEmailResponse>('/dunqian/pre_checkin/send_pci_mail', {
      method: 'POST',
      body: sentEmailRequest,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error("Failed to fetch sent email data:", error);
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

const setSentEmailData = async (sentEmailRequest:SentEmailRequest) => {
  try {
    const sentEmailData = await fetchSentEmail(sentEmailRequest);

    return sentEmailData;
  } catch (error) {
    console.error("Error in sentEmailData:", error);
    throw error;
  }
};

export {
  getData,
  getOcrData,
  getMemberData,
  setMemberData,
  getQRcodeData,
  setSentEmailData
};