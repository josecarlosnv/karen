
import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE_URL as string;

export const http = axios.create({
    baseURL,
    withCredentials: true, });


http.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);
/*
import axios from "axios";

// Tomamos la URL base desde Vite
const baseURL = import.meta.env.VITE_API_URL as string;

// Cliente Axios configurado para Windows Auth (cookies/credenciales) y CORS
export const http = axios.create({
  baseURL,
  withCredentials: true,
});

// (Opcional) Interceptor de respuesta para normalizar errores
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Puedes mapear aquí tus errores a un formato estándar
    // Por ejemplo, adjuntar status y mensaje
    const status = error?.response?.status ?? 0;
    const message = error?.response?.data?.message ?? error.message ?? "Request error";
    return Promise.reject({ status, message, raw: error });
  }
);
*/