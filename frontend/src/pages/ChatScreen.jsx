import React, { useContext, useEffect } from 'react';
import ChatContext from '../context/ChatContext';
import {
  getUserMessages,
  getUserContacts,
  getUserNicknames,
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
      const storage = localStorage.getItem('chatUser');
      if (storage) {
        //  set user state to localstorage data
        dispatch({ type: 'SET_USER', payload: JSON.parse(storage) });
        const userId = JSON.parse(storage).user_id;
        dispatch({ type: 'SET_LOADING' });
        //  retrieve user messages
        const messagesData = await getUserMessages(userId);
        dispatch({ type: 'GET_USER_MESSAGES', payload: messagesData[0] });
        //  retrieve user contacts
        const contactsData = await getUserContacts(userId);
        if (contactsData[0].length > 0) {
          dispatch({
            type: 'GET_USER_CONTACTS',
            payload: contactsData[0].map(contactData => {
              return {
                name: contactData.name,
                user_id: contactData.user_id,
                prefered_pic: contactData.prefered_pic,
                recentMessage: {
                  content: contactData.content,
                  created_at: contactData.created_at,
                  seen: contactData.seen,
                  sender_id: contactData.sender_id,
                },
                last_active: contactData.last_active,
              };
            }),
          });
        }
        //  retrieve contact nicknames
        const nicknamesData = await getUserNicknames(userId);
        dispatch({ type: 'GET_CONTACT_NICKNAMES', payload: nicknamesData });
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
