import React, {useContext} from 'react'
import ChatContext from '../context/ChatContext'
import Contact from './Contact'
import {FaSearch} from 'react-icons/fa'
import {MdAdd} from 'react-icons/md'

function MyChats() {
  const {users} = useContext(ChatContext)
  
  return (
      <div id="myChatsBody">
        {users 
          ? users.map((contact, index) => {
              return <Contact 
                name={contact.name} 
                key={index}/>
          })
          : <p>No contacts yet</p>
        }
      </div>
  )
}

export default MyChats