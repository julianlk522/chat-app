import React, {createContext, useEffect, useReducer, useState} from 'react'
import chatReducer from './ChatReducer'

const ChatContext = createContext()

export const ContextProvider = ({children}) => {
  const initialState = {
    user: {},
    contacts: [],
    messages: [],
    loading: false
  }

  const [state, dispatch] = useReducer(chatReducer, initialState)

  // const [messages, setMessages] = useState([])
  // const [contacts, setContacts] = useState([])

  // useEffect(() => {
  //   const fetchContacts = async () => {
  //     try {
  //       const response = await fetch(`${url}/users`)
  //       const responseData = await response.json()
  //       console.log(responseData)
  //       setContacts(responseData)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetchContacts()
  // }, [])

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     try {
  //       const response = await fetch(`${url}/messages`)
  //       const responseData = await response.json()
  //       console.log(responseData)
  //       setMessages(responseData)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   fetchMessages()
  // }, [])

  return <ChatContext.Provider
    value={{
        state,
        dispatch
    }}
  >
      {children}
  </ChatContext.Provider>
}

export default ChatContext