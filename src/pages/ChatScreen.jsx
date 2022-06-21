import React, { useContext, useEffect } from 'react';
import ChatContext from '../context/ChatContext';
import {
  getUserMessages,
  getUserContacts,
  getUserMostRecentMessagesFromContacts,
} from '../context/ChatActions';
import MyChats from '../components/MyChats';
import Conversation from '../components/Conversation';
import ContactInfo from '../components/ContactInfo';
import { useNavigate } from 'react-router-dom';

function ChatScreen() {
  const { dispatch } = useContext(ChatContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const storage = localStorage.getItem('user');
      if (storage) {
        //  set user state to localstorage data
        dispatch({ type: 'SET_USER', payload: JSON.parse(storage) });
        const userId = JSON.parse(storage).user_id;
        dispatch({ type: 'SET_LOADING' });
        //  retrieve user messages
        const userMessages = await (await getUserMessages(userId)).json();
        dispatch({ type: 'GET_USER_MESSAGES', payload: userMessages });
        //  retrieve user contacts
        const contactsData = await (await getUserContacts(userId)).json();
        if (contactsData.length > 0) {
          dispatch({ type: 'GET_USER_CONTACTS', payload: contactsData });
          //  retrieve recent messages from each contact
          const contactMsgData = await (
            await getUserMostRecentMessagesFromContacts(userId)
          ).json();
          dispatch({
            type: 'GET_RECENT_MESSAGES_FROM_CONTACTS',
            payload: contactMsgData,
          });
        }
      } else {
        navigate('/sign-up');
      }
    };
    checkUser();
  }, [dispatch, navigate]);

  return (
    <div className="flex justify-between h-full">
      <MyChats />
      <Conversation />
      <ContactInfo />
    </div>
  );
}

export default ChatScreen;
