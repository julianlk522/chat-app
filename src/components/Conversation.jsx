import React, { useContext } from 'react';
import ChatContext from '../context/ChatContext';
import { MdCall, MdVideoCall, MdSend, MdAttachment } from 'react-icons/md';
import Message from './Message';

function Conversation() {
  const { state } = useContext(ChatContext);
  const currentUserId = state.user.user_id;
  const selectedContactId = state.selectedContact;
  const selectedContactName = state.contacts.filter(contact => {
    return contact.user_id === selectedContactId;
  })[0]?.name;
  const messages = state.messages.filter(message => {
    return (
      message.sender_id === selectedContactId ||
      message.receiver_id === selectedContactId
    );
  });

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
          <h3 className="text-3xl mx-4 min-w-[33%]">{selectedContactName}</h3>
          <div
            id="onlineStatusDot"
            className="bg-emerald-500 inline-block w-4 h-4 rounded-full scale-75"
          ></div>
          <span id="typingStatus" className="mx-4">
            typing...
          </span>
        </div>

        <div id="contactOptions" className="flex">
          <MdCall className="mx-4" />
          <MdVideoCall className="mx-4" />
        </div>
      </div>

      <div id="conversationBody" className="h-4/5">
        {messages &&
          messages.map((message, index) => {
            return (
              <Message
                senderId={message.sender_id}
                currentUserId={currentUserId}
                content={message.content}
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
          placeholder="Type something to send..."
          id="typingAreaInputBox"
          className="w-full mr-8"
        />
        <div id="typingAreaIcons" className="flex justify-between">
          <MdSend className="mx-4 min-w-[1rem] min-h-[1rem]" />
          <MdAttachment className="mx-4 min-w-[1rem] min-h-[1rem]" />
        </div>
      </div>
    </div>
  );
}

export default Conversation;
