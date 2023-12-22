import type {AxiosInstance} from 'axios';
import axios from 'axios';
import type {RequestConfig} from './type';

class Request {
    instance: AxiosInstance;

    constructor(config: RequestConfig) {
        this.instance = axios.create(config);

        this.instance.interceptors.request.use(
            (config) => {
                return config;
            },
            (err) => {
                return err;
            }
        );
        this.instance.interceptors.response.use(
            (res) => {
                return res.data;
            },
            (err) => {
                return err;
            }
        );

        this.instance.interceptors.request.use(
            config.interceptors?.requestSuccessFn,
            config.interceptors?.requestFailureFn
        );
        this.instance.interceptors.response.use(
            config.interceptors?.responseSuccessFn,
            config.interceptors?.responseFailureFn
        );
    }

    request<T = any>(config: RequestConfig<T>) {
        if (config.interceptors?.requestSuccessFn) {
            config = config.interceptors.requestSuccessFn(config);
        }

        return new Promise<T>((resolve, reject) => {
            this.instance
                .request<any, T>(config)
                .then((res) => {
                    if (config.interceptors?.responseSuccessFn) {
                        res = config.interceptors.responseSuccessFn(res);
                    }
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    get<T = any>(config: RequestConfig<T>) {
        return this.request({...config, method: 'GET'});
    }

    post<T = any>(config: RequestConfig<T>) {
        return this.request({...config, method: 'POST'});
    }

    delete<T = any>(config: RequestConfig<T>) {
        return this.request({...config, method: 'DELETE'});
    }

    patch<T = any>(config: RequestConfig<T>) {
        return this.request({...config, method: 'PATCH'});
    }
}

export default Request;