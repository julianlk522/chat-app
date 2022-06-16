import React, { useContext } from 'react';
import ChatContext from '../context/ChatContext';
import { MdCall, MdVideoCall, MdSend, MdAttachment } from 'react-icons/md';
import Message from './Message';

function Conversation() {
  const { state } = useContext(ChatContext);
  const currentUserId = state.user.user_id;
  const selectedContactId = state.selectedContact;
  const messages = state.messages.filter(message => {
    return (
      message.sender_id === selectedContactId ||
      message.receiver_id === selectedContactId
    );
  });

  return (
    <div id="conversation">
      <div id="conversationHeader">
        <div id="recipientNameArea">
          <h3 id="recipientName" className="text-3xl">
            Sneha
          </h3>
          <div id="onlineStatus"></div>
          <span id="typingStatus">typing...</span>
        </div>

        <div id="contactOptions">
          <MdCall className="contactOption" />
          <MdVideoCall className="contactOption" />
        </div>
      </div>

      <div id="conversationBody">
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

      <div id="conversationTypingArea">
        <input
          type="text"
          placeholder="Type something to send..."
          id="typingAreaInput"
        />
        <div id="typingAreaIcons">
          <MdSend className="typingAreaIcon" />
          <MdAttachment className="typingAreaIcon" />
        </div>
      </div>
    </div>
  );
}

export default Conversation;
