const chatReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: true
            }
        case 'LOGIN_USER':
            localStorage.setItem('user', JSON.stringify(action.payload))
            return {
                ...state,
                user: action.payload,
                loading: false
            }
        case 'GET_USER_CONTACTS':
            return {
                ...state,
                contacts: new Set(action.payload.map(contact => contact.name)),
                loading: false
            }
        case 'GET_MESSAGES':
            return {
                ...state,
                messages: action.payload,
                loading: false
            }
        default:
            return state
    }
}

export default chatReducer