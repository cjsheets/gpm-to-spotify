import React, { createContext, useReducer, Dispatch } from 'react';
import { User } from '../types';

interface UserStore {
  user?: User;
}

type ActionTypes = {
  type: 'setUserInfo';
  user?: User;
};

const initialUserStore = {};
const userStore = createContext<{ store: UserStore; dispatch: Dispatch<ActionTypes> }>({
  store: initialUserStore,
  dispatch: () => null,
});
const { Provider } = userStore;

const userContextReducer = (store: UserStore, action: ActionTypes): UserStore => {
  switch (action.type) {
    case 'setUserInfo':
      return { ...store, user: action.user };
    default:
      throw new Error();
  }
};

const UserContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [store, dispatch] = useReducer(userContextReducer, initialUserStore);

  return <Provider value={{ store, dispatch }}> {children} </Provider>;
};

export { userStore, UserContextProvider };
