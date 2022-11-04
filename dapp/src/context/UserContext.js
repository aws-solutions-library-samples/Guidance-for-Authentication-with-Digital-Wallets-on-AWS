import React, { createContext, useState } from "react";

export const GlobalContext = createContext();

export default function ContextProvider({ children }) {
    const [user, setUser] = useState(null)

    return (
        <GlobalContext.Provider
            value={[user, setUser]}>
            {children}
        </GlobalContext.Provider>
    );
}
