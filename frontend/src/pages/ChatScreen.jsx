import React, { useContext, useEffect } from 'react';
import ChatContext from '../context/ChatContext';
import {
  getUserMessages,
  getSortedUserContacts,
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
    const checkIfUser = async () => {
      const storage = localStorage.getItem('chatUser');

      //  if localstorage data, set user state to that
      if (storage) {
        dispatch({ type: 'SET_USER', payload: JSON.parse(storage) });

        //  retrieve messages
        const userId = JSON.parse(storage).user_id;
        const messagesData = await getUserMessages(userId);
        dispatch({ type: 'SET_USER_MESSAGES', payload: messagesData[0] });

        //  retrieve contacts
        const contactsData = await getSortedUserContacts(userId);
        if (contactsData[0].length > 0) {
          dispatch({
            type: 'SET_USER_CONTACTS',
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
        dispatch({ type: 'SET_CONTACT_NICKNAMES', payload: nicknamesData });

        //  redirect if no existing localStorage data
      } else {
        navigate('/auth');
      }
    };

    checkIfUser();
  }, [dispatch, navigate]);

  return (
    <>
      <div
        id="bgWrapper"
        className="bg-mainBg h-full w-full z-[-1] fixed opacity-40"
      ></div>
      <div className="flex justify-between h-full">
        <MyChats />
        <Conversation />
        <ContactInfo />
      </div>
    </>
  );
}

export default ChatScreen;
