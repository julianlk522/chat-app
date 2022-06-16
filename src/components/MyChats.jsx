import React, { useContext } from 'react';
import ChatContext from '../context/ChatContext';
import Contact from './Contact';
import { FaSearch } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';

function MyChats() {
  const { state } = useContext(ChatContext);
  const recentMessages = state.mostRecentMessages;

  return (
    <div id="myChatsBody">
      {state.contacts ? (
        state.contacts.map((contact, index) => {
          return (
            <Contact
              name={contact.name}
              id={contact.user_id}
              recentMessages={recentMessages}
              key={index}
            />
          );
        })
      ) : (
        <p>No contacts yet</p>
      )}
    </div>
  );
}

export default MyChats;
