import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextProps {
  token: string | null;
  isLogged: boolean;
  isAdmin: boolean;
  loading: boolean;
  setToken: (token: string, isAdmin?: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [consent, setConsent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedData = localStorage.getItem("cookieConsent");
    const consent = savedData ? JSON.parse(savedData).consent === "true" : false;

    if (consent) {
      const storedToken = sessionStorage.getItem("token");
      const storedAdmin = sessionStorage.getItem("isAdmin");

      if (storedToken) {
        setTokenState(storedToken);
        setIsLogged(true);
        setIsAdmin(storedAdmin === "true");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("cookieConsent");
    const savedConsent = savedData ? JSON.parse(savedData).consent : null;
    setConsent(savedConsent);
  }, []);

  useEffect(() => {
  const savedData = localStorage.getItem("cookieConsent");
  const savedConsent = savedData ? JSON.parse(savedData).consent : null;
  setConsent(savedConsent);

  const handleConsentChange = (event: Event) => {
    const detail = (event as CustomEvent).detail;
    setConsent(detail);
  };

  window.addEventListener("cookieConsentChanged", handleConsentChange);
  return () => window.removeEventListener("cookieConsentChanged", handleConsentChange);
}, []);


  useEffect(() => {
    if (consent === "true") {
      const storedToken = sessionStorage.getItem("token");
      const storedAdmin = sessionStorage.getItem("isAdmin");

      if (storedToken) {
        setTokenState(storedToken);
        setIsLogged(true);
        setIsAdmin(storedAdmin === "true");
      }
    }
  }, [consent]);

  function setToken(token: string, isAdminFlag: boolean = false) {
    const savedData = localStorage.getItem("cookieConsent");
    const consent = savedData ? JSON.parse(savedData).consent === "true" : false;

    if (consent) {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("isAdmin", String(isAdminFlag));
      setTokenState(token);
      setIsLogged(true);
      setIsAdmin(isAdminFlag);
    } else {
      console.warn("Token não pode ser salvo sem consentimento de cookies.");
    }
  }

   function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isAdmin");
    setTokenState(null);
    setIsLogged(false);
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ token, isLogged, isAdmin, loading, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
