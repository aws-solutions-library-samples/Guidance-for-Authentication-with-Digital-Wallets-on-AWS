// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { createContext, useEffect, useState } from 'react';
import { checkUser } from 'utils/user';

export const GlobalContext = createContext();

export default function ContextProvider({ children }) {
  const [user, setUser] = useState(null);

  // Check the user once when the app starts
  // Previously logged in users will automatically be logged in

  useEffect(() => {
    checkUser(setUser);
  }, []);

  return (
    <GlobalContext.Provider
      value={[user, setUser]}>
      {children}
    </GlobalContext.Provider>
  );
}
