import React, { createContext, useReducer } from 'react';
import chatReducer from './ChatReducer';

const ChatContext = createContext();

export const ContextProvider = ({ children }) => {
  const initialState = {
    user: {},
    contacts: [],
    selectedContact: null,
    messages: [],
    mostRecentMessages: [],
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