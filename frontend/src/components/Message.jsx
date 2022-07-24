import React, { useState, useContext, useEffect } from 'react';
import ChatContext from '../context/ChatContext';
import { fetchPreferedPic } from '../components/utils/fetchPreferedPic';

function Message({
  messageId,
  senderId,
  currentUserId,
  currentUserPreferedPic,
  selectedContactId,
  selectedContactPreferedPic,
  content,
  editMode,
}) {
  const { dispatch } = useContext(ChatContext);

  const [queuedForDelete, setQueuedForDelete] = useState(false);

  useEffect(() => {
    setQueuedForDelete(false);
  }, [editMode, selectedContactId]);

  return (
    <>
      {/* user's message */}
      {senderId === currentUserId ? (
        <div
          className="flex justify-end items-center"
          onClick={() => {
            if (editMode) {
              setQueuedForDelete(!queuedForDelete);
              if (!queuedForDelete) {
                dispatch({ type: 'CUE_FOR_DELETION', payload: messageId });
              } else {
                dispatch({
                  type: 'REMOVE_FROM_DELETION_CUE',
                  payload: messageId,
                });
              }
            } else {
              return;
            }
          }}
        >
          {/* deletion cue toggle button */}
          {editMode && (
            <div
              className={`h-4 w-4 ml-8 rounded-full ${
                queuedForDelete ? 'bg-red-700' : 'border-2 border-slate-500'
              }`}
            ></div>
          )}

          <div className="p-4 my-4 ml-8 bg-sky-300 rounded-2xl break-words">
            <p>{content}</p>
          </div>
          <img
            src={fetchPreferedPic(currentUserPreferedPic)}
            alt="profile pic"
            className="rounded-full h-8 w-8 mx-4 object-cover"
          />
        </div>
      ) : (
        //  contact's message
        <div className="flex grow items-center">
          <img
            src={fetchPreferedPic(selectedContactPreferedPic)}
            alt="profile pic"
            className="rounded-full h-8 w-8 mx-4 object-cover"
          />
          <div className="p-4 my-4 mr-4 bg-slate-200 rounded-2xl break-words">
            <p>{content}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Message;
