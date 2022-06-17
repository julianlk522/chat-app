import React, { useContext } from 'react';
import ChatContext from '../context/ChatContext';
import { formatDistanceToNowStrict } from 'date-fns';
import { RiGhostSmileLine } from 'react-icons/ri';

function Contact({ name, id, recentMessages }) {
  const { state, dispatch } = useContext(ChatContext);
  const selectedContact = state.selectedContact;

  return (
    <div
      className="flex items-center p-4"
      onClick={() => {
        dispatch({ type: 'SET_SELECTED_CONTACT', payload: id });
      }}
      style={{
        backgroundColor: selectedContact === id ? '#79c2fc' : '',
      }}
    >
      <RiGhostSmileLine className="mr-4" />
      <div className="w-full flex justify-between items-center">
        <div id="contactNameInfo">
          <h4>{name}</h4>
          {recentMessages
            .filter(message => message.name === name)
            .map((message, index) => {
              return (
                <p key={index} className="text-xs font-light">
                  {message.content}
                </p>
              );
            })}
        </div>
        <div id="messageAge">
          {recentMessages
            .filter(message => message.name === name)
            .map((message, index) => {
              return (
                <p key={index} className="w-16 text-center text-xs font-light">
                  {formatDistanceToNowStrict(new Date(message.created_at), {
                    includeSeconds: true,
                  })}
                </p>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Contact;
