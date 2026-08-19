import { message } from 'ant-design-vue';
import md5 from 'md5';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 配置常量
const signKey = 'klx05hb3n1c9ujp8uhx4bs2iksdfsdfk5io6wp212';

// 定义请求配置扩展（支持 query 参数）
interface RequestConfig extends AxiosRequestConfig {
  query?: Record<string, any>;
}

// 定义后端统一响应结构（根据你的实际情况调整）
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

// 请求函数重载（提供更准确的类型推断）
async function request<T = any>(
  url: string,
  config?: RequestConfig
): Promise<ApiResponse<T>>;

async function request<T = any>(
  url: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const { query, ...axiosConfig } = config;
  const st = Date.now();

  const ajax: AxiosRequestConfig = {
    url,
    method: 'GET', // 默认方法，后面会被覆盖
    responseType: 'json',
    ...axiosConfig,
    params: query || axiosConfig.params,
    headers: {
      ...axiosConfig.headers,
      s_t: st,
      s_sign: md5(`${signKey}_${st}`)
    }
  };

  // 移除自定义的 query 字段（避免污染 axios 配置）
  delete (ajax as any).query;

  try {
    const res: AxiosResponse<ApiResponse<T>> = await axios.request(ajax);
    const data = res.data;
    // 业务失败
    if (data.success !== true) {
      message.error(data.message || '业务失败');
    }
    return Promise.resolve(data);
  } catch (err: any) {
    // 物理失败（网络、超时等）/ HTTP 错误状态码（4xx、5xx）
    const msg =
      err?.response?.data?.message ||
      (err instanceof Error ? err.message : String(err));
    if (msg.match(/timeout/)) {
      message.error('请求超时', 5);
    }
    // 构造一个符合 ApiResponse 结构的失败对象，避免调用方出现 undefined
    const result: ApiResponse = {
      success: false,
      message: msg,
      code: -1
    };
    return Promise.resolve(result);
  }
}

// 扩展 request 对象的快捷方法（保持类型安全）
interface RequestInstance {
  <T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  put<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  patch<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
}

const requestInstance: RequestInstance = request as RequestInstance;

requestInstance.get = (url, config) =>
  request(url, {
    method: 'GET',
    ...config
  });

requestInstance.post = (url, config) =>
  request(url, {
    method: 'POST',
    ...config
  });

requestInstance.put = (url, config) =>
  request(url, {
    method: 'PUT',
    ...config
  });

requestInstance.patch = (url, config) =>
  request(url, {
    method: 'PATCH',
    ...config
  });

requestInstance.delete = (url, config) =>
  request(url, {
    method: 'DELETE',
    ...config
  });

export default requestInstance;
