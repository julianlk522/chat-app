import React, {createContext, useEffect, useState} from 'react'

const ChatContext = createContext()
const url = 'http://localhost:5000'

export const ContextProvider = ({children}) => {
  
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${url}/users`)
        const responseData = await response.json()
        console.log(responseData)
        setUsers(responseData)
      } catch (error) {
        console.log(error)
      }
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${url}/messages`)
        const responseData = await response.json()
        console.log(responseData)
        setMessages(responseData)
      } catch (error) {
        console.log(error)
      }
    }
    fetchMessages()
  }, [])

  return <ChatContext.Provider
    value={{
        messages,
        users,
    }}
  >
      {children}
  </ChatContext.Provider>
}

export default ChatContext