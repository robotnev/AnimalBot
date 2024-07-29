// UserContext.jsx
import React, { createContext, useState } from 'react';
const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (username) => {
    setUser(username);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
