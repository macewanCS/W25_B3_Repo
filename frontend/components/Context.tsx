import React, { createContext, useContext, useState } from 'react';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null); // Holds the session data

  const signIn = (token: string) => {
    // For now, just simulate a successful sign-in
    setSession({ jwt: token }); // You can replace this with real authentication logic
  };

  const signOut = () => {
    setSession(null); // Clears session on sign-out
  };

  return (
      <SessionContext.Provider value={{ session, signIn, signOut }}>
        {children}
      </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);