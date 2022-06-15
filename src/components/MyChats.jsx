import React, {useContext, useEffect} from 'react'
import ChatContext from '../context/ChatContext'
import { getUserContacts } from '../context/ChatActions'
import Contact from './Contact'
import {FaSearch} from 'react-icons/fa'
import {MdAdd} from 'react-icons/md'

function MyChats() {
  const {dispatch} = useContext(ChatContext)

  useEffect(() => {
    const fetchContactData = async () => {
      dispatch({type: 'SET_LOADING'})
    
      const userStorage = localStorage.getItem('user')
      const userId = JSON.parse(userStorage).user_id

      const contactsData = await (await getUserContacts(userId)).json()
      console.log(contactsData)
      dispatch({type: 'GET_USER_CONTACTS', payload: contactsData})
    }
    fetchContactData()
  }, [])
  
  return (
      // <div id="myChatsBody">
      //   {users 
      //     ? users.map((contact, index) => {
      //         return <Contact 
      //           name={contact.name} 
      //           key={index}/>
      //     })
      //     : <p>No contacts yet</p>
      //   }
      // </div>
      <h1>Chicken</h1>
  )
}

export default MyChats