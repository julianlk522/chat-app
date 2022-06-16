import React, { useContext } from 'react';
import ChatContext from '../context/ChatContext';
import { formatDistanceToNowStrict } from 'date-fns';
import { RiGhostSmileLine } from 'react-icons/ri';

function Contact({ name, id, recentMessages }) {
  const { state, dispatch } = useContext(ChatContext);
  const selectedContact = state.selectedContact;

  return (
    <div
      className="contact"
      onClick={() => {
        dispatch({ type: 'SET_SELECTED_CONTACT', payload: id });
      }}
      style={{
        backgroundColor: selectedContact === id ? '#79c2fc' : '',
      }}
    >
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
          <div className="newMessages">
            {/* <p>2 mins</p> */}
            {recentMessages
              .filter(message => message.name === name)
              .map((message, index) => {
                return (
                  <p key={index}>
                    {formatDistanceToNowStrict(new Date(message.created_at), {
                      includeSeconds: true,
                    })}
                  </p>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
