import { createContext, useContext, useState } from 'react';

const LoginContext = createContext();

export function LoginProvier({ children }) {
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
}

export function useLoginContext() {
  return useContext(LoginContext);
}