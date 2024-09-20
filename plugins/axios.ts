import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const axiosInstance = axios.create({
    baseURL: config.public.apiBaseUrl,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return {
    provide: {
      axios: axiosInstance,
    },
  };
});
