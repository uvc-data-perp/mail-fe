import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const axiosInstance = axios.create({
    baseURL: config.public.apiBaseUrl,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 요청 인터셉터 추가
  axiosInstance.interceptors.request.use(
    (config) => {
      if (config.data) {
        config.data = snakecaseKeys(config.data, { deep: true });
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 추가
  axiosInstance.interceptors.response.use(
    (response) => {
      if (response.data) {
        response.data = camelcaseKeys(response.data, { deep: true });
      }
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      axios: axiosInstance,
    },
  };
});
