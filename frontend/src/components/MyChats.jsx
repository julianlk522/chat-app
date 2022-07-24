import React, { useState, useContext, useEffect, useRef } from 'react';
import ChatContext from '../context/ChatContext';
import { getAllContacts } from '../context/ChatActions';
import Contact from './Contact';
import Select from 'react-select';
import { sortContactsArrByRecentMessages } from './utils/sortContactsArrByRecentMessages';
import { MdAdd } from 'react-icons/md';
import { FiMinus } from 'react-icons/fi';
import UserInfo from './UserInfo';

function MyChats() {
  const scrollRef = useRef(null);

  const { state, dispatch } = useContext(ChatContext);
  const userContactsIds = state.userContacts.map(userContact => {
    return userContact.user_id;
  });

  const [readyToInputNewContacts, setReadyToInputNewContacts] = useState(false);

  //  fetch contact data on load
  useEffect(() => {
    const fetchContactsData = async () => {
      const contactsData = await getAllContacts();
      dispatch({
        type: 'SET_ALL_CONTACTS',
        payload: contactsData[0].filter(contact => {
          return (
            //  filter out user's contact data
            contact.user_id !== state.user?.user_id
          );
        }),
      });
    };
    fetchContactsData();
  }, [dispatch, state.user?.user_id, state.userContacts]);

  //  set readyToInputNewContacts to false if userContacts changes
  useEffect(() => {
    setReadyToInputNewContacts(false);
  }, [state.userContacts]);

  // scroll contacts list to the top when a userContact is added or removed
  useEffect(() => {
    scrollRef.current.scrollIntoView(false);
  }, [state.userContacts.length]);

  return (
    <div
      id="myChatsContainer"
      className="flex flex-grow flex-col justify-between max-w-[30%]"
    >
      <div
        id="myChatsBody"
        className="flex flex-col grow items-center overflow-hidden"
      >
        <div
          id="myChatsTitleDiv"
          className="w-full h-[10vh] py-8 flex justify-evenly items-center"
        >
          <h3 id="myChatsTitle" className="text-xl">
            My Chats
          </h3>
          <button
            id="addContact"
            className={`rounded-full p-2 text-white focus:outline-none ${
              !readyToInputNewContacts
                ? 'bg-sky-600 hover:bg-sky-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
            onClick={e => {
              e.preventDefault();
              setReadyToInputNewContacts(!readyToInputNewContacts);
            }}
          >
            {readyToInputNewContacts ? <FiMinus /> : <MdAdd />}
          </button>
        </div>

        {/* show contacts search if selected */}
        {readyToInputNewContacts && (
          <Select
            className="w-full mb-4 text-center"
            options={state.contacts
              //  filter out contacts with existing conversations
              ?.filter(contact => {
                return !userContactsIds.includes(contact.user_id);
              })
              ?.map(contact => {
                return {
                  value: contact.user_id,
                  label: contact.name,
                };
              })}
            placeholder="Select a contact to add"
            noOptionsMessage={() => 'No contacts found with specified name'}
            onChange={e => {
              dispatch({
                type: 'SET_SELECTED_CONTACT',
                payload: e.value,
              });
            }}
          />
        )}

        {!readyToInputNewContacts && (
          <hr className="bg-black h-1 opacity-5 rounded-2xl w-[80%] self-center mb-2" />
        )}

        {/* contacts list */}
        <div
          id="contactsList"
          className="w-full overflow-y-scroll"
          onClick={() => setReadyToInputNewContacts(false)}
        >
          <div id="scrollRefDiv" ref={scrollRef}></div>
          {state.userContacts?.length ? (
            sortContactsArrByRecentMessages(state.userContacts).map(
              (contact, idx) => {
                return (
                  <Contact
                    key={idx}
                    name={contact.name}
                    id={contact.user_id}
                    recentMessage={contact.recentMessage}
                    preferedPic={contact.prefered_pic}
                  />
                );
              }
            )
          ) : (
            <p className="my-8 text-center">No contacts yet.</p>
          )}
        </div>
      </div>
      <UserInfo />
    </div>
  );
}

export default MyChats;
