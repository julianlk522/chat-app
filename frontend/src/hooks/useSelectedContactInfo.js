import { useState, useEffect, useContext } from 'react';
import ChatContext from '../context/ChatContext';

export const useSelectedContactInfo = () => {
  const { state } = useContext(ChatContext);
  const selectedContactId = state.selectedContact;

  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContactName, setSelectedContactName] = useState(null);
  const [selectedContactNickname, setSelectedContactNickname] = useState(null);
  const [selectedContactPreferedPic, setSelectedContactPreferedPic] =
    useState(null);
  const [selectedContactLastActive, setSelectedContactLastActive] =
    useState(null);
  const [selectedContactMessages, setSelectedContactMessages] = useState(null);

  useEffect(() => {
    //  update selectedContact with changes to selectedContactId
    if (selectedContactId) {
      setSelectedContact(
        state.userContacts.filter(contact => {
          return contact.user_id === state.selectedContact;
        })[0]
      );
    } else {
      setSelectedContact(null);
    }
    //  eslint-disable-next-line
  }, [selectedContactId]);

  //  update selectedContact info with changes to selectedContact
  useEffect(() => {
    if (selectedContact) {
      setSelectedContactMessages(
        state.messages && state.messages.length > 0
          ? state?.messages?.filter(message => {
              return (
                message.sender_id === selectedContactId ||
                message.receiver_id === selectedContactId
              );
            })
          : []
      );
      setSelectedContactNickname(
        state.nicknames.filter(nickname => {
          return nickname.contact_id === selectedContactId;
        })[0]?.nickname ?? null
      );
      setSelectedContactName(selectedContact.name);
      setSelectedContactPreferedPic(selectedContact.prefered_pic);
      setSelectedContactLastActive(selectedContact.last_active);
      //  reset if there is no selectedContact
    } else {
      setSelectedContactMessages([]);
      setSelectedContactNickname(null);
      setSelectedContactName(null);
      setSelectedContactPreferedPic(null);
      setSelectedContactLastActive(null);
    }
    //  eslint-disable-next-line
  }, [selectedContact, state.messages, state.nicknames]);

  return {
    selectedContactMessages,
    selectedContactName,
    selectedContactNickname,
    selectedContactPreferedPic,
    selectedContactLastActive,
  };
};
