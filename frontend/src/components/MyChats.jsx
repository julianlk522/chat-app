import React, { useState, useContext, useEffect } from 'react';
import ChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { assignNewPreferedPic, getAllContacts } from '../context/ChatActions';
import Contact from './Contact';
import genericPic from '../assets/genericPic.jpg';
import crazyGuyPic from '../assets/crazyGuyPic.jpg';
import trexPic from '../assets/trexPic.jpg';
import gorfPic from '../assets/gorfPic.jpg';
import { MdAdd } from 'react-icons/md';
import { FiMinus } from 'react-icons/fi';
import Select from 'react-select';

function MyChats() {
  const { state, dispatch } = useContext(ChatContext);
  const navigate = useNavigate();

  const [readyToInputNewContacts, setReadyToInputNewContacts] = useState(false);
  const [editPreferedPic, setEditPreferedPic] = useState(false);
  const [preferedPicSelected, setPreferedPicSelected] = useState(null);

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

  //  sort contacts based on recentMessage age
  const handleSort = userContactArr => {
    return userContactArr.sort((a, b) => {
      if (a.recentMessage?.created_at > b.recentMessage?.created_at) return -1;
      if (b.recentMessage?.created_at > a.recentMessage?.created_at) return 1;
      else return 0;
    });
  };

  const userContactsIds = state.userContacts.map(userContact => {
    return userContact.user_id;
  });

  return (
    <div
      id="myChatsBody"
      className="flex flex-grow flex-col justify-between max-w-[30%]"
    >
      <div
        id="contactsList"
        className="flex flex-col justify-center items-center overflow-hidden"
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
            closeMenuOnSelect
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
          className="overflow-y-scroll"
          onClick={() => setReadyToInputNewContacts(false)}
        >
          {state.userContacts?.length ? (
            handleSort(state.userContacts).map((contact, idx) => {
              return (
                <Contact
                  key={idx}
                  name={contact.name}
                  id={contact.user_id}
                  recentMessage={contact.recentMessage}
                  prefered_pic={contact.prefered_pic}
                />
              );
            })
          ) : (
            <p>No contacts yet.</p>
          )}
        </div>
      </div>
      <div
        id="userProfileArea"
        className="py-4 flex flex-col justify-evenly items-center w-full h-[20%] border-t-2 border-t-slate-300"
      >
        {!editPreferedPic ? (
          <div
            id="nameAndPicDiv"
            className="flex justify-evenly items-center mb-4"
          >
            <img
              src={
                state.user.prefered_pic === 1
                  ? trexPic
                  : state.user.prefered_pic === 2
                  ? gorfPic
                  : state.user.prefered_pic === 3
                  ? crazyGuyPic
                  : genericPic
              }
              alt="profile pic"
              className="rounded-full w-16 h-16 object-cover border-2 border-slate-300 border-opacity-50 hover:opacity-50 cursor-pointer"
              onClick={() => setEditPreferedPic(!editPreferedPic)}
            />

            <p id="userName" className="text-xl text-center font-bold ml-8">
              {state.user.name}
            </p>
          </div>
        ) : (
          <div
            id="profilePicSelectionDiv"
            className="flex justify-evenly items-center w-full"
          >
            <img
              src={trexPic}
              alt="pic1"
              className={`rounded-full w-12 h-12 object-cover border-2 border-slate-300 border-opacity-50 opacity-50 ${
                preferedPicSelected === 1 && 'opacity-100'
              }`}
              onClick={() => {
                if (preferedPicSelected !== 1) setPreferedPicSelected(1);
                else setPreferedPicSelected(null);
              }}
            />

            <img
              src={gorfPic}
              alt="pic2"
              className={`rounded-full w-12 h-12 object-cover border-2 border-slate-300 border-opacity-50 opacity-50 ${
                preferedPicSelected === 2 && 'opacity-100'
              }`}
              onClick={() => {
                if (preferedPicSelected !== 2) setPreferedPicSelected(2);
                else setPreferedPicSelected(null);
              }}
            />
            <img
              src={crazyGuyPic}
              alt="pic3"
              className={`rounded-full w-12 h-12 object-cover border-2 border-slate-300 border-opacity-50 opacity-50 ${
                preferedPicSelected === 3 && 'opacity-100'
              }`}
              onClick={() => {
                if (preferedPicSelected !== 3) setPreferedPicSelected(3);
                else setPreferedPicSelected(null);
              }}
            />
            <img
              src={genericPic}
              alt="pic4"
              className={`rounded-full w-12 h-12 object-cover border-2 border-slate-300 border-opacity-50 opacity-50 ${
                preferedPicSelected === 4 && 'opacity-100'
              }`}
              onClick={() => {
                if (preferedPicSelected !== 4) setPreferedPicSelected(4);
                else setPreferedPicSelected(null);
              }}
            />
          </div>
        )}
        {!editPreferedPic ? (
          <button
            className="focus:outline-none rounded-2xl bg-red-600 hover:bg-red-700 p-2 w-1/3 text-white"
            onClick={e => {
              e.preventDefault();
              dispatch({ type: 'LOGOUT_USER' });
              localStorage.removeItem('chatUser');
              navigate('/sign-in');
            }}
          >
            Logout
          </button>
        ) : (
          <button
            className={`rounded-2xl p-2 ${!editPreferedPic && 'w-1/3'} ${
              editPreferedPic &&
              preferedPicSelected !== null &&
              preferedPicSelected !== state.user.prefered_pic
                ? 'bg-lime-500'
                : 'bg-red-600 hover:bg-red-700'
            }`}
            onClick={() => {
              if (
                editPreferedPic &&
                preferedPicSelected &&
                preferedPicSelected !== state.user.prefered_pic
              ) {
                assignNewPreferedPic(state.user.user_id, preferedPicSelected);
                dispatch({
                  type: 'SET_NEW_PREFERED_PIC',
                  payload: preferedPicSelected,
                });
              }
              setEditPreferedPic(!editPreferedPic);
              setPreferedPicSelected(null);
            }}
          >
            {preferedPicSelected &&
            preferedPicSelected !== state.user.prefered_pic
              ? 'Confirm new avatar selection'
              : 'Actually I like this avatar'}
          </button>
        )}
      </div>
    </div>
  );
}

export default MyChats;
