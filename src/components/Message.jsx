import React, { useState, useContext, useEffect } from 'react';
import ChatContext from '../context/ChatContext';
import { RiGhostSmileFill, RiGhostSmileLine, TiDelete } from 'react-icons/ri';

function Message({
  messageId,
  senderId,
  currentUserId,
  selectedContactId,
  content,
  editMode,
}) {
  const [queuedForDelete, setQueuedForDelete] = useState(false);

  const { dispatch } = useContext(ChatContext);

  //  refresh queuedForDelete when editMode changes
  useEffect(() => {
    setQueuedForDelete(false);
  }, [editMode, selectedContactId]);

  return (
    <>
      {senderId !== currentUserId ? (
        //  not user's message
        <div className="flex">
          <RiGhostSmileLine className="mx-4 self-center min-w-[1rem] min-h-[1rem]" />
          <div className="p-4 my-4 bg-slate-200 rounded-2xl break-words">
            <p>{content}</p>
          </div>
        </div>
      ) : (
        //  user's message
        <div
          className="flex justify-end items-center"
          onClick={() => {
            if (!editMode) {
              return;
              //  toggle cue for deletion on click only if editMode enabled
            } else {
              setQueuedForDelete(!queuedForDelete);
              if (!queuedForDelete) {
                dispatch({ type: 'CUE_FOR_DELETION', payload: messageId });
              } else {
                dispatch({
                  type: 'REMOVE_FROM_DELETION_CUE',
                  payload: messageId,
                });
              }
            }
          }}
        >
          {editMode && (
            //  deletion cue toggle button
            <div
              className={`h-4 w-4 ml-8 rounded-full ${
                queuedForDelete ? 'bg-red-700' : 'border-2 border-slate-500'
              }`}
            ></div>
          )}

          <div className="p-4 my-4 ml-8 bg-sky-300 rounded-2xl break-words">
            <p>{content}</p>
          </div>
          <RiGhostSmileFill className="mx-4 self-center min-w-[1rem] min-h-[1rem]" />
        </div>
      )}
    </>
  );
}

export default Message;
