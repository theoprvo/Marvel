import { useState } from "react";
import axios from "axios";

const useAuthToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/refresh-token`,
        {},
        {
          withCredentials: true, // refreshToken
        }
      );
      const newAccessToken = response.data.accessToken;
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token", error);
      setAccessToken(null);
      return null;
    }
  };

  return { accessToken, setAccessToken, refreshAccessToken };
};

export default useAuthToken;
