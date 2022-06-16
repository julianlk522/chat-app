const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'LOGIN_USER':
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case 'GET_USER_CONTACTS':
      return {
        ...state,
        contacts: action.payload,
        loading: false,
      };
    case 'GET_USER_MESSAGES':
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
    default:
      return state;
  }
};

export default chatReducer;
