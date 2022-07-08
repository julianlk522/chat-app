const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case 'LOGOUT_USER':
      return {
        user: {},
        userContacts: [],
        selectedContact: null,
        messages: [],
        mostRecentMessages: [],
        queuedForDelete: [],
        loading: false,
      };
    case 'GET_ALL_CONTACTS':
      return {
        ...state,
        contacts: action.payload,
        loading: false,
      };
    case 'GET_USER_CONTACTS':
      return {
        ...state,
        userContacts: action.payload,
        loading: false,
      };
    case 'GET_USER_MESSAGES':
      return {
        ...state,
        messages: action.payload,
        loading: false,
      };
    case 'NEW_MESSAGE':
      return {
        ...state,
        messages: action.payload,
        loading: false,
      };
    case 'READ_CONTACT_MESSAGE':
      return {
        ...state,
        userContacts: state.userContacts.map(userContact => {
          return {
            ...userContact,
            recentMessage: {
              ...userContact.recentMessage,
              seen:
                userContact.user_id === action.payload
                  ? 1
                  : userContact.recentMessage.seen,
            },
          };
        }),
      };
    case 'CUE_FOR_DELETION':
      return {
        ...state,
        queuedForDelete: [...state.queuedForDelete, action.payload],
      };
    case 'REMOVE_FROM_DELETION_CUE':
      return {
        ...state,
        queuedForDelete: state.queuedForDelete.filter(id => {
          return id !== action.payload;
        }),
      };
    case 'RESET_DELETION_CUE':
      return {
        ...state,
        queuedForDelete: [],
      };
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: action.payload,
        loading: false,
      };
    case 'GET_RECENT_MESSAGES_FROM_CONTACTS':
      return {
        ...state,
        mostRecentMessages: action.payload,
        loading: false,
      };
    case 'SET_SELECTED_CONTACT':
      return {
        ...state,
        selectedContact: action.payload,
      };
    default:
      return state;
  }
};

export default chatReducer;
