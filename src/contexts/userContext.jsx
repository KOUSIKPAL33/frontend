import React, { createContext, useReducer } from 'react';
import UserReducer from './UserReducer';

export const userContext = createContext();

const initialState = {
  name: "",
  mobile: "",
  email:"",
  addresses:[],
};

const UserProvider = ({ children }) => {
  const [user, dispatchUser] = useReducer(UserReducer, initialState);

  return (
    <userContext.Provider value={{ user, dispatchUser }}>
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
