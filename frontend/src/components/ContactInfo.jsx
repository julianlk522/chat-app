import React, { useState, useEffect, useContext } from 'react';
import ChatContext from '../context/ChatContext';
import { assignNewNickname } from '../context/ChatActions';
import { useSelectedContactInfo } from '../hooks/useSelectedContactInfo';
import { toast } from 'react-toastify';
import { FiEdit2, FiCheckCircle } from 'react-icons/fi';
import genericPic from '../assets/genericPic.jpg';
import crazyGuyPic from '../assets/crazyGuyPic.jpg';
import trexPic from '../assets/trexPic.jpg';
import gorfPic from '../assets/gorfPic.jpg';

function ContactInfo() {
  const toastOptions = {
    autoClose: 4000,
    position: toast.POSITION.BOTTOM_RIGHT,
  };

  //  context
  const { state, dispatch } = useContext(ChatContext);
  const userId = state?.user?.user_id;
  const selectedContactId = state.selectedContact;

  const {
    selectedContactName,
    selectedContactNickname,
    selectedContactPreferedPic,
  } = useSelectedContactInfo();

  //  local state
  const [editNickname, setEditNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [nicknameReadyToSubmit, setNicknameReadyToSubmit] = useState(false);

  const [hideAlerts, setHideAlerts] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);

  useEffect(() => {
    if (newNickname.length >= 4) setNicknameReadyToSubmit(true);
    else setNicknameReadyToSubmit(false);
  }, [newNickname.length]);

  useEffect(() => {
    setEditNickname(false);
    setNewNickname('');
  }, [selectedContactId]);

  const handleNicknameSubmit = async () => {
    const newNickNameData = {
      user_id: userId,
      contact_id: selectedContactId,
      nickname: newNickname,
    };

    const newNickNameResponse = await assignNewNickname(newNickNameData);

    dispatch({ type: 'SET_NEW_NICKNAME', payload: newNickNameResponse });
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

        <div
          id="nickname"
          className="px-4 flex justify-between lg:justify-evenly items-center"
        >
          {!editNickname ? (
            <p className="font-bold text-2xl">
              {selectedContactNickname ? selectedContactNickname : 'The legend'}
            </p>
          ) : (
            <input
              className="border-2 border-solid border-slate-200 rounded-2xl text-center xl:w-[75%]"
              id="nickNameInput"
              placeholder="new nickname..."
              value={newNickname}
              onChange={e => {
                if (
                  e.target.value.indexOf('"') !== -1 ||
                  e.target.value.indexOf("'") !== -1
                ) {
                  return toast.error(
                    'Sorry, no quote characters allowed in your nickname!',
                    toastOptions
                  );
                }
                setNewNickname(e.target.value);
              }}
              onKeyDown={e => {
                if (nicknameReadyToSubmit && e.key === 'Enter') {
                  handleNicknameSubmit();
                  setEditNickname(!editNickname);
                  setNewNickname('');
                }
              }}
            />
          )}
          <button
            id="editNicknameIcon"
            className={`focus:outline-none py-2 rounded-full text-white self-center ${
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

      <div id="settings" className="px-4 my-4 rounded-2xl shadow-md">
        <div id="hideAlerts" className="py-4 flex justify-between">
          <p>Hide Alerts</p>
          <div
            className={`transition ease-in-out w-8 rounded-2xl flex cursor-pointer ${
              hideAlerts
                ? 'justify-end bg-lime-500'
                : 'justify-start bg-slate-300'
            }`}
            onClick={() => setHideAlerts(!hideAlerts)}
          >
            <div className="w-[70%] bg-white rounded-2xl border-solid border-[1px] border-slate-300"></div>
          </div>
        </div>
        <hr className="bg-black h-1 opacity-5 rounded-2xl" />
        <div id="sendReadReceipts" className="py-4 flex justify-between">
          <p>Send Read Receipts</p>
          <div
            className={`transition ease-in-out w-8 rounded-2xl flex cursor-pointer ${
              readReceipts
                ? 'justify-end bg-lime-500'
                : 'justify-start bg-slate-300'
            }`}
            onClick={() => setReadReceipts(!readReceipts)}
          >
            <div className="w-[70%] bg-white rounded-2xl border-solid border-[1px] border-slate-300"></div>
          </div>
        </div>
      </div>

      <div id="timeline">
        <h4 className="m-8 text-center">
          Timeline of {selectedContactName ?? 'Your contact'}
        </h4>

        <div id="photosContainer" className="px-4 my-4 rounded-2xl shadow-md">
          <p className="py-4">Photos and Videos</p>
          <hr className="bg-black h-1 opacity-5 rounded-2xl" />
          <div id="photos" className="py-4 flex justify-center overflow-hidden">
            <img
              src={trexPic}
              alt="sent by contact"
              className="w-[47.5%] object-contain mr-[5%]"
            />
            <img
              src={gorfPic}
              alt="sent by contact"
              className="w-[47.5%] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
