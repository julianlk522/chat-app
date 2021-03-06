import React, { useState, useContext, useEffect, useRef } from 'react';
import ChatContext from '../context/ChatContext';
import { useSelectedContactInfo } from '../hooks/useSelectedContactInfo';
import {
  createNewMessage,
  deleteMessage,
  deleteMultipleMessages,
  getSortedUserContacts,
} from '../context/ChatActions';
import { toast } from 'react-toastify';
import { formatDistanceToNowStrict } from 'date-fns';
import Message from './Message';
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
      //  if not an existing contact then return false (offline)
      const selectedContactIsAnExistingContact = state.userContacts.some(
        userContact => userContact.user_id === selectedContactId
      );

      //  for demonstration, we assume there is an 80% chance an existing contact is online
      const onlineScore = Math.random();
      if (selectedContactIsAnExistingContact && onlineScore > 0.2)
        setRandomlyOnline(true);
      else setRandomlyOnline(false);
    };
    randomlyAssignOnlineStatus();
    // eslint-disable-next-line
  }, [selectedContactId]);

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [selectedContactMessages]);

  const submitMessage = async () => {
    dispatch({ type: 'SET_LOADING' });

    const updatedMessages = await createNewMessage(
      currentUserId,
      selectedContactId,
      newMessage
    );
    dispatch({ type: 'NEW_MESSAGE', payload: updatedMessages[0] });
    updateUserContacts();
    setNewMessage('');
  };

  //  delete one or multiple messages
  const deleteMessages = async () => {
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
      const messagesMinusSeveral = await deleteMultipleMessages(
        currentUserId,
        queuedForDeleteArray.toString()
      );
      dispatch({
        type: 'DELETE_MESSAGE',
        payload: messagesMinusSeveral[0],
      });
    }
    updateUserContacts();
    checkIfAllMessagesDeleted();
    setNewMessage('');
    setEditMode(false);
    setConfirmDelete(false);
    dispatch({ type: 'RESET_DELETION_CUE' });
  };

  const onNewMessageChange = e => {
    //  no quote chars allowed so MySQL stays happy
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

  const updateUserContacts = async () => {
    const contactsData = await getSortedUserContacts(currentUserId);
    dispatch({
      type: 'SET_USER_CONTACTS',
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
  };

  const checkIfAllMessagesDeleted = () => {
    const selectedContactMessagesIdsArray = selectedContactMessages.map(
      message => {
        return message.message_id;
      }
    );

    const deletedAllMessages = selectedContactMessagesIdsArray.every(
      message_id => {
        return queuedForDeleteArray.indexOf(message_id) !== -1;
      }
    );

    //  if all messages from a contact deleted, set the selected contact to the next one on the list
    if (deletedAllMessages) {
      const nextContactOnSortedList = state.userContacts.sort((a, b) => {
        if (a.recentMessage?.created_at > b.recentMessage?.created_at)
          return -1;
        if (b.recentMessage?.created_at > a.recentMessage?.created_at) return 1;
        else return 0;
      })[1].user_id;

      dispatch({
        type: 'SET_SELECTED_CONTACT',
        payload: nextContactOnSortedList,
      });
    }
  };

  return (
    <div
      id="conversation"
      className="flex flex-col w-1/2 border-x-2 border-x-slate-300 overflow-hidden"
    >
      <div
        id="convoHeader"
        className={`flex items-center h-[10vh] p-8 ${
          state?.contacts?.length ? 'justify-between' : 'justify-end'
        }`}
      >
        <div id="recipientNameArea" className="flex flex-grow items-center">
          <h3 className="text-2xl mr-4">
            {selectedContactNickname
              ? selectedContactNickname
              : selectedContactName
              ? selectedContactName
              : state?.contacts?.filter(contact => {
                  return contact.user_id === selectedContactId;
                })[0]?.name}
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
          ) : selectedContactId ? (
            <h3 id="lastActive" className="text-xs text-center mx-4">
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
          ) : (
            <h3 id="noContactInfo" className="text-md mx-4">
              Your next contact's name will appear here!
            </h3>
          )}
        </div>
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

          <button
            className="mr-4 bg-sky-600 hover:bg-sky-700 py-2 rounded-full text-white"
            onClick={() => toast('Coming soon!', toastOptions)}
          >
            <MdCall className="mx-2" />
          </button>

          <button
            className="bg-sky-600 hover:bg-sky-700 py-2 rounded-full text-white"
            onClick={() => toast('Coming soon!', toastOptions)}
          >
            <MdVideoCall className="mx-2" />
          </button>
        </div>
      </div>

      <hr className="bg-black h-1 opacity-5 rounded-2xl w-[80%] self-center" />

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
        className="bg-slate-200 self-end w-full h-[10vh] flex justify-between items-center p-8"
      >
        <input
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
            className="focus:outline-none rounded-2xl bg-red-600 hover:bg-red-700 p-2 text-sm"
            onClick={() => {
              setConfirmDelete(!confirmDelete);
              if (confirmDelete) deleteMessages();
            }}
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

            <button
              className="bg-sky-600 hover:bg-sky-700 py-2 rounded-full text-white"
              onClick={() => toast('Coming soon!', toastOptions)}
            >
              <MdAttachment className="mx-2 min-w-[1rem] min-h-[1rem]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Conversation;
