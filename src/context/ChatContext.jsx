import React, {createContext, useState} from 'react'

const ChatContext = createContext()

export const ContextProvider = ({children}) => {
  
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([])

  const [contacts, setContacts] = useState([
    {
        name: "Sneha Thirkannad",
        hiddenAlerts: true,
        readReceiptsOn: true,
    },
    {
        name: "Bradley Robasky",
        hiddenAlerts: true,
        readReceiptsOn: true,
    },
  ])

  const handleSliderToggle = (e) => {
    console.log(e.target);
  }

  return <ChatContext.Provider
    value={{
        messages,
        setMessages,
        contacts,
        setContacts,
        handleSliderToggle
    }}
  >
      {children}
  </ChatContext.Provider>
}

export default ChatContext