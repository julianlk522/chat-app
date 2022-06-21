import React, { useContext } from 'react';
import ChatContext from '../context/ChatContext';
import {
  readContactMessages,
  getUserMostRecentMessagesFromContacts,
} from '../context/ChatActions';
import { formatDistanceToNowStrict } from 'date-fns';
import { RiGhostSmileLine } from 'react-icons/ri';

function Contact({ name, id, recentMessages }) {
  const { state, dispatch } = useContext(ChatContext);
  const selectedContact = state.selectedContact;
  const userId = state.user.user_id;

  return (
    <div
      className={`flex items-center p-4 ${
        selectedContact === id && 'bg-slate-200'
      }`}
      onClick={async () => {
        dispatch({ type: 'SET_SELECTED_CONTACT', payload: id });
        await readContactMessages(userId, id);
        const updatedRecentMessages = await (
          await getUserMostRecentMessagesFromContacts(userId)
        ).json();
        dispatch({
          type: 'GET_RECENT_MESSAGES_FROM_CONTACTS',
          payload: updatedRecentMessages,
        });
        dispatch({ type: 'RESET_DELETION_CUE' });
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
              return message.seen === 1 || message.sender_id === userId ? (
                <p key={index} className="w-16 text-center text-xs font-light">
                  {formatDistanceToNowStrict(new Date(message.created_at), {
                    includeSeconds: true,
                  })}
                </p>
              ) : (
                <p
                  key={index}
                  className="w-16 text-center text-xs text-red-600 font-bold"
                >
                  NEW!
                </p>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Contact;
