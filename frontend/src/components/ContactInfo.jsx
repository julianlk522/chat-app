import React, { useState, useContext } from 'react';
import ChatContext from '../context/ChatContext';
import { assignNewNickname } from '../context/ChatActions';
import { RiGhostSmileLine } from 'react-icons/ri';
import { FiEdit2, FiCheckCircle } from 'react-icons/fi';
import genericPic from '../assets/genericPic.jpg';
import crazyGuyPic from '../assets/crazyGuyPic.jpg';
import trexPic from '../assets/trexPic.jpg';
import gorfPic from '../assets/gorfPic.jpg';
import { useEffect } from 'react';

function ContactInfo() {
  //  context
  const { state, dispatch } = useContext(ChatContext);
  const userId = state?.user?.user_id;
  const selectedContact = state.userContacts.filter(contact => {
    return contact.user_id === state.selectedContact;
  })[0];
  const selectedContactName = selectedContact?.name;
  const selectedContactId = state.selectedContact;
  const selectedContactPreferedPic = selectedContact?.prefered_pic;
  const selectedContactNickname = state?.nicknames?.filter(nickname => {
    return nickname.contact_id === selectedContactId;
  })[0]?.nickname;

  //  local state
  const [editNickname, setEditNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [nicknameReadyToSubmit, setNicknameReadyToSubmit] = useState(false);

  useEffect(() => {
    if (newNickname.length >= 4) setNicknameReadyToSubmit(true);
    else setNicknameReadyToSubmit(false);
  }, [newNickname.length]);

  const handleNicknameSubmit = async () => {
    const newNickNameData = {
      user_id: userId,
      contact_id: selectedContactId,
      nickname: newNickname,
    };

    const newNickNameResponse = await assignNewNickname(newNickNameData);
    console.log(newNickNameResponse);
    dispatch({ type: 'ASSIGN_NEW_NICKNAME', payload: newNickNameResponse });
  };

  return (
    <div id="contactInfo" className="w-1/4 p-4 flex flex-col">
      <div id="picArea" className="flex flex-col items-center">
        <img
          src={
            selectedContactPreferedPic === 1
              ? trexPic
              : selectedContactPreferedPic === 2
              ? gorfPic
              : selectedContactPreferedPic === 3
              ? crazyGuyPic
              : genericPic
          }
          alt="profile pic"
          className="rounded-full w-32 h-32 object-cover border-2 border-slate-300 border-opacity-50"
        />
      </div>

      <div id="nicknameArea" className="text-center">
        <h3 className="m-4">{selectedContactName ?? ''}</h3>

        <div id="nickname" className="px-4 flex justify-between items-center">
          {!editNickname ? (
            <p className="font-bold">
              {selectedContactNickname ? selectedContactNickname : 'The legend'}
            </p>
          ) : (
            <input
              type="text"
              id="nickNameInput"
              placeholder="new nickname..."
              value={newNickname}
              onChange={e => setNewNickname(e.target.value)}
              className="border-2 border-solid border-slate-200 rounded-2xl text-center"
            />
          )}
          <button
            id="editNicknameIcon"
            className={`py-2 rounded-full text-white self-center ${
              editNickname
                ? nicknameReadyToSubmit
                  ? 'bg-lime-500'
                  : 'bg-red-600 hover:bg-red-700'
                : 'bg-sky-600 hover:bg-sky-700'
            }`}
            onClick={() => {
              nicknameReadyToSubmit && handleNicknameSubmit();
              setEditNickname(!editNickname);
              setNewNickname('');
            }}
          >
            {nicknameReadyToSubmit ? (
              <FiCheckCircle className="mx-2" />
            ) : (
              <FiEdit2 className="mx-2" />
            )}
          </button>
        </div>
      </div>

      <div id="settings" className="px-4 my-4 bg-slate-200 rounded-2xl">
        <div id="hideAlerts" className="py-4 flex justify-between">
          <p>Hide Alerts</p>
          <div className="w-[15%] bg-lime-500 rounded-2xl flex justify-end cursor-pointer">
            <div className="w-[60%] bg-white rounded-2xl border-solid border-[1px] border-slate-300"></div>
          </div>
        </div>
        <hr />
        <div id="sendReadReceipts" className="py-4 flex justify-between">
          <p>Send Read Receipts</p>
          <div className="w-[15%] bg-lime-500 rounded-2xl flex justify-end cursor-pointer">
            <div className="w-[60%] bg-white rounded-2xl border-solid border-[1px] border-slate-300"></div>
          </div>
        </div>
      </div>

      <div id="timeline">
        <h4 className="m-8 text-center">
          Timeline of {selectedContactName ?? ''}
        </h4>

        <div
          id="photosContainer"
          className="px-4 my-4 bg-slate-200 rounded-2xl"
        >
          <p className="py-4">Photos and Videos</p>
          <hr />
          <div id="photos" className="py-4 flex justify-center">
            <RiGhostSmileLine />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
