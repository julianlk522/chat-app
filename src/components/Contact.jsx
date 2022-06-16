import React from 'react';
import { RiGhostSmileLine } from 'react-icons/ri';

function Contact({ name }) {
  return (
    <div className="contact">
      <RiGhostSmileLine className="contactPic" />
      <div className="contactBody">
        <div className="contactNameInfo">
          <h4>{name}</h4>
          {/* {messages
            .filter(message => message.name === name)
            .map(recentMessage => {
              return <p>{recentMessage.content}</p>;
            })} */}
          <p className="lastMessage">The last thing I said...</p>
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
