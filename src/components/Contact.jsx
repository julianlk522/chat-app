import React from 'react';
import { RiGhostSmileLine } from 'react-icons/ri';

function Contact({ name, recentMessages }) {
  return (
    <div className="contact">
      <RiGhostSmileLine className="contactPic" />
      <div className="contactBody">
        <div className="contactNameInfo">
          <h4>{name}</h4>
          {recentMessages
            .filter(message => message.name === name)
            .map((message, index) => {
              return <p key={index}>{message.content}</p>;
            })}
        </div>
        <div className="contactBodyMsgInfo">
          <div className="newMessages"></div>
          <p>2 mins</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
