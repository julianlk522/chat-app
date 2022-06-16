import React from 'react';
import { RiGhostSmileFill, RiGhostSmileLine } from 'react-icons/ri';

function Message({ senderId, currentUserId, content }) {
  return (
    <>
      {senderId !== currentUserId ? (
        <div className="message">
          <RiGhostSmileLine className="messagePic" />
          <div className="messageBody">
            <p>{content}</p>
          </div>
        </div>
      ) : (
        <div className="message messageUser">
          <div className="messageBodyUser">
            <p>{content}</p>
          </div>
          <RiGhostSmileFill className="messagePic" />
        </div>
      )}
    </>
  );
}

export default Message;
