import axios, { AxiosError, AxiosInstance } from "axios";
import { getAuthToken } from "./auth";
import { logoutAction } from "@/actions/logout";
import { redirect } from "next/navigation";

// Seleção dinâmica de baseURL
const baseURL = process.env.API_URL || "http://localhost:3030"

const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

// Interceptor de requisição
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAuthToken();
      if (token) config.headers.Authorization = token;

      return config;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Request interceptor error:", error);
      }
      throw error;
    }
  },
  (error) => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Request configuration error:", error);
    }
    return Promise.reject(error);
  }
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {

    // Se for erro 401 -> logout
    if (error.response?.status === 401) {
      try {
        logoutAction();
        redirect("/");
      } catch (error: unknown) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Logout error:", error);
        }
      }
    }
    if (process.env.NODE_ENV !== "production") {
      console.error("API Response Error:", {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    // Tratamento padrão de erro
    return Promise.reject({
      status: error.response?.status || 500,
      message:
        (error.response?.data as { message?: string })?.message ||
        error.message ||
        "Ocorreu um erro na requisição. Já estamos trabalhando para resolver.",
      data: error.response?.data,
    });
  }
);

export default api;
