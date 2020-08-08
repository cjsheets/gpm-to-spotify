import React, { createContext, useState } from 'react';

export interface IUser {
  displayName: string;
}

export const UserContext = createContext({});

const UserContextProvider = (props: React.PropsWithChildren<{}>) => {
  const [user, setUser] = useState({});

  const storeUser = (user: IUser) => {
    setUser({ displayName: user.displayName });
  };

  const logout = () => {
    setUser({});
  };

  return (
    <UserContext.Provider value={{ user, storeUser }}> {props.children} </UserContext.Provider>
  );
};

export default UserContextProvider;
