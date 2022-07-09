import React, { useContext } from 'react';
import ChatContext from '../context/ChatContext';
import {
  readContactMessages,
  getUserMostRecentMessagesFromContacts,
} from '../context/ChatActions';
import { formatDistanceToNowStrict } from 'date-fns';
import genericPic from '../assets/genericPic.jpg';
import crazyGuyPic from '../assets/crazyGuyPic.jpg';
import trexPic from '../assets/trexPic.jpg';
import gorfPic from '../assets/gorfPic.jpg';

function Contact({ name, id, recentMessage, prefered_pic }) {
  const { state, dispatch } = useContext(ChatContext);
  const selectedContact = state.selectedContact ?? '';
  const userId = state.user.user_id;

  return (
    <div
      className={`flex justify-evenly w-full items-center p-4 ${
        selectedContact === id && 'bg-slate-200'
      }`}
      onClick={async () => {
        dispatch({ type: 'SET_SELECTED_CONTACT', payload: id });
        await readContactMessages(userId, id);
        dispatch({ type: 'READ_CONTACT_MESSAGE', payload: id });
        // const updatedRecentMessages =
        //   await getUserMostRecentMessagesFromContacts(userId);
        // dispatch({
        //   type: 'GET_RECENT_MESSAGES_FROM_CONTACTS',
        //   payload: updatedRecentMessages[0],
        // });
        dispatch({ type: 'RESET_DELETION_CUE' });
      }}
    >
      <img
        src={
          prefered_pic === 1
            ? trexPic
            : prefered_pic === 2
            ? gorfPic
            : prefered_pic === 3
            ? crazyGuyPic
            : genericPic
        }
        alt="profile pic"
        className="rounded-full w-8 h-8 object-cover border-2 border-slate-300 border-opacity-50 mr-4"
      />
      <div className="w-full flex justify-between items-center">
        <div id="contactNameInfo">
          <h4>{name}</h4>

          <p className="text-xs font-light">{recentMessage.content}</p>
        </div>
        <div id="messageAge">
          {recentMessage.seen === 1 || recentMessage.sender_id === userId ? (
            <p className="w-16 text-center text-xs font-light">
              {formatDistanceToNowStrict(new Date(recentMessage.created_at), {
                includeSeconds: true,
              })}
            </p>
          ) : (
            <p className="w-16 text-center text-xs text-red-600 font-bold">
              NEW!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
