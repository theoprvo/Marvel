import { useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../contexts/authProvider";

const useAxiosWithAuth = () => {
  const { accessToken, login } = useAuth();

  useEffect(() => {
    // On ajoute access token dans l'ente requete
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        console.log(accessToken);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
    // On appel refreshtoken() si reponse = 401
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config; // On stock la requete originale

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { data } = await axiosInstance.post(
              `/user/refresh-token`,
              {}
            );
            const newAccessToken = data.accessToken;
            login(newAccessToken); // Met à jour l'auth context
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // On met le nouveau token dans l'entete requete originale
            return axiosInstance(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    // Nettoyage des intercepteurs pour eviter les fuites
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, login]);

  return axiosInstance;
};

export default useAxiosWithAuth;
