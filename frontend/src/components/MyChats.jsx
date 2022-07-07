import React, { useState, useContext } from 'react';
import ChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import Contact from './Contact';
import { FaSearch } from 'react-icons/fa';
import { MdAdd } from 'react-icons/md';
import genericPic from '../assets/genericPic.jpg';
import crazyGuyPic from '../assets/crazyGuyPic.jpg';
import trexPic from '../assets/trexPic.jpg';
import gorfPic from '../assets/gorfPic.jpg';

function MyChats() {
  const { state, dispatch } = useContext(ChatContext);
  const recentMessages = state.mostRecentMessages;
  const navigate = useNavigate();

  return (
    <div id="myChatsBody" className="flex flex-col justify-between max-w-[30%]">
      <div
        id="contactsList"
        className="flex flex-col justify-center items-center"
      >
        <div
          id="myChatsTitleDiv"
          className="w-full h-[10vw] flex justify-evenly items-center"
        >
          <h3 id="myChatsTitle" className="text-xl">
            My Chats
          </h3>
          <button className="rounded-full bg-sky-600 hover:bg-sky-700 p-2 text-white">
            <MdAdd />
          </button>
        </div>
        {state.contacts.length ? (
          state.contacts.map((contact, index) => {
            return (
              <Contact
                name={contact.name}
                id={contact.user_id}
                recentMessages={recentMessages}
                prefered_pic={contact.prefered_pic}
                key={index}
              />
            );
          })
        ) : (
          <p>No contacts yet</p>
        )}
      </div>
      <div
        id="userProfileArea"
        className="py-4 flex flex-col justify-evenly items-center w-full h-[20%] border-t-2 border-t-slate-300"
      >
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
            className="rounded-full w-16 h-16 object-cover border-2 border-slate-300 border-opacity-50"
          />

          <p id="userName" className="text-xl text-center font-bold ml-8">
            {state.user.name}
          </p>
        </div>

        <button
          className="rounded-2xl bg-red-600 hover:bg-red-700 p-2 w-1/3"
          onClick={e => {
            e.preventDefault();
            dispatch({ type: 'LOGOUT_USER' });
            localStorage.removeItem('chatUser');
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
