import { createContext, useContext, useState, useEffect } from 'react';

const LoginContext = createContext();

export function LoginProvider({ children }) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('/home');

  // Check for existing token and route in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const savedRoute = localStorage.getItem('currentRoute');
    
    if (token) {
      setLoggedIn(true);
    }
    
    if (savedRoute) {
      setCurrentRoute(savedRoute);
    }
  }, []);

  // Update current route in localStorage whenever it changes
  useEffect(() => {
    if (currentRoute !== '/home') {
      localStorage.setItem('currentRoute', currentRoute);
    }
  }, [currentRoute]);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setLoggedIn, currentRoute, setCurrentRoute }}>
      {children}
    </LoginContext.Provider>
  );
}

export function useLoginContext() {
  return useContext(LoginContext);
}
