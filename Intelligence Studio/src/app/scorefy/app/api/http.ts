import axios from "axios";

// Tomamos la URL base desde Vite
const baseURL = import.meta.env.VITE_SCOREFY_API_URL as string;

// Cliente Axios configurado para Windows Auth (cookies/credenciales) y CORS
export const http = axios.create({
  baseURL,
  withCredentials: true, // 👈 necesario para enviar credenciales (Kerberos/NTLM) al backend
  // Si usas certificados de desarrollo en https, no necesitas tocar 'httpsAgent' en el browser.
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