import React, { createContext, useReducer } from 'react';
import chatReducer from './ChatReducer';

const ChatContext = createContext();

export const ContextProvider = ({ children }) => {
  const initialState = {
    user: {},
    userContacts: [],
    contacts: [],
    selectedContact: null,
    messages: [],
    nicknames: [],
    queuedForDelete: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
