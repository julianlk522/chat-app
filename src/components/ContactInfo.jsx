import React, { useState, useContext } from 'react';
import ChatContext from '../context/ChatContext';
import { RiGhostSmileLine } from 'react-icons/ri';
import { FiEdit2, FiCheckCircle } from 'react-icons/fi';

function ContactInfo() {
  //  context
  const { state } = useContext(ChatContext);
  const selectedContactId = state.selectedContact;
  const selectedContactName = state.contacts.filter(contact => {
    return contact.user_id === selectedContactId;
  })[0]?.name;

  //  editNickname state
  const [editNickname, setEditNickname] = useState(false);

  //  newNickname state
  const [newNickname, setNewNickname] = useState('');

  //  nickname data from localstorage
  const nicknameStorage = JSON.parse(localStorage.getItem('nicknames'));
  console.log(nicknameStorage);

  return (
    <div id="contactInfo" className="w-1/4 p-4 flex flex-col">
      <div id="picArea" className="flex flex-col items-center">
        <RiGhostSmileLine id="contactPic" className="my-8 scale-[3]" />
      </div>

      <div id="nicknameArea" className="text-center">
        <h3 className="m-4">{selectedContactName}</h3>

        <div id="nickname" className="px-4 flex justify-between items-center">
          {!editNickname ? (
            <p>{nicknameStorage[selectedContactName] || 'The legend'}</p>
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
            className="bg-sky-600 hover:bg-sky-700 py-2 rounded-full text-white self-center"
            onClick={() => {
              if (newNickname.length <= 4) {
                setEditNickname(!editNickname);
                setNewNickname('');
              } else {
                localStorage.setItem(
                  'nicknames',
                  JSON.stringify({
                    ...nicknameStorage,
                    [selectedContactName]: newNickname,
                  })
                );
                setEditNickname(!editNickname);
                setNewNickname('');
              }
            }}
          >
            {newNickname.length <= 4 ? (
              <FiEdit2 className="mx-2" />
            ) : (
              <FiCheckCircle className="mx-2" />
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
        <h4 className="m-8 text-center">Timeline of Sneha</h4>

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
