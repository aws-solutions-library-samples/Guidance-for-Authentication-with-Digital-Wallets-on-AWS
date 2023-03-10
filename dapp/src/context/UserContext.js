// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

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
