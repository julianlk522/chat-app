import React, { useState, useContext } from 'react';
import ChatContext from '../context/ChatContext';
import {
  createNewMessage,
  getUserMostRecentMessagesFromContacts,
} from '../context/ChatActions';
import {
  MdCall,
  MdVideoCall,
  MdSend,
  MdAttachment,
  MdDelete,
} from 'react-icons/md';
import Message from './Message';

function Conversation() {
  //  context (user, messages, selectedContact, queuedForDelete)
  const { state, dispatch } = useContext(ChatContext);
  const currentUserId = state.user.user_id;
  const selectedContactId = state.selectedContact;
  const selectedContactName = state.contacts.filter(contact => {
    return contact.user_id === selectedContactId;
  })[0]?.name;
  const messages =
    state.messages && state.messages.length > 0
      ? state?.messages?.filter(message => {
          return (
            message.sender_id === selectedContactId ||
            message.receiver_id === selectedContactId
          );
        })
      : [];
  const queuedForDeleteArray = state.queuedForDelete;
  //  newMessage state
  const [newMessage, setNewMessage] = useState('');

  //  editMode state
  const [editMode, setEditMode] = useState(false);

  //  change newMessage state to user input unless there are quote characters
  const onNewMessageChange = e => {
    if (
      e.target.value.indexOf('"') !== -1 ||
      e.target.value.indexOf("'") !== -1
    ) {
      console.log('no quote charactes allowed!');
      return;
    }
    setNewMessage(e.target.value);
  };

  //  create new message
  const submitMessage = async e => {
    e.preventDefault();
    dispatch({ type: 'SET_LOADING' });
    const updatedMessages = await (
      await createNewMessage(currentUserId, selectedContactId, newMessage)
    ).json();
    dispatch({ type: 'NEW_MESSAGE', payload: updatedMessages });
    const updatedContactMsgData = await (
      await getUserMostRecentMessagesFromContacts(currentUserId)
    ).json();
    dispatch({
      type: 'GET_RECENT_MESSAGES_FROM_CONTACTS',
      payload: updatedContactMsgData,
    });
  };

  return (
    <div
      id="conversation"
      className="flex flex-col w-1/2 border-2 border-slate-300 overflow-hidden"
    >
      <div
        id="convoHeader"
        className="flex justify-between items-center h-[10%] p-8"
      >
        <div
          id="recipientNameArea"
          className="flex justify-center items-center"
        >
          <h3 className="text-3xl mr-4 min-w-[33%]">{selectedContactName}</h3>
          <div
            id="onlineStatusDot"
            className="bg-emerald-500 inline-block w-4 h-4 rounded-full scale-75"
          ></div>
          <span id="typingStatus" className="mx-4">
            typing...
          </span>
        </div>

        <div id="contactOptions" className="flex">
          <button
            className={`mr-4 ${
              !editMode
                ? 'bg-sky-600 hover:bg-sky-700'
                : 'bg-red-600 hover:bg-red-700'
            } py-2 rounded-full text-white`}
            onClick={() => {
              setEditMode(!editMode);
              dispatch({ type: 'RESET_DELETION_CUE' });
            }}
          >
            <MdDelete className="mx-2" />
          </button>

          <button className="mr-4 bg-sky-600 hover:bg-sky-700 py-2 rounded-full text-white">
            <MdCall className="mx-2" />
          </button>

          <button className="bg-sky-600 hover:bg-sky-700 py-2 rounded-full text-white">
            <MdVideoCall className="mx-2" />
          </button>
        </div>
      </div>

      <div id="conversationBody" className="h-4/5">
        {messages &&
          messages.map((message, index) => {
            return (
              <Message
                messageId={message.message_id}
                senderId={message.sender_id}
                currentUserId={currentUserId}
                content={message.content}
                editMode={editMode}
                key={index}
              />
            );
          })}
      </div>

      <div
        id="conversationTypingArea"
        className="bg-slate-200 self-end w-full h-[10%] flex justify-between items-center p-8"
      >
        <input
          type="text"
          value={newMessage}
          placeholder="Type something to send..."
          onChange={onNewMessageChange}
          id="typingAreaInputBox"
          className="w-full mr-8 px-4 outline-slate-200 rounded-xl"
        />
        <div id="typingAreaIcons" className="flex justify-between">
          <button
            className="bg-sky-600 hover:bg-sky-700 py-2 rounded-full text-white mr-4"
            onClick={submitMessage}
          >
            <MdSend className="mx-2 min-w-[1rem] min-h-[1rem]" />
          </button>

          <button className="bg-sky-600 hover:bg-sky-700 py-2 rounded-full text-white">
            <MdAttachment className="mx-2 min-w-[1rem] min-h-[1rem]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
