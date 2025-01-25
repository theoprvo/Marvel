import React, { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (newAccessToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = (newAccessToken: string) => {
    console.log("fonction login authProvider :", newAccessToken);
    setAccessToken(newAccessToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, accessToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
