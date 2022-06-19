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
        contacts: [],
        selectedContact: null,
        messages: [],
        mostRecentMessages: [],
        loading: false,
      };
    case 'GET_USER_CONTACTS':
      return {
        ...state,
        contacts: action.payload,
        selectedContact: action.payload[0].user_id,
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
