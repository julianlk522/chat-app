import React, { useState, useContext, useEffect, useRef } from 'react';
import ChatContext from '../context/ChatContext';
import { useSelectedContactInfo } from '../hooks/useSelectedContactInfo';
import {
  createNewMessage,
  deleteMessage,
  deleteMultipleMessages,
  getUserContacts,
} from '../context/ChatActions';
import { toast } from 'react-toastify';
import Message from './Message';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  MdCall,
  MdVideoCall,
  MdSend,
  MdAttachment,
  MdDelete,
} from 'react-icons/md';

function Conversation() {
  const toastOptions = {
    autoClose: 4000,
    position: toast.POSITION.BOTTOM_RIGHT,
  };

  const scrollRef = useRef(null);

  //  context
  const { state, dispatch } = useContext(ChatContext);
  const currentUserId = state.user.user_id;
  const currentUserPreferedPic = state.user.prefered_pic;

  const selectedContactId = state.selectedContact;
  const {
    selectedContactName,
    selectedContactNickname,
    selectedContactPreferedPic,
    selectedContactLastActive,
    selectedContactMessages,
  } = useSelectedContactInfo();

  const queuedForDeleteArray = state.queuedForDelete;

  //  local state
  const [randomlyOnline, setRandomlyOnline] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setEditMode(false);
  }, [selectedContactId]);

  useEffect(() => {
    const randomlyAssignOnlineStatus = () => {
      //  for demonstration, we assume there is an 80% chance a contact is online
      const onlineScore = Math.random();
      if (onlineScore > 0.2) setRandomlyOnline(true);
      else setRandomlyOnline(false);
    };
    randomlyAssignOnlineStatus();
  }, [selectedContactId]);

  //  change newMessage state to user input unless there are quote characters
  const onNewMessageChange = e => {
    if (
      e.target.value.indexOf('"') !== -1 ||
      e.target.value.indexOf("'") !== -1
    ) {
      toast.error(
        'Sorry, no quote characters allowed in your message!',
        toastOptions
      );
      return;
    }
    setNewMessage(e.target.value);
  };

  //  create new message
  const submitMessage = async () => {
    dispatch({ type: 'SET_LOADING' });
    //  update messages state
    const updatedMessages = await createNewMessage(
      currentUserId,
      selectedContactId,
      newMessage
    );
    dispatch({ type: 'NEW_MESSAGE', payload: updatedMessages[0] });

    //  update userContacts state
    const contactsData = await getUserContacts(currentUserId);
    dispatch({
      type: 'GET_USER_CONTACTS',
      payload: contactsData[0].map(contactData => {
        return {
          name: contactData.name,
          user_id: contactData.user_id,
          prefered_pic: contactData.prefered_pic,
          recentMessage: {
            content: contactData.content,
            created_at: contactData.created_at,
            seen: contactData.seen,
            sender_id: contactData.sender_id,
          },
          last_active: contactData.last_active,
        };
      }),
    });
    setNewMessage('');
    scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  //  delete message(s)
  const triggerDeleteMessage = async e => {
    e.preventDefault();
    setConfirmDelete(!confirmDelete);
    //  check if user has confirmed delete before calling actions
    if (confirmDelete) {
      setNewMessage('');
      dispatch({ type: 'SET_LOADING' });
      //  case for one deletion
      if (queuedForDeleteArray.length === 1) {
        const messagesMinusOne = await deleteMessage(
          currentUserId,
          queuedForDeleteArray[0].toString()
        );
        dispatch({ type: 'DELETE_MESSAGE', payload: messagesMinusOne[0] });
        //  case for multiple deletion
      } else {
        const messageMinusSeveral = await deleteMultipleMessages(
          currentUserId,
          queuedForDeleteArray.toString()
        );
        dispatch({
          type: 'DELETE_MESSAGE',
          payload: messageMinusSeveral[0],
        });
      }
    } else return;
  };

  return (
    <div
      id="conversation"
      className="flex flex-col w-1/2 border-x-2 border-x-slate-300 overflow-hidden"
    >
      <div
        id="convoHeader"
        className={`flex items-center h-[10%] p-8 ${
          state?.contacts?.length ? 'justify-between' : 'justify-end'
        }`}
      >
        {state.userContacts.length > 0 && (
          <div id="recipientNameArea" className="flex flex-grow items-center">
            <h3 className="text-3xl mr-4">
              {selectedContactNickname
                ? selectedContactNickname
                : selectedContactName
                ? selectedContactName
                : state?.contacts?.filter(contact => {
                    return contact.user_id === selectedContactId;
                  })[0]?.name ?? ''}
            </h3>

            {selectedContactLastActive && randomlyOnline ? (
              <div
                id="infoIfContactOnlineDiv"
                className="flex justify-center items-center"
              >
                <div
                  id="onlineStatus"
                  className="w-4 h-4 mx-4 rounded-full bg-lime-500"
                ></div>
                <span id="typingStatus" className="mx-4">
                  typing...
                </span>
              </div>
            ) : (
              <h3 id="lastActive" className="text-sm mx-4">
                last active:
                <span id="formattedLastActive" className="mx-2">
                  {selectedContactLastActive
                    ? formatDistanceToNowStrict(
                        new Date(selectedContactLastActive)
                      ) + ' '
                    : '2 hours '}
                  ago
                </span>
              </h3>
            )}
          </div>
        )}

        <div id="conversationOptions" className="flex">
          <button
            className={`mr-4 ${
              !editMode
                ? 'bg-sky-600 hover:bg-sky-700'
                : 'bg-red-600 hover:bg-red-700'
            } py-2 rounded-full text-white`}
            onClick={() => {
              setEditMode(!editMode);
              dispatch({ type: 'RESET_DELETION_CUE' });
              setConfirmDelete(false);
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

      <div id="conversationBody" className="h-4/5 overflow-y-scroll">
        {selectedContactMessages &&
          selectedContactMessages.map((message, index) => {
            return (
              <Message
                messageId={message.message_id}
                senderId={message.sender_id}
                currentUserId={currentUserId}
                currentUserPreferedPic={currentUserPreferedPic}
                selectedContactId={selectedContactId}
                selectedContactPreferedPic={selectedContactPreferedPic}
                content={message.content}
                editMode={editMode}
                key={index}
              />
            );
          })}
        <div id="scrollRefDiv" ref={scrollRef}></div>
      </div>

      <div
        id="conversationTypingArea"
        className="bg-slate-200 self-end w-full h-[10%] flex justify-between items-center p-8"
      >
        <input
          type="text"
          value={newMessage}
          placeholder="Type something to send..."
          autoComplete="off"
          onChange={onNewMessageChange}
          onKeyDown={e => {
            if (newMessage.length && e.key === 'Enter') submitMessage();
          }}
          id="typingAreaInputBox"
          className="w-full mr-8 px-4 outline-slate-200 rounded-xl"
        />

        {editMode && queuedForDeleteArray.length > 0 ? (
          <button
            id="deleteMessagesButton"
            className="rounded-2xl bg-red-600 hover:bg-red-700 p-2 text-sm"
            onClick={triggerDeleteMessage}
          >
            {!confirmDelete
              ? queuedForDeleteArray.length === 1
                ? 'Delete message?'
                : 'Delete messages?'
              : 'Are you sure?'}
          </button>
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default Conversation;
