import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvier({ children }) {
  const [user, setUser] = useState([]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}