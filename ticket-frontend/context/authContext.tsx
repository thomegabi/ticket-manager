import { createContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextProps {
  token: string | null;
  isLogged: boolean;
  isAdmin: boolean;
  setToken: (token: string, isAdmin?: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
      const storedToken = sessionStorage.getItem("token");
      const storedAdmin = sessionStorage.getItem("isAdmin");

      if (storedToken) {
        setTokenState(storedToken);
        setIsLogged(true);
        setIsAdmin(storedAdmin === "true");
      }
  }, []);

  function setToken(token: string, isAdminFlag: boolean = false) {

    
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("isAdmin", String(isAdminFlag));
    setTokenState(token);
    setIsLogged(true);
    setIsAdmin(isAdminFlag);
    
  }

   function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isAdmin");
    setTokenState(null);
    setIsLogged(false);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ token, isLogged, isAdmin, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}