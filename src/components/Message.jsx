import React from 'react';
import { RiGhostSmileFill, RiGhostSmileLine } from 'react-icons/ri';

function Message({ senderId, currentUserId, content }) {
  return (
    <>
      {senderId !== currentUserId ? (
        <div className="flex">
          <RiGhostSmileLine className="mx-4 self-center min-w-[1rem] min-h-[1rem]" />
          <div className="p-4 my-4 mr-12 bg-slate-200 rounded-2xl break-words">
            <p>{content}</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <div className="p-4 my-4 ml-12 bg-sky-300 rounded-2xl break-words">
            <p>{content}</p>
          </div>
          <RiGhostSmileFill className="mx-4 self-center min-w-[1rem] min-h-[1rem]" />
        </div>
      )}
    </>
  );
}

export default Message;
