import React, {useContext} from 'react'
import ChatContext from '../context/ChatContext'
import Contact from './Contact'
import {FaSearch} from 'react-icons/fa'
import {MdAdd} from 'react-icons/md'

function MyChats() {
  const {contacts} = useContext(ChatContext)
  
  return (
    <div id='myChats'>
      <div id="myChatsHeader">
        <div id="myChatsHeaderSearchBox">
          <FaSearch />
          <input type="text" id="myChatsSearch"/>
        </div>

        <div id="addContactButton">
          <MdAdd />
        </div>
      </div>

      <div id="myChatsBody">
        {contacts 
          ? contacts.map((contact, index) => {
              return <Contact 
                name={contact.name} 
                key={index}/>
          })
          : <p>No contacts yet</p>
        }
      </div>
    </div>
  )
}

export default MyChats