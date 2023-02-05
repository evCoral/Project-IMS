import React, { createContext, useState } from "react";
import { Outlet } from "react-router-dom";

interface context {
  [key: string]: any;
}

export const UserContext = createContext<context>({});

function App() {
  const [user, setUser] = useState(null);
  const value = { user, setUser };

  return (
    <UserContext.Provider value={value}>
      <Outlet />
    </UserContext.Provider>
  );
}

export default App;
