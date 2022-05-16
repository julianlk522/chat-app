import React from 'react'
import MyChats from '../components/MyChats'
import Conversation from '../components/Conversation'
import ContactInfo from '../components/ContactInfo'

function ChatScreen() {
  return (
    <div style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
      }}>
        <MyChats />
        <Conversation />
        <ContactInfo />
      </div>
  )
}

export default ChatScreen