import axios, { AxiosResponse } from "axios";
import { encrypt } from "..//encryption";
import { AxiosQueueManager } from "./queue";
import { IHttpMethod } from "./queue/interfaces";
import { toast } from "@/components/toast";
import { apiUrl } from "./api-url";
import {setupCache} from "axios-cache-interceptor";

const baseURL = apiUrl();
const uploadURL = "/media/upload";

const axiosInstance = axios.create({
    // @ts-ignore
    baseURL: baseURL,
    maxRedirects: 0,
    validateStatus: function (status: number) {
        return status >= 200 && status < 300;
    },
});
const updateEndTime = (response) => {
    response.customData = response.customData || {};
    response.customData.time =
        new Date().getTime() - response.config.customData.startTime;
    return response;
};
axiosInstance.interceptors.request.use(
    (requestConfig) => {
        requestConfig.customData = requestConfig.customData || {};
        requestConfig.customData.startTime = new Date().getTime();
        let time = ((Date.now() % 1000) / 1000) * 1000000;
        if (requestConfig.headers) {
            requestConfig.headers["x-request-id"] = encrypt(
                time.toString(),
                import.meta.env.VITE_SECRET
            );
        }
        return requestConfig;
    },
    (requestError) => {
        return Promise.reject(requestError);
    }
);

axiosInstance.interceptors.response.use(updateEndTime, (e) => {
    return Promise.reject(updateEndTime(e.response));
});

export const uploadFile = (file: any, url?: string) => {
    const formData = new FormData();
    for (const value of file) {
        const name = value.file.name
        const file = value.file
        formData.append(name, file)
    }
    url = baseURL + (url || uploadURL)
    return HttpClient.post(url, formData)
}

const queueManager = new AxiosQueueManager({ client: axiosInstance });

export const HttpClient = {
    request(conf: any = {}) {
        return this.response(axiosInstance.request(conf));
    },
    get(url: string, conf: any = {}) {
        return this.response(axiosInstance.get(url, conf));
    },
    delete(url: string, conf: any = {}) {
        return this.response(axiosInstance.delete(url, conf));
    },
    head(url: string, conf: any = {}) {
        return this.response(axiosInstance.head(url, conf));
    },
    options(url: string, conf: any = {}) {
        return this.response(axiosInstance.options(url, conf));
    },
    post(url: string, data = {}, conf: any = {}) {
        return this.response(axiosInstance.post(url, data, conf));
    },
    put(url: string, data = {}, conf: any = {}) {
        return this.response(axiosInstance.put(url, data, conf));
    },
    patch(url: string, data = {}, conf: any = {}) {
        return this.response(axiosInstance.patch(url, data, conf));
    },
    queue(url: string, method: IHttpMethod, data = {}, conf: any = {}) {
        return this.response(queueManager.request(url, method, data, conf));
    },

    async response(
        resp: Promise<AxiosResponse>
    ): Promise<AxiosResponse<any, any>> {
        return resp
            .then((response) => {
                const data = response.data
                if (data.code >= 300 && data.code < 400 ) {
                    window.location.replace(data.data.redirect_url)
                    return Promise.resolve(response);
                } else if (data.code > 400 && data.code < 404 ) {
                    localStorage.clear()
                    window.location.assign("/")
                    return Promise.resolve(response);
                } else if (data.code >= 400 && data.code < 600) {
                    if (data?.message?.includes("not logged in")) {
                        localStorage.clear()
                        window.location.assign("/")
                    }
                    if (typeof data?.additional === "object" && Object.keys(data?.additional).length > 0) {
                        let errMessage;
                        if (data.additional.hasOwnProperty("Message")) {
                            errMessage = data.additional.Message
                        } else {
                            for (const key in data.additional) {
                                errMessage = `${key} ${(Object.values(data.additional[key])[0] as string)?.toLowerCase()}`
                            }
                        }

                        toast.error(errMessage);
                    } else {

                        toast.error(data.message);
                    }
                }
                return Promise.resolve(response);
            })
            .catch((error) => {
                toast.error(error.message);
                return Promise.reject(error);
            });
    },
};
