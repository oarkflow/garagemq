import type { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, AxiosError } from 'axios';

export interface Interceptors<T = AxiosResponse> {
  requestSuccessFn?: (config: any) => any;
  requestFailureFn?: (err: AxiosError) => any;
  responseSuccessFn?: (res: T) => T;
  responseFailureFn?: (err: AxiosError) => any;
}

export interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: Interceptors<T>;
  headers?: AxiosRequestHeaders;
}
