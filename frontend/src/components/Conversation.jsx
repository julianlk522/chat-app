import React, { useState, useContext, useEffect } from 'react';
import ChatContext from '../context/ChatContext';
import {
  createNewMessage,
  getUserMostRecentMessagesFromContacts,
  deleteMessage,
  deleteMultipleMessages,
  getUserContacts,
} from '../context/ChatActions';
import {
  MdCall,
  MdVideoCall,
  MdSend,
  MdAttachment,
  MdDelete,
} from 'react-icons/md';
import Message from './Message';

function Conversation() {
  //  context (user, messages, selectedContact, queuedForDelete)
  const { state, dispatch } = useContext(ChatContext);
  const currentUserId = state.user.user_id;
  const currentUserPreferedPic = state.user.prefered_pic;
  const selectedContactId = state.selectedContact;
  const selectedContactName = state.contacts?.filter(contact => {
    return contact.user_id === selectedContactId;
  })[0]?.name;
  const selectedContactPreferedPic = state.contacts?.filter(contact => {
    return contact.user_id === selectedContactId;
  })[0]?.prefered_pic;
  const userMessages =
    state.messages && state.messages.length > 0
      ? state?.messages?.filter(message => {
          return (
            message.sender_id === selectedContactId ||
            message.receiver_id === selectedContactId
          );
        })
      : [];
  const queuedForDeleteArray = state.queuedForDelete;
  //  confirm delete message state
  const [confirmDelete, setConfirmDelete] = useState(false);
  //  newMessage state
  const [newMessage, setNewMessage] = useState('');
  //  editMode state
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setEditMode(false);
  }, [selectedContactId]);

  //  change newMessage state to user input unless there are quote characters
  const onNewMessageChange = e => {
    if (
      e.target.value.indexOf('"') !== -1 ||
      e.target.value.indexOf("'") !== -1
    ) {
      console.log('no quote characters allowed!');
      return;
    }
    setNewMessage(e.target.value);
  };

  //  create new message
  const submitMessage = async e => {
    e.preventDefault();
    dispatch({ type: 'SET_LOADING' });
    //  update messages state
    const updatedMessages = await createNewMessage(
      currentUserId,
      selectedContactId,
      newMessage
    );
    dispatch({ type: 'NEW_MESSAGE', payload: updatedMessages[0] });
    //  update userContacts state if needed
    if (
      !state.userContacts
        .map(userContact => {
          return userContact.user_id;
        })
        .includes(selectedContactId)
    ) {
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
          };
        }),
      });
    }
    //  update mostRecentMessages state
    const updatedContactMsgData = await getUserMostRecentMessagesFromContacts(
      currentUserId
    );
    dispatch({
      type: 'GET_RECENT_MESSAGES_FROM_CONTACTS',
      payload: updatedContactMsgData[0],
    });
    setNewMessage('');
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
          <div
            id="recipientNameArea"
            className="flex justify-center items-center"
          >
            <h3 className="text-3xl mr-4 min-w-[33%]">
              {selectedContactName ?? ''}
            </h3>

            <span id="typingStatus" className="mx-4">
              typing...
            </span>
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

      <div id="conversationBody" className="h-4/5">
        {userMessages &&
          userMessages.map((message, index) => {
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
