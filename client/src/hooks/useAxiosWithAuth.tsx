import { useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../contexts/authProvider";

const useAxiosWithAuth = () => {
  const { accessToken, login } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Pour éviter les boucles infinies
          try {
            const { data } = await axiosInstance.post(`/user/refresh-token`);
            const newAccessToken = data.accessToken;

            login(newAccessToken); // Met à jour le contexte Auth
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return axiosInstance(originalRequest); // Relance la requête originale
          } catch (err) {
            console.error("Erreur lors du refresh token :", err);
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, login]);

  return axiosInstance;
};

export default useAxiosWithAuth;
