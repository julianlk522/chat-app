import React, { useContext } from 'react';
import ChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import Contact from './Contact';
import { FaSearch } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';

function MyChats() {
  const { state, dispatch } = useContext(ChatContext);
  const recentMessages = state.mostRecentMessages;
  const navigate = useNavigate();

  return (
    <div id="myChatsBody" className="flex flex-col flex-grow justify-between">
      <div id="contactsList">
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
      <div
        id="buttonContainer"
        className="flex justify-center items-center w-full min-h-[10%]"
      >
        <button
          className="rounded-2xl bg-amber-700 p-2 w-1/3"
          onClick={e => {
            e.preventDefault();
            dispatch({ type: 'LOGOUT_USER' });
            navigate('/sign-in');
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default MyChats;
